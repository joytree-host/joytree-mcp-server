// Combined page (/ + the guide section): renders in the shared shell, keeps all 8 screenshots, copy fields and pin legends aligned.
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { renderConnectPage } = require('../src/connect-page');

const html = renderConnectPage({ baseUrl: 'https://joytree.site', standalone: true });
assert.ok(!/JoyTree/.test(html), 'writing must be JOYTREE, not JoyTree');
assert.ok(html.includes('id="themeToggle"') && html.includes('JOYTREE<span class="brand-dot">mcp</span>'), 'shared topbar + brand');
assert.ok(html.includes('id="guide"') && html.includes('href="#guide"'), 'guide section + hero link to it');
assert.ok(html.indexOf('data-dock') < html.indexOf('id="guide"'), 'dock sits above the guide');
assert.ok(html.indexOf('class="hero-dock"') < html.indexOf('class="hero-actions"'), 'dock is in the hero, above the buttons');
assert.ok(!html.includes('<h2>Works with</h2>'), 'no second Works-with block further down');
assert.ok(!html.includes('href="/guide"'), 'no link to a separate guide page');
assert.ok((html.match(/<main\b/g) || []).length === 1, 'exactly one <main>');
assert.ok(!html.includes('<!--AGENT_DOCK'), 'no unreplaced placeholders');

// 8 screenshots, each present on disk, each with pins matching its legend
const imgs = [...html.matchAll(/src="\/guide\/assets\/([^"]+)"/g)].map((m) => m[1]);
assert.strictEqual(imgs.length, 8, 'eight screenshots');
for (const f of imgs) assert.ok(fs.existsSync(path.join(__dirname, '../src/assets/guide', f)), 'asset exists: ' + f);
// each screenshot: one numbered step line + one travelling cursor, no pins or numbered legends
const figs = html.split('<figure>').slice(1).map((f) => f.split('</figure>')[0]);
assert.strictEqual(figs.length, 8);
figs.forEach((f, i) => {
  assert.ok(f.includes(`<p class="gstep"><b>${i + 1}</b>`), `step ${i + 1} caption`);
  assert.strictEqual((f.match(/class="curx /g) || []).length, 1, `step ${i + 1}: one cursor`);
  assert.ok(!f.includes('class="pin"') && !f.includes('class="legend"'), `step ${i + 1}: no pins/legend`);
});
assert.ok(!/STEP 0\d/.test(html), 'only the click steps are numbered');
for (const id of ['short', 'before', 's1', 's2', 's3', 's4', 's5', 'try', 'help', 'security']) {
  assert.ok(html.includes(`id="${id}"`), 'section ' + id);
  assert.ok(html.includes(`href="#${id}"`), 'toc link ' + id);
}
assert.ok(html.includes('data-copy="https://mcp.joytree.site/mcp"'), 'copy-to-clipboard URL');
assert.ok(html.includes('prefers-reduced-motion'), 'reduced-motion handled');
assert.ok(html.includes('href="/privacy"'));

// Inline script parses
for (const m of html.matchAll(/<script>([\s\S]*?)<\/script>/g)) new Function(m[1]);
console.log('guide-check: OK');
