'use strict';
const assert = require('assert');
const { test, call, handlers, useClient } = require('./tools-check');

test('observability read tools build the expected query strings', async () => {
  let r = await call('joytree_observability_summary', { range: '7d', project: 'my-app' });
  assert.strictEqual(r.calls[0].path, '/api/observability/summary?range=7d&project=my-app');
  r = await call('joytree_observability_summary', {});
  assert.strictEqual(r.calls[0].path, '/api/observability/summary');
  r = await call('joytree_observability_series', { metric: 'cpu', range: '1h', resource: 'project:abc' });
  assert.strictEqual(r.calls[0].path, '/api/observability/series?metric=cpu&range=1h&resource=project%3Aabc');
  r = await call('joytree_observability_resources', {});
  assert.strictEqual(r.calls[0].path, '/api/observability/resources');
  r = await call('joytree_observability_cache', { range: '24h' });
  assert.strictEqual(r.calls[0].path, '/api/observability/cache?range=24h');
});

test('observability_requests switches between row and group endpoints', async () => {
  let r = await call('joytree_observability_requests', { status: '5xx', sort: 'duration', limit: 10 });
  assert.strictEqual(r.calls[0].path, '/api/observability/requests?status=5xx&limit=10&sort=duration');
  r = await call('joytree_observability_requests', { groupBy: 'path', metric: 'errors', range: '6h' });
  assert.ok(r.calls[0].path.startsWith('/api/observability/query?'));
  assert.ok(r.calls[0].path.includes('groupBy=path') && r.calls[0].path.includes('metric=errors'));
  assert.ok(!r.calls[0].path.includes('sort='));
});

test('alert_rule create / update / delete and validation', async () => {
  let r = await call('joytree_observability_alert_rule', { action: 'create', name: 'High errors', metric: 'error_rate', threshold: 5, severity: 'critical' });
  assert.deepStrictEqual([r.calls[0].method, r.calls[0].path], ['POST', '/api/observability/rules']);
  assert.strictEqual(r.calls[0].body.threshold, 5);
  r = await call('joytree_observability_alert_rule', { action: 'create', name: 'Down', metric: 'down' });
  assert.strictEqual(r.calls.length, 1, 'down needs no threshold');
  // update merges over the stored rule so the webhook (not shown in the alerts listing) survives
  const stored = { id: 'ru_1', name: 'High CPU', metric: 'cpu', op: '>', threshold: 80, windowMinutes: 5, severity: 'warning', enabled: true, target: 'all', webhookUrl: 'https://hooks.example/a' };
  const puts = [];
  useClient({
    get: async (p) => { assert.strictEqual(p, '/api/observability/rules'); return { ok: true, items: [stored] }; },
    put: async (p, b) => { puts.push([p, b]); return { ok: true }; },
  });
  try {
    await handlers.joytree_observability_alert_rule({ action: 'update', ruleId: 'ru_1', threshold: 90 }, {});
    assert.strictEqual(puts[0][0], '/api/observability/rules/ru_1');
    assert.strictEqual(puts[0][1].threshold, 90);
    assert.strictEqual(puts[0][1].webhookUrl, 'https://hooks.example/a');
    assert.strictEqual(puts[0][1].name, 'High CPU');
    await handlers.joytree_observability_alert_rule({ action: 'update', ruleId: 'ru_1', webhookUrl: '' }, {});
    assert.strictEqual(puts[1][1].webhookUrl, '');
    const missing = await handlers.joytree_observability_alert_rule({ action: 'update', ruleId: 'nope', threshold: 1 }, {});
    assert.strictEqual(missing.isError, true);
    assert.strictEqual(puts.length, 2);
  } finally { useClient(null); }
  r = await call('joytree_observability_alert_rule', { action: 'delete', ruleId: 'ru_1' });
  assert.deepStrictEqual([r.calls[0].method, r.calls[0].path], ['DELETE', '/api/observability/rules/ru_1']);
  for (const args of [{ action: 'create', name: 'n' }, { action: 'create', name: 'n', metric: 'cpu' }, { action: 'delete' }, { action: 'update', name: 'n' }]) {
    r = await call('joytree_observability_alert_rule', args);
    assert.strictEqual(r.res.isError, true, JSON.stringify(args));
    assert.strictEqual(r.calls.length, 0);
  }
});

test('project metrics, rollback and CDN map to the right endpoints', async () => {
  let r = await call('joytree_project_metrics', { projectId: 'my-app' });
  assert.strictEqual(r.calls[0].path, '/api/projects/my-app/metrics');
  r = await call('joytree_rollback_deployment', { deploymentId: 'dep_9' });
  assert.deepStrictEqual([r.calls[0].method, r.calls[0].path], ['POST', '/api/deployments/dep_9/rollback']);
  r = await call('joytree_cdn', { projectId: 'p', action: 'enable' });
  assert.deepStrictEqual([r.calls[0].path, r.calls[0].body], ['/api/projects/p/cdn/toggle', { enabled: true }]);
  r = await call('joytree_cdn', { projectId: 'p', action: 'disable' });
  assert.deepStrictEqual(r.calls[0].body, { enabled: false });
  r = await call('joytree_cdn', { projectId: 'p', action: 'purge' });
  assert.strictEqual(r.calls[0].path, '/api/projects/p/cdn/purge');
  r = await call('joytree_cdn', { projectId: 'p', action: 'status' });
  assert.strictEqual(r.calls[0].method, 'GET');
});
