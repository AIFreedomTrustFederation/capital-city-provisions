import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const workflow = readFileSync('.github/workflows/sync-preflight-to-main.yml', 'utf8');
const marker = '          script: |\n';
const start = workflow.indexOf(marker);
assert.notEqual(start, -1, 'promotion script must exist in workflow');
const lines = workflow.slice(start + marker.length).split('\n');
const body = [];
for (const line of lines) {
  if (line.startsWith('            ')) body.push(line.slice(12));
  else if (line.trim() === '') body.push('');
  else break;
}
const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
const execute = new AsyncFunction('context', 'github', 'core', body.join('\n'));
const owner = 'AIFreedomTrustFederation';
const repo = 'capital-city-provisions';
const sha = 'a'.repeat(40);

async function simulate(overrides = {}, currentSha = sha) {
  const updates = [];
  const run = {
    event: 'push', conclusion: 'success', head_branch: 'preflight',
    head_sha: sha, head_repository: { full_name: owner + '/' + repo },
    ...overrides,
  };
  const context = { repo: { owner, repo }, payload: { workflow_run: run } };
  const github = { rest: { git: {
    getRef: async (args) => {
      assert.deepEqual(args, { owner, repo, ref: 'heads/preflight' });
      return { data: { object: { sha: currentSha } } };
    },
    updateRef: async (args) => { updates.push(args); },
  } } };
  const core = {
    notice: () => {},
    setFailed: (message) => { throw new Error(message); },
  };
  await execute(context, github, core);
  return updates;
}

test('only current successful owned preflight push promotes its exact SHA without force', async () => {
  const updates = await simulate();
  assert.deepEqual(updates, [{ owner, repo, ref: 'heads/main', sha, force: false }]);
});

for (const [description, changes, currentSha] of [
  ['pull-request CI', { event: 'pull_request' }, sha],
  ['manual CI', { event: 'workflow_dispatch' }, sha],
  ['foreign repository CI', { head_repository: { full_name: 'other/repo' } }, sha],
  ['missing repository identity', { head_repository: null }, sha],
  ['wrong branch CI', { head_branch: 'main' }, sha],
  ['failed CI', { conclusion: 'failure' }, sha],
  ['stale successful CI', {}, 'b'.repeat(40)],
]) {
  test(description + ' must never promote main', async () => {
    assert.deepEqual(await simulate(changes, currentSha), []);
  });
}

test('workflow retains success-only job gate', () => {
  assert.match(workflow, /if:\s*\$\{\{ github\.event\.workflow_run\.conclusion == 'success' \}\}/);
});
