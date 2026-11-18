'use strict';
// Server-rendered OAuth "Connect JOYTREE" page, styled like the JOYTREE docs site.
const { renderShell } = require('./site-shell');
const { AGENT_DOCK_HTML, AGENT_DOCK_CSS, AGENT_DOCK_JS } = require('./agent-dock');
const { GUIDE_CSS, GUIDE_JS, GUIDE_BODY } = require('./guide-page');

const CONNECTOR_URL = 'https://mcp.joytree.site/mcp';

const ICON = {
  deploy: '<path d="M12 16V4M7 9l5-5 5 5M4 20h16"/>',
  blueprints: '<path d="M12 3 3 8l9 5 9-5-9-5Z"/><path d="m3 13 9 5 9-5"/>',
  observability: '<path d="M3 12h4l3-8 4 16 3-8h4"/>',
  firewall: '<path d="M12 22s8-4.5 8-11V5l-8-3-8 3v6c0 6.5 8 11 8 11Z"/>',
  databases: '<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6"/>',
  rollback: '<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/>',
};
const svg = (name) =>
  `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICON[name]}</svg>`;

const card = (icon, title, text, tool) =>
  `<div class="grid-card"><div class="gc-icon">${svg(icon)}</div><h3>${title}</h3><p>${text}</p><code>${tool}</code></div>`;

const LINK_ICON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7.1 0l3-3a5 5 0 0 0-7.1-7.1l-1.7 1.7"/><path d="M14 11a5 5 0 0 0-7.1 0l-3 3a5 5 0 0 0 7.1 7.1l1.7-1.7"/></svg>';

// Sign-in card. During an OAuth hand-off (/authorize) it holds the API-key form;
// on the plain site (/) there is no OAuth request to finish, so it shows the
// connector address to paste into Claude instead.
const CARD_OAUTH = `
  <h2 class="cc-title">Connect JOYTREE to Claude</h2>
  <p>Paste your JOYTREE API key to finish connecting. Find it at
    <a href="__BASE__/dashboard/account" target="_blank" rel="noopener">joytree.site/dashboard/account</a>,
    or run <code>joytree apikey show</code>. New to connectors? <a href="#guide">Follow the setup guide below</a>.</p>
  <form method="POST" action="/authorize/submit">
    __FIELDS__
    <input type="password" name="api_key" placeholder="jtk_..." required pattern="jtk_.+" autocomplete="off" aria-label="JOYTREE API key">
    <button type="submit" class="jt-btn block">${LINK_ICON}Connect</button>
    <p class="hint">Your key is verified once, then swapped for an opaque token. Your agent never sees it again.</p>
  </form>`;

const CARD_SITE = `
  <h2 class="cc-title">Add JOYTREE to Claude</h2>
  <p>Add this address as a custom connector on Claude&rsquo;s Plugins page, then sign in with your JOYTREE API key when asked. It takes about two minutes.</p>
  <div class="field"><code>${CONNECTOR_URL}</code><button type="button" data-copy="${CONNECTOR_URL}">Copy</button></div>
  <a class="jt-btn block" href="https://claude.ai/plugins" target="_blank" rel="noopener">${LINK_ICON}Open Claude Plugins</a>
  <p class="hint">Not sure where to click? <a href="#guide">Follow the setup guide below</a>.</p>`;

