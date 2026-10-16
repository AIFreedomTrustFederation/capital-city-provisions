import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const source = readFileSync(new URL('../app/api/leads/route.ts', import.meta.url), 'utf8');
const match = source.match(/const enrichedLead\s*=\s*(\{[^;\n]+\});/);
assert.ok(match, 'Lead intake must expose a single inspectable enrichment object');

function enrich(lead, createdAt) {
  return runInNewContext(`(${match[1]})`, { lead, createdAt });
}

test('server receipt timestamp overrides a caller-supplied timestamp', () => {
  const timestamp = '2026-10-16T04:00:00.000Z';
  const result = enrich({ name: 'Synthetic Example', createdAt: '2001-01-01T00:00:00.000Z' }, timestamp);
  assert.equal(result.createdAt, timestamp);
  assert.equal(result.name, 'Synthetic Example');
});

test('receivedVia remains authoritative even when a caller spoofs it', () => {
  const result = enrich({ receivedVia: 'external-service', source: 'giveaway' }, '2026-10-16T04:00:00.000Z');
  assert.equal(result.receivedVia, 'capital-city-provisions-site');
  assert.equal(result.source, 'giveaway', 'legacy caller-supplied routing source remains compatible');
});

test('default source remains unchanged for legacy submissions', () => {
  const result = enrich({ name: 'Synthetic Example' }, '2026-10-16T04:00:00.000Z');
  assert.equal(result.source, 'capital-city-provisions-site');
  assert.equal(result.receivedVia, 'capital-city-provisions-site');
});
