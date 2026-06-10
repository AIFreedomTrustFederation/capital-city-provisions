import { NextResponse } from 'next/server';
import { createOrder } from '../../../lib/ccp-database';
import { saveOrderToPostgres } from '../../../lib/pg-database';

type Lead = Record<string, any>;

type LeadRouting = {
  bucket: 'household-freezer-box' | 'wholesale' | 'confirmed-route' | 'waitlist-route' | 'giveaway' | 'promo-coupon' | 'support' | 'general';
  priority: 'high' | 'normal' | 'waitlist';
  ownerAction: string;
};

function clean(value: unknown) {
  return String(value || '').trim();
}

function yes(value: unknown) {
  return value === true || clean(value).toLowerCase() === 'true';
}

function classifyLead(lead: Lead): LeadRouting {
  const interest = clean(lead.interest).toLowerCase();
  const familySize = clean(lead.familySize).toLowerCase();
  const routeStatus = clean(lead.routeStatus).toLowerCase();
  const message = clean(lead.message).toLowerCase();
  const source = clean(lead.source).toLowerCase();
  const promoCode = clean(lead.promoCode).toLowerCase();

  if (yes(lead.noPurchaseEntry) || yes(lead.sweepstakesEntry) || source.includes('giveaway') || interest.includes('giveaway')) {
    return { bucket: 'giveaway', priority: 'normal', ownerAction: 'Record no-purchase sweepstakes entry. Do not require purchase or improve odds for buyers.' };
  }

  if (promoCode || interest.includes('coupon') || message.includes('coupon') || message.includes('cheesecake')) {
    return { bucket: 'promo-coupon', priority: 'high', ownerAction: 'Follow up on limited-time order bonus while keeping giveaway entry separate.' };
  }

  if (interest.includes('wholesale') || familySize.includes('wholesale')) {
    return { bucket: 'wholesale', priority: 'high', ownerAction: 'Review for wholesale pricing and recurring supply needs.' };
  }

  if (message.includes('support') || message.includes('existing order')) {
    return { bucket: 'support', priority: 'high', ownerAction: 'Follow up on customer support or existing order details.' };
  }

  if (routeStatus.includes('confirmed') || routeStatus.includes('available') || routeStatus.includes('almost full')) {
    return { bucket: 'confirmed-route', priority: 'high', ownerAction: 'Contact quickly while delivery route intent is warm.' };
  }

  if (routeStatus.includes('waitlist') || routeStatus.includes('expansion') || routeStatus.includes('building')) {
    return { bucket: 'waitlist-route', priority: 'waitlist', ownerAction: 'Group with nearby route demand and follow up when route fills.' };
  }

  if (interest.includes('box') || interest.includes('steak') || interest.includes('restock')) {
    return { bucket: 'household-freezer-box', priority: 'normal', ownerAction: 'Match household to freezer box and delivery route.' };
  }

  return { bucket: 'general', priority: 'normal', ownerAction: 'Review lead and assign follow-up owner.' };
}

function buildOwnerText(lead: Lead, routing: LeadRouting) {
  const lines = [
    `New Capital City Provisions lead: ${routing.bucket}`,
    `Priority: ${routing.priority}`,
    `Action: ${routing.ownerAction}`,
    '',
    `Name: ${clean(lead.name) || 'Not provided'}`,
    `Email: ${clean(lead.email) || 'Not provided'}`,
    `Phone: ${clean(lead.phone) || 'Not provided'}`,
    `ZIP / Area: ${clean(lead.address || lead.zip) || 'Not provided'}`,
    `Route: ${clean(lead.route) || 'Not checked'}`,
    `Route Status: ${clean(lead.routeStatus) || 'Unknown'}`,
    `Route Fill: ${clean(lead.routeReserved) || '0'}/${clean(lead.routeCapacity) || '0'} grouped, ${clean(lead.routeSlotsRemaining) || '0'} open`,
    `Delivery: ${clean(lead.deliveryDay) || 'TBD'} ${clean(lead.deliveryWindow) || ''}`.trim(),
    `Interest: ${clean(lead.interest) || 'Not provided'}`,
    `Recommendation: ${clean(lead.recommendation) || 'Not provided'}`,
    `Budget: ${clean(lead.estimatedBudget || lead.budget) || 'Not provided'}`,
    `Promo: ${clean(lead.promoCode) || 'None'}`,
    `Coupon: ${clean(lead.couponOffer) || 'None'}`,
    `Coupon Deadline: ${clean(lead.promoExpiresAt) || clean(lead.couponDeadlineHours) || 'None'}`,
    `Sweepstakes Entry: ${yes(lead.sweepstakesEntry) ? 'Yes' : 'No'}`,
    `No-Purchase Entry: ${yes(lead.noPurchaseEntry) ? 'Yes' : 'No'}`,
    `Purchase Improves Odds: ${yes(lead.purchaseImprovesOdds || lead.purchaseImprovesGiveawayOdds) ? 'Yes - review immediately' : 'No'}`,
    `Message: ${clean(lead.message) || 'None'}`,
  ];

  return lines.join('\n');
}

