import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { copyFileSync, mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

const auditor = fileURLToPath(new URL('./audit-open-source-licenses.mjs', import.meta.url));
const valid = {
  lockfileVersion: 3,
  packages: {
    '': { name: 'test-project', version: '1.0.0' },
    'node_modules/example': { license: 'MIT' },
  },
};

function runAudit(lock) {
  const dir = mkdtempSync(join(tmpdir(), 'ccp-license-audit-'));
  try {
    mkdirSync(join(dir, 'scripts'));
    copyFileSync(auditor, join(dir, 'scripts', 'audit-open-source-licenses.mjs'));
    writeFileSync(join(dir, 'package-lock.json'), JSON.stringify(lock));
    return spawnSync(process.execPath, [join(dir, 'scripts', 'audit-open-source-licenses.mjs')], {
      encoding: 'utf8', timeout: 5000,
    });
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

test('valid root and MIT dependency pass', () => {
  const result = runAudit(valid);
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /passed for 1 dependency packages/);
});

test('missing packages object fails closed', () => {
  const result = runAudit({ lockfileVersion: 3 });
  assert.equal(result.status, 1);
  assert.match(result.stderr, /no complete dependency inventory/);
});

test('empty packages object fails closed', () => {
  const result = runAudit({ lockfileVersion: 3, packages: {} });
  assert.equal(result.status, 1);
});

test('root-only lockfile fails closed', () => {
  const result = runAudit({ lockfileVersion: 3, packages: { '': { name: 'test-project' } } });
  assert.equal(result.status, 1);
});

test('dependency inventory without root fails closed', () => {
  const result = runAudit({ lockfileVersion: 3, packages: { 'node_modules/example': { license: 'MIT' } } });
  assert.equal(result.status, 1);
});

test('malformed packages array fails closed', () => {
  const result = runAudit({ lockfileVersion: 3, packages: [] });
  assert.equal(result.status, 1);
});

test('blocked GPL license still fails', () => {
  const lock = structuredClone(valid);
  lock.packages['node_modules/example'].license = 'GPL-3.0-only';
  const result = runAudit(lock);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /blocked license/);
});

test('missing dependency license still fails', () => {
  const lock = structuredClone(valid);
  delete lock.packages['node_modules/example'].license;
  const result = runAudit(lock);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /missing license metadata/);
});

test('review license remains a warning rather than a failure', () => {
  const lock = structuredClone(valid);
  lock.packages['node_modules/example'].license = 'CC-BY-4.0';
  const result = runAudit(lock);
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stderr, /audit warnings/);
});
