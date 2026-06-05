import { NextResponse } from 'next/server';

type Lead = Record<string, any>;

type LeadRouting = {
  bucket: 'household-freezer-box' | 'wholesale' | 'confirmed-route' | 'waitlist-route' | 'support' | 'general';
  priority: 'high' | 'normal' | 'waitlist';
  ownerAction: string;
};

function clean(value: unknown) {
  return String(value || '').trim();
}

function classifyLead(lead: Lead): LeadRouting {
  const interest = clean(lead.interest).toLowerCase();
  const familySize = clean(lead.familySize).toLowerCase();
  const routeStatus = clean(lead.routeStatus).toLowerCase();
  const message = clean(lead.message).toLowerCase();

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
    `ZIP / Area: ${clean(lead.address) || 'Not provided'}`,
    `Route: ${clean(lead.route) || 'Not checked'}`,
    `Route Status: ${clean(lead.routeStatus) || 'Unknown'}`,
    `Delivery: ${clean(lead.deliveryDay) || 'TBD'} ${clean(lead.deliveryWindow) || ''}`.trim(),
    `Interest: ${clean(lead.interest) || 'Not provided'}`,
    `Recommendation: ${clean(lead.recommendation) || 'Not provided'}`,
    `Budget: ${clean(lead.estimatedBudget || lead.budget) || 'Not provided'}`,
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
    address: clean(lead.address),
    route: clean(lead.route),
    routeStatus: clean(lead.routeStatus),
    deliveryDay: clean(lead.deliveryDay),
    deliveryWindow: clean(lead.deliveryWindow),
    interest: clean(lead.interest),
    familySize: clean(lead.familySize),
    proteins: clean(lead.proteins),
    budget: clean(lead.estimatedBudget || lead.budget),
    recommendation: clean(lead.recommendation),
    message: clean(lead.message),
    source: clean(lead.source),
  };
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
    const ownerText = buildOwnerText(enrichedLead, routing);
    const sheetRow = buildSheetRow(enrichedLead, routing);
    const payload = { ...enrichedLead, routing, ownerText, sheetRow };

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
