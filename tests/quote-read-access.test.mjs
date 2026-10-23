import test from 'node:test';
import assert from 'node:assert/strict';
import { quoteReadAccess } from '../lib/quote-read-access.mjs';

const secret = 'c7b4e9f2a1d80635c4b7e9f2a1d80635c4b7e9f2a1d80635';
function request(authorization, cookie) {
  const headers = new Headers();
  if (authorization !== undefined) headers.set('authorization', authorization);
  if (cookie !== undefined) headers.set('cookie', cookie);
  return { headers };
}

test('fails closed when read token is missing, short, or contains whitespace', () => {
  for (const token of [undefined, '', 'short', `${secret} trailing`]) {
    assert.equal(quoteReadAccess(request(`Bearer ${secret}`), token), 'unconfigured');
  }
});

test('rejects unauthenticated quote enumeration', () => {
  assert.equal(quoteReadAccess(request(), secret), 'unauthorized');
  assert.equal(quoteReadAccess(request(undefined, 'ccp_access=owner'), secret), 'unauthorized');
});

test('rejects wrong tokens and alternate authentication locations', () => {
  assert.equal(quoteReadAccess(request('Bearer wrong'), secret), 'unauthorized');
  assert.equal(quoteReadAccess(request(`Basic ${secret}`), secret), 'unauthorized');
  assert.equal(quoteReadAccess(request(secret), secret), 'unauthorized');
});

test('rejects malformed or oversized authorization headers', () => {
  assert.equal(quoteReadAccess(request(`Bearer ${secret} extra`), secret), 'unauthorized');
  assert.equal(quoteReadAccess(request(`Bearer ${'x'.repeat(4097)}`), secret), 'unauthorized');
});

test('accepts an exact bearer token with case-insensitive scheme', () => {
  assert.equal(quoteReadAccess(request(`Bearer ${secret}`), secret), 'authorized');
  assert.equal(quoteReadAccess(request(`bearer ${secret}`), secret), 'authorized');
});

test('rejects near-miss token of equal length', () => {
  assert.equal(quoteReadAccess(request(`Bearer ${secret.slice(0, -1)}x`), secret), 'unauthorized');
});
