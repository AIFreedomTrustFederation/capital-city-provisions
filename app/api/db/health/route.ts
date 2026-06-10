import { NextResponse } from 'next/server';
import { checkPostgresHealth } from '../../../../lib/pg-database';

export async function GET() {
  const database = await checkPostgresHealth();
  const required = process.env.NODE_ENV === 'production' || process.env.CCP_REQUIRE_POSTGRES === 'true';
  const ok = database.ok && (!required || database.configured);
  return NextResponse.json({ ok, mode: 'live', storage: database.configured ? 'postgres' : 'memory', databaseRequired: required, database }, { status: ok ? 200 : 503 });
}