function buildSheetRow(lead: Lead, routing: LeadRouting) {
  return {
    createdAt: lead.createdAt,
    bucket: routing.bucket,
    priority: routing.priority,
    ownerAction: routing.ownerAction,
    name: clean(lead.name),
    email: clean(lead.email),
    phone: clean(lead.phone),
    address: clean(lead.address || lead.zip),
    route: clean(lead.route),
    routeStatus: clean(lead.routeStatus),
    routeBadge: clean(lead.routeBadge),
    routeFill: clean(lead.routeFill),
    routeCapacity: clean(lead.routeCapacity),
    routeReserved: clean(lead.routeReserved),
    routeSlotsRemaining: clean(lead.routeSlotsRemaining),
    deliveryDay: clean(lead.deliveryDay),
    deliveryWindow: clean(lead.deliveryWindow),
    interest: clean(lead.interest),
    familySize: clean(lead.familySize),
    proteins: clean(lead.proteins),
    budget: clean(lead.estimatedBudget || lead.budget),
    recommendation: clean(lead.recommendation),
    promoCode: clean(lead.promoCode),
    couponOffer: clean(lead.couponOffer),
    couponDeadlineHours: clean(lead.couponDeadlineHours),
    promoExpiresAt: clean(lead.promoExpiresAt),
    sweepstakesEntry: yes(lead.sweepstakesEntry),
    noPurchaseEntry: yes(lead.noPurchaseEntry),
    purchaseRequired: yes(lead.purchaseRequired),
    purchaseImprovesOdds: yes(lead.purchaseImprovesOdds || lead.purchaseImprovesGiveawayOdds),
    officialRulesVersion: clean(lead.officialRulesVersion),
    smsReady: yes(lead.smsReady) || !!clean(lead.phone),
    message: clean(lead.message),
    source: clean(lead.source),
  };
}

function lifecycleFromLead(lead: Lead, routing: LeadRouting) {
  if (routing.bucket === 'giveaway' || routing.bucket === 'support' || routing.bucket === 'general') return null;
  const budgetText = clean(lead.estimatedBudget || lead.budget);
  const budgetMatch = budgetText.match(/\$?([0-9,]+)/g)?.pop()?.replace(/[$,]/g, '');
  const value = Number(budgetMatch || 0) || (routing.bucket === 'wholesale' ? 1000 : 500);
  return createOrder({
    customerName: clean(lead.name) || 'New Lead',
    phone: clean(lead.phone),
    zip: clean(lead.zip || lead.address),
    routeId: clean(lead.route)?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'route-intake',
    box: clean(lead.recommendation || lead.interest) || 'Freezer Box',
    status: routing.bucket === 'waitlist-route' ? 'quoted' : 'ordered',
    fulfillment: 'pending',
    value,
    deliveryDate: clean(lead.deliveryDay) || 'TBD',
    deliveryWindow: clean(lead.deliveryWindow) || 'TBD',
    products: clean(lead.proteins).split(',').filter(Boolean).map((protein, index) => ({ sku: `LEAD-${index + 1}`, name: protein.trim(), qty: 1, unit: 'preference', fulfilled: 0 })),
    notes: clean(lead.message),
    promo: clean(lead.promoCode),
  });
}

async function postJson(url: string | undefined, body: unknown) {
  if (!url) return { configured: false, ok: false };

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  return { configured: true, ok: response.ok, status: response.status };
}

export async function POST(request: Request) {
  try {
    const lead = await request.json();
    const createdAt = new Date().toISOString();
    const enrichedLead = { createdAt, source: 'capital-city-provisions-site', ...lead };
    const routing = classifyLead(enrichedLead);
    const lifecycleOrder = lifecycleFromLead(enrichedLead, routing);
    const postgres = lifecycleOrder ? await saveOrderToPostgres(lifecycleOrder) : { configured: false, ok: false, skipped: true };
    const ownerText = buildOwnerText(enrichedLead, routing);
    const sheetRow = { ...buildSheetRow(enrichedLead, routing), lifecycleOrderId: lifecycleOrder?.id || '' };
    const payload = { ...enrichedLead, routing, ownerText, sheetRow, lifecycleOrder };

    const [ownerWebhook, sheetWebhook] = await Promise.allSettled([
      postJson(process.env.LEADS_WEBHOOK_URL, {
        text: ownerText,
        lead: payload,
      }),
      postJson(process.env.LEADS_GOOGLE_SHEETS_WEBHOOK_URL, sheetRow),
    ]);

    console.log('Capital City Provisions lead:', payload);

    return NextResponse.json({
      ok: true,
      message: 'Lead received',
      lead: payload,
      routing,
      lifecycleOrder,
      storage: { postgres },
      notifications: {
        ownerWebhook: ownerWebhook.status === 'fulfilled' ? ownerWebhook.value : { configured: !!process.env.LEADS_WEBHOOK_URL, ok: false },
        googleSheets: sheetWebhook.status === 'fulfilled' ? sheetWebhook.value : { configured: !!process.env.LEADS_GOOGLE_SHEETS_WEBHOOK_URL, ok: false },
      },
    });
  } catch (error) {
    console.error('Lead submission failed:', error);
    return NextResponse.json({ ok: false, message: 'Lead submission failed' }, { status: 500 });
  }
}
