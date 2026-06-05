import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const lead = await request.json();
    const createdAt = new Date().toISOString();
    const payload = { createdAt, source: 'capital-city-provisions-site', ...lead };

    if (process.env.LEADS_WEBHOOK_URL) {
      await fetch(process.env.LEADS_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    }

    console.log('Capital City Provisions lead:', payload);

    return NextResponse.json({ ok: true, message: 'Lead received', lead: payload });
  } catch (error) {
    console.error('Lead submission failed:', error);
    return NextResponse.json({ ok: false, message: 'Lead submission failed' }, { status: 500 });
  }
}
