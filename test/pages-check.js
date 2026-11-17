// Connect page + privacy policy: docs-site look, JOYTREE spelled in capitals, form intact.
const assert = require('node:assert');
const { renderConnectPage } = require('../src/connect-page');
const { PRIVACY_POLICY_HTML } = require('../src/privacy-policy');

const connect = renderConnectPage({ baseUrl: 'https://joytree.site', fields: '<input type="hidden" name="state" value="x">' });
for (const [name, html] of [['connect', connect], ['privacy', PRIVACY_POLICY_HTML]]) {
  assert.ok(!/JoyTree/.test(html), name + ': writing must be JOYTREE, not JoyTree');
  assert.ok(html.includes('Source+Serif+4'), name + ': docs serif font');
  assert.ok(html.includes('id="themeToggle"') && !html.includes('jt-leaves-fall'), name + ': topbar toggle, no falling leaves');
  assert.ok(html.includes('JOYTREE<span class="brand-dot">mcp</span>'), name + ': brand');
}
assert.ok(connect.includes('<title>Connect JOYTREE</title>'));
assert.ok(connect.includes('action="/authorize/submit"') && connect.includes('name="api_key"') && connect.includes('name="state"'));
assert.ok(!connect.includes('__FIELDS__') && !connect.includes('__BASE__'));
for (const a of ['Claude', 'Cursor', 'ChatGPT', 'Lovable', 'Zed', 'Cline', 'Raycast', 'Windsurf', 'Gemini', 'Antigravity']) assert.ok(connect.includes(a), 'agent ' + a);
console.log('pages-check: OK');

// No green UI accents (leaves ambiance and the logo excluded).
for (const [name, html] of [['connect', connect], ['privacy', PRIVACY_POLICY_HTML]]) {
  const css = html.match(/<style>([\s\S]*?)<\/style>/)[1].replace(/\.jt-btn[^{]*\{[^}]*\}/g, '');
  assert.ok(!/#10b981|#059669|#047857|#34d399|#ecfdf5|var\(--brand(?!-dot|-name|-mark)/.test(css), name + ': no green accents');
}
console.log('pages-check (no green): OK');
