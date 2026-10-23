import { createHash, timingSafeEqual } from 'node:crypto';

/** The customer-intake GET endpoint exposes private quote/contact records. */
export function quoteReadAccess(request, configuredToken = process.env.CCP_QUOTE_READ_TOKEN) {
  if (typeof configuredToken !== 'string' || configuredToken.length < 32 || /\s/.test(configuredToken)) {
    return 'unconfigured';
  }

  const header = request.headers.get('authorization') || '';
  const match = /^Bearer ([^\s]+)$/i.exec(header);
  if (!match || match[1].length > 4096) return 'unauthorized';

  // Hash before comparing to avoid leaking the configured token's length.
  const expected = createHash('sha256').update(configuredToken).digest();
  const supplied = createHash('sha256').update(match[1]).digest();
  return timingSafeEqual(expected, supplied) ? 'authorized' : 'unauthorized';
}