const buildMain = (standalone) => `
<section class="split">
  <div class="split-copy">
    <p class="eyebrow">Model Context Protocol</p>
    <h1>Ship from your chat.</h1>
    <p class="lede">Connect JOYTREE to your AI agent and deploy, roll back, monitor and secure your projects in plain language. No dashboards to hop between.</p>
    <div class="hero-dock"><p class="hd-label">Works with</p>${AGENT_DOCK_HTML}</div>
    <div class="hero-actions">
      <a class="jt-btn" href="#connect">${LINK_ICON}${standalone ? 'Add to Claude' : 'Connect'}</a>
      <a class="jt-btn ghost" href="#guide">Setup guide</a>
      <a class="jt-btn ghost" href="https://docs.joytree.site" target="_blank" rel="noopener">Read the docs</a>
    </div>
  </div>
  <div class="connect-card" id="connect">${standalone ? CARD_SITE : CARD_OAUTH}</div>
</section>

<div class="stats">
  <div class="stat"><b>48</b><span>tools</span></div>
  <div class="stat"><b>OAuth 2.1</b><span>standard sign-in</span></div>
  <div class="stat"><b>1 key</b><span>scoped to you</span></div>
</div>

<h2>What your agent can do</h2>
<div class="grid-cards">
  ${card('deploy', 'Deploy', 'Ship from a GitHub repo or a zip, with Dockerfile builds, workers and monorepos.', 'joytree_deploy_from_github')}
  ${card('blueprints', 'Blueprints', 'Preview and launch a whole multi-service stack from one file.', 'joytree_blueprint_deploy')}
  ${card('observability', 'Observability', 'Traffic, latency, errors, CPU and memory, plus alert rules.', 'joytree_observability_summary')}
  ${card('firewall', 'Firewall', 'Custom rules, IP lists, bot and DDoS protection, Attack Mode (Pro and above).', 'joytree_firewall_attack_mode')}
  ${card('databases', 'Databases', 'Create, inspect and manage databases, and migrate data between them.', 'joytree_create_database')}
  ${card('rollback', 'Rollback and CDN', 'Revert a bad release and purge the cache in one sentence.', 'joytree_rollback_deployment')}
</div>

<div class="guide" id="guide">
  <div class="g-hero">
    <p class="eyebrow">Setup guide</p>
    <h2 class="g-title">Connect JOYTREE to Claude in <em>two minutes.</em></h2>
    <p class="lede">A step-by-step walkthrough using the real screens: add the connector, sign in once, then decide exactly what Claude may do on its own and what it must ask you about first.</p>
    <div class="g-meta">
      <div><b>~2 min</b><span>to connect</span></div>
      <div><b>5 steps</b><span>start to finish</span></div>
      <div><b>0 installs</b><span>runs in the cloud</span></div>
    </div>
  </div>
${GUIDE_BODY}
</div>
`;

