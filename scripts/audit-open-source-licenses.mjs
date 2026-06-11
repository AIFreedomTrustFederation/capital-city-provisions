import fs from 'node:fs';

const lockPath = new URL('../package-lock.json', import.meta.url);
const lock = JSON.parse(fs.readFileSync(lockPath, 'utf8'));

const allowed = new Set([
  '0BSD',
  'Apache-2.0',
  'BSD-2-Clause',
  'BSD-3-Clause',
  'BlueOak-1.0.0',
  'CC0-1.0',
  'CC-BY-4.0',
  'ISC',
  'LGPL-3.0-or-later',
  'MIT',
  'MIT-0',
  'MPL-2.0',
  'Python-2.0',
]);

const review = new Set(['CC-BY-4.0', 'LGPL-3.0-or-later']);
const blockedPattern = /\b(AGPL|GPL|SSPL|BUSL|Commercial|Proprietary|UNLICENSED)\b/i;

function packageName(path) {
  return path.replace(/^node_modules\//, '') || '(root package)';
}

function licenseTokens(license) {
  return String(license || '')
    .replace(/[()]/g, ' ')
    .split(/\s+(?:AND|OR)\s+|\s*[|/]\s*/i)
    .map((token) => token.trim())
    .filter(Boolean);
}

const failures = [];
const warnings = [];
const packages = Object.entries(lock.packages || {}).filter(([path]) => path);

for (const [path, meta] of packages) {
  const name = packageName(path);
  const license = meta.license;
  if (!license) {
    failures.push(`${name}: missing license metadata`);
    continue;
  }
  if (blockedPattern.test(String(license))) {
    failures.push(`${name}: blocked license ${license}`);
    continue;
  }
  const tokens = licenseTokens(license);
  const unknown = tokens.filter((token) => !allowed.has(token));
  if (unknown.length) {
    failures.push(`${name}: unknown license ${license}`);
    continue;
  }
  const needsReview = tokens.filter((token) => review.has(token));
  if (needsReview.length) {
    warnings.push(`${name}: review ${license}`);
  }
}

if (warnings.length) {
  console.warn(`Open-source license audit warnings (${warnings.length}):`);
  for (const item of warnings) console.warn(`- ${item}`);
}

if (failures.length) {
  console.error(`Open-source license audit failed (${failures.length}):`);
  for (const item of failures) console.error(`- ${item}`);
  process.exit(1);
}

console.log(`Open-source license audit passed for ${packages.length} dependency packages.`);
