import { NextResponse } from 'next/server';
import { checkPostgresHealth } from '../../../../lib/pg-database';

export async function GET() {
  const database = await checkPostgresHealth();
  return NextResponse.json({ ok: database.ok, mode: 'live', storage: database.configured ? 'postgres' : 'memory', database }, { status: database.ok ? 200 : 503 });
}