const PAGE_CSS = `
/* ---- Connect page: full-width layout -------------------------------- */
.page.wide.full{padding:36px 24px 64px;overflow-x:clip}
@media(max-width:860px){.page.wide.full{padding:22px 20px 48px}}
@media(max-width:480px){.page.wide.full{padding:18px 16px 44px}}
.split{position:relative;isolation:isolate;display:grid;grid-template-columns:minmax(0,1.2fr) minmax(0,1fr);gap:56px;align-items:center;padding:36px 0 52px;border-bottom:1px solid var(--border-soft)}
.split h1{font-size:clamp(42px,5.6vw,88px);line-height:1.03;letter-spacing:-.03em;margin:0 0 18px}
.split .lede{font-size:clamp(17px,1.5vw,22px);max-width:56ch}
.split .hero-actions{margin-top:28px}
.split .jt-btn{height:40px;padding:0 22px;font-size:15px}
.connect-card{padding:26px;border-radius:12px;box-shadow:0 1px 0 rgba(31,35,40,.04),0 24px 48px -24px rgba(31,35,40,.28)}
html[data-theme="dark"] .connect-card{box-shadow:0 24px 48px -24px rgba(0,0,0,.75)}
.page.full .cc-title{margin:0 0 10px;padding:0;border:0;font-size:26px}
.connect-card p{color:var(--text-dim)}
.connect-card input[type=password]{height:46px;font-size:16px}
.connect-card .jt-btn.block{height:44px}
.page.full .grid-cards{grid-template-columns:1fr;gap:1px}
@media(min-width:620px){.page.full .grid-cards{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media(min-width:980px){.page.full .grid-cards{grid-template-columns:repeat(3,minmax(0,1fr))}}
.page.full .grid-card{padding:22px 20px;transition:background .2s ease}
.page.full .grid-card:hover{background:var(--bg-sunken)}
.page.full .stat{padding:20px 26px}
.page.full .stat b{font-size:30px}
@media(max-width:480px){.page.full .stat{padding:12px}.page.full .stat b{font-size:17px}}
.page.full .steps{display:grid;grid-template-columns:repeat(3,minmax(0,1fr))}
.page.full .step{border-top:0;padding:22px 24px;flex-direction:column;gap:8px}
.page.full .step+.step{border-left:1px solid var(--border-soft)}
.page.full .step .n{font-size:14px}
.page.full .step h3{font-size:18px}
@media(max-width:860px){.page.full .steps{grid-template-columns:1fr}.page.full .step{flex-direction:row;gap:14px;padding:14px 16px}.page.full .step+.step{border-left:0;border-top:1px solid var(--border-soft)}}
.page.full h2{margin-top:56px}
/* entrance */
@keyframes cp-up{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
.split-copy>*{animation:cp-up .6s cubic-bezier(.2,.8,.2,1) backwards}
.split-copy>:nth-child(2){animation-delay:.06s}.split-copy>:nth-child(3){animation-delay:.12s}.split-copy>:nth-child(4){animation-delay:.18s}
.connect-card{animation:cp-up .7s cubic-bezier(.2,.8,.2,1) .15s backwards}
@media(max-width:980px){.split{grid-template-columns:1fr;gap:32px;padding:20px 0 40px}}
@media(min-width:1500px){.connect-card{padding:32px}.cc-title{font-size:30px}}
@media(prefers-reduced-motion:reduce){.split-copy>*,.connect-card{animation:none}.page.full .grid-card{transition:none}}

/* ---- Hero dock: the "Works with" animation now lives in the hero ----- */
.hero-dock{position:relative;isolation:isolate;margin:28px 0 0}
.hd-label{margin:0 0 10px;font-size:14px;font-weight:600;color:var(--text-dim)}
.hero-dock .dock{--s:52px;--ov:-17px}
.hero-dock .dk-pill{padding:10px 18px 10px 24px;background:color-mix(in srgb,var(--bg-raised) 78%,transparent);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);box-shadow:0 18px 36px -22px rgba(9,105,218,.55)}
.hero-dock .dk-av svg{width:30px;height:30px}
.hero-dock .dk-av img{height:30px}
.hero-dock .dk-cap{font-size:15px;margin-top:12px}
.hero-dock .dock.open .dk-av{--s:32px}
.hero-dock .dock.open .dk-av svg{width:20px;height:20px}
.hero-dock .dock.open .dk-av img{height:20px}
.split-copy,.connect-card{min-width:0}
.hero-dock .dk-row{justify-content:flex-start;gap:14px}
.hero-dock .dock.open .dk-row{justify-content:stretch}
@media(max-width:480px){.hero-dock .dock{--s:35px;--ov:-12px}.hero-dock .dk-av svg{width:21px;height:21px}.hero-dock .dk-av img{height:21px}.hero-dock .dk-pill{padding:6px 10px 6px 14px}.hero-dock .dk-row{gap:8px}}
.split-copy>:nth-child(5){animation-delay:.24s}
/* connector address in the sign-in card (plain site) */
.connect-card .field{display:flex;align-items:stretch;border:1px solid var(--border);border-radius:var(--radius-sm);background:var(--bg-sunken);margin:16px 0}
.connect-card .field code{flex:1;min-width:0;background:none;font-size:14px;padding:11px 14px;overflow-x:auto;white-space:nowrap}
.connect-card .field button{border:0;border-left:1px solid var(--border);background:var(--bg-raised);color:var(--text);font:600 13px/1 var(--font-body);padding:0 16px;cursor:pointer}
.connect-card .field button:hover{background:var(--bg-hover)}
.connect-card .field button.done{background:#059669;color:#fff}
.connect-card a.jt-btn.block{display:flex;align-items:center;justify-content:center;gap:8px;height:44px}
/* guide section sits under the capabilities, centred, with its own sticky contents */
.page.full .guide{margin-top:72px;padding-top:8px;border-top:1px solid var(--border-soft)}
.page.full .guide .g-hero{padding:44px 0 8px;max-width:1060px;margin:0 auto}
.page.full .guide .g-title{margin:0 0 12px;padding:0;border:0;font-size:clamp(30px,4.2vw,52px);line-height:1.08;letter-spacing:-.02em}
.page.full .guide .g-title em{font-style:italic;font-weight:500;color:var(--text-dim)}
.page.full .guide .g-layout{max-width:1060px;margin:0 auto}
`;

function renderConnectPage({ baseUrl, fields = '', standalone = false }) {
  const html = renderShell({
    title: standalone ? 'JOYTREE for Claude and AI agents - connect and setup guide' : 'Connect JOYTREE',
    description: 'Deploy, monitor and protect your JOYTREE projects from your AI agent. Connect once, with a step-by-step setup guide.',
    main: buildMain(standalone),
    baseUrl,
    wide: 'full',
    extraCss: AGENT_DOCK_CSS + PAGE_CSS + GUIDE_CSS,
    extraScript: AGENT_DOCK_JS + '\n' + GUIDE_JS,
  });
  return html.split('__BASE__').join(baseUrl).split('__FIELDS__').join(fields);
}

module.exports = { renderConnectPage };
