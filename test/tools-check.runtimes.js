'use strict';
// Live runtime list: a runtime the bundled list doesn't know is checked against
// GET /api/v1/runtimes before it is rejected, so new server-side frameworks work
// without an MCP release.
const assert = require('assert');
const { test, call, useClient, calls } = require('./tools-check');
const { _resetRuntimeCache } = require('../src/tools');

function liveClient(payload, { fail = false } = {}) {
  const seen = [];
  const c = {
    get: async (path) => { seen.push(path); if (fail) throw new Error('404'); return payload; },
    post: async (path, body) => { calls.push({ method: 'POST', path, body }); return { ok: true }; },
  };
  c.seen = seen;
  return c;
}
const args = (runtime) => ({ name: 'x', repoUrl: 'https://github.com/a/b', runtime });

test('unknown runtime that the live list knows is accepted and cached', async () => {
  _resetRuntimeCache();
  const c = liveClient({ ok: true, runtimes: ['node', 'swift-vapor'], aliases: { vapor: 'swift-vapor' } });
  useClient(c);
  try {
    let r = await call('joytree_deploy_from_github', args('swift-vapor'));
    assert.notStrictEqual(r.res.isError, true);
    assert.strictEqual(r.calls[0].body.runtime, 'swift-vapor');
    r = await call('joytree_deploy_from_github', args('vapor')); // alias, served from cache
    assert.notStrictEqual(r.res.isError, true);
    assert.strictEqual(c.seen.length, 1, 'live list should be fetched once and cached');
  } finally { useClient(null); _resetRuntimeCache(); }
});

test('value unknown to both lists is rejected and the error shows the live list', async () => {
  _resetRuntimeCache();
  useClient(liveClient({ ok: true, runtimes: ['node', 'swift-vapor'], aliases: {} }));
  try {
    const r = await call('joytree_deploy_from_github', args('cobol'));
    assert.strictEqual(r.res.isError, true);
    assert.match(r.res.content[0].text, /Unknown runtime/);
    assert.match(r.res.content[0].text, /swift-vapor/);
    assert.strictEqual(r.calls.length, 0);
  } finally { useClient(null); _resetRuntimeCache(); }
});

test('older server (endpoint fails): bundled list decides, known values still pass, typos still fail', async () => {
  _resetRuntimeCache();
  useClient(liveClient(null, { fail: true }));
  try {
    let r = await call('joytree_deploy_from_github', args('python-django'));
    assert.notStrictEqual(r.res.isError, true);
    r = await call('joytree_deploy_from_github', args('cobol'));
    assert.strictEqual(r.res.isError, true);
    assert.match(r.res.content[0].text, /Unknown runtime/);
  } finally { useClient(null); _resetRuntimeCache(); }
});

test('known runtimes never trigger a live lookup', async () => {
  _resetRuntimeCache();
  const c = liveClient({ ok: true, runtimes: ['node'], aliases: {} });
  useClient(c);
  try {
    await call('joytree_deploy_from_github', args('go-gin'));
    assert.strictEqual(c.seen.length, 0);
  } finally { useClient(null); _resetRuntimeCache(); }
});
