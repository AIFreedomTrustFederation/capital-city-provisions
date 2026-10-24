import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, readdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const script = resolve('auto-sync-safe.sh');

function command(cmd, args, cwd, env = process.env) {
  const result = spawnSync(cmd, args, { cwd, env, encoding: 'utf8', timeout: 30000 });
  if (result.error) throw result.error;
  return result;
}
function git(cwd, ...args) {
  const result = command('git', args, cwd);
  assert.equal(result.status, 0, `git ${args.join(' ')}: ${result.stderr}`);
  return result.stdout.trim();
}
function fixture(t, npmFails = false) {
  const dir = mkdtempSync(join(tmpdir(), 'ccp-sync-test-'));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  const remote = join(dir, 'remote.git');
  const work = join(dir, 'work');
  const bin = join(dir, 'bin');
  mkdirSync(bin);
  git(dir, 'init', '--bare', '-b', 'main', remote);
  git(dir, 'clone', remote, work);
  git(work, 'config', 'user.name', 'Sync Test');
  git(work, 'config', 'user.email', 'sync-test@example.invalid');
  writeFileSync(join(work, 'README.md'), 'original\n');
  git(work, 'add', 'README.md');
  git(work, 'commit', '-m', 'initial');
  git(work, 'push', '-u', 'origin', 'main');
  const initial = git(work, 'rev-parse', 'HEAD');
  writeFileSync(join(work, 'README.md'), 'uncommitted work\n');
  writeFileSync(join(bin, 'npm'), `#!/bin/sh\n${npmFails ? 'exit 1' : 'exit 0'}\n`, { mode: 0o755 });
  return { dir, remote, work, initial, env: { ...process.env, PATH: bin + ':' + process.env.PATH } };
}
function backupRef(remote) {
  const refs = git(remote, 'for-each-ref', '--format=%(refname:short)', 'refs/heads/auto-backup-');
  assert.equal(refs.split('\n').filter(Boolean).length, 1, 'exactly one remote backup branch');
  return refs.trim();
}

test('dirty checkout is backed up remotely without committing unvalidated work on main', t => {
  const f = fixture(t);
  const result = command('bash', [script], f.work, f.env);
  assert.equal(result.status, 0, result.stdout + result.stderr);
  assert.equal(git(f.work, 'rev-parse', 'main'), f.initial);
  assert.equal(git(f.remote, 'rev-parse', 'main'), f.initial);
  assert.equal(git(f.work, 'branch', '--show-current'), 'main');
  const ref = backupRef(f.remote);
  assert.equal(git(f.remote, 'show', ref + ':README.md'), 'uncommitted work');
});

test('failed validation does not publish main, while preserving the committed backup', t => {
  const f = fixture(t, true);
  const result = command('bash', [script], f.work, f.env);
  assert.notEqual(result.status, 0);
  assert.equal(git(f.work, 'rev-parse', 'main'), f.initial);
  assert.equal(git(f.remote, 'rev-parse', 'main'), f.initial);
  const ref = backupRef(f.remote);
  assert.equal(git(f.remote, 'show', ref + ':README.md'), 'uncommitted work');
});

test('non-main branch is rejected before changing the checkout', t => {
  const f = fixture(t);
  git(f.work, 'switch', '-c', 'feature');
  const result = command('bash', [script], f.work, f.env);
  assert.notEqual(result.status, 0);
  assert.equal(git(f.work, 'branch', '--show-current'), 'feature');
  assert.equal(git(f.remote, 'rev-parse', 'main'), f.initial);
});
