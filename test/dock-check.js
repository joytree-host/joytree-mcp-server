// "Works with" agent dock: real logos, accessible, motion-safe, no duplicate ids, script parses.
const assert = require('node:assert');
const { AGENT_DOCK_HTML, AGENT_DOCK_CSS, AGENT_DOCK_JS, AGENT_NAMES } = require('../src/agent-dock');
const { renderConnectPage } = require('../src/connect-page');

const WANT = ['Claude', 'Cursor', 'ChatGPT', 'Lovable', 'Zed', 'Cline', 'Raycast', 'Windsurf', 'Gemini', 'Antigravity'];
assert.deepStrictEqual(AGENT_NAMES, WANT, 'ten agents, in order');
assert.strictEqual((AGENT_DOCK_HTML.match(/class="dk-it"/g) || []).length, 10);
for (const n of WANT) assert.ok(AGENT_DOCK_HTML.includes(`data-name="${n}"`), 'item ' + n);
assert.ok(!/<svg[^>]*>\s*(Claude|Cursor)/.test(AGENT_DOCK_HTML), 'labels are not left inside logo markup');

// accessibility: labelled list, keyboard-focusable items, toggle wired to the list
assert.ok(AGENT_DOCK_HTML.includes('aria-label="Agents that work with JOYTREE"'));
assert.strictEqual((AGENT_DOCK_HTML.match(/tabindex="0"/g) || []).length, 10);
assert.ok(AGENT_DOCK_HTML.includes('aria-expanded="false"') && AGENT_DOCK_HTML.includes('aria-controls="dkStack"'));

// motion safety
assert.ok(AGENT_DOCK_CSS.includes('prefers-reduced-motion'));
assert.ok(AGENT_DOCK_JS.includes('prefers-reduced-motion'));

// the dock is one DOM, so ids (svg gradients/masks) must not repeat on a page
for (const [name, html] of [['connect', renderConnectPage({ baseUrl: 'https://joytree.site', fields: '' })], ['site', renderConnectPage({ baseUrl: 'https://joytree.site', standalone: true })]]) {
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
  const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
  assert.deepStrictEqual(dupes, [], name + ': duplicate ids ' + dupes.join(','));
  assert.ok(html.includes('data-dock'), name + ': dock present');
  for (const m of html.matchAll(/<script>([\s\S]*?)<\/script>/g)) new Function(m[1]);
}
console.log('dock-check: OK');
