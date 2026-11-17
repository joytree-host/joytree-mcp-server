'use strict';
// Server-rendered OAuth "Connect JOYTREE" page, styled like the JOYTREE docs site.
const { renderShell } = require('./site-shell');
const { AGENTS_HTML } = require('./assets/agents');

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

const MAIN = `
<section class="hero">
  <p class="eyebrow">Model Context Protocol</p>
  <h1>Ship from your chat.</h1>
  <p class="lede">Connect JOYTREE to your AI agent and deploy, roll back, monitor and secure your projects in plain language. No dashboards to hop between.</p>
  <div class="hero-actions">
    <a class="jt-btn" href="#connect"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7.1 0l3-3a5 5 0 0 0-7.1-7.1l-1.7 1.7"/><path d="M14 11a5 5 0 0 0-7.1 0l-3 3a5 5 0 0 0 7.1 7.1l1.7-1.7"/></svg>Connect</a>
    <a class="jt-btn ghost" href="https://docs.joytree.site" target="_blank" rel="noopener">Read the docs</a>
  </div>
</section>

<h2>Works with</h2>
<div class="agents">${AGENTS_HTML}</div>

<div class="grid-cards three" style="margin-top:16px">
  <div class="grid-card stat"><b>48</b><span>tools</span></div>
  <div class="grid-card stat"><b>OAuth 2.1</b><span>standard sign-in</span></div>
  <div class="grid-card stat"><b>1 key</b><span>scoped to you</span></div>
</div>

<h2 id="connect">Connect JOYTREE to Claude</h2>
<div class="connect-card">
  <p>Paste your JOYTREE API key to finish connecting. Find it at
    <a href="__BASE__/dashboard/account" target="_blank" rel="noopener">joytree.site/dashboard/account</a>,
    or run <code>joytree apikey show</code>.</p>
  <form method="POST" action="/authorize/submit">
    __FIELDS__
    <input type="password" name="api_key" placeholder="jtk_..." required pattern="jtk_.+" autocomplete="off" aria-label="JOYTREE API key">
    <button type="submit" class="jt-btn block"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7.1 0l3-3a5 5 0 0 0-7.1-7.1l-1.7 1.7"/><path d="M14 11a5 5 0 0 0-7.1 0l-3 3a5 5 0 0 0 7.1 7.1l1.7-1.7"/></svg>Connect</button>
    <p class="hint">Your key is verified once, then swapped for an opaque token. Your agent never sees it again.</p>
  </form>
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

<h2>How it works</h2>
<div class="steps">
  <div class="step"><span class="n">01</span><div><h3>Paste your key</h3><p>One time, right here.</p></div></div>
  <div class="step"><span class="n">02</span><div><h3>Ask in plain language</h3><p>"Deploy my repo and show me the logs."</p></div></div>
  <div class="step"><span class="n">03</span><div><h3>JOYTREE does the work</h3><p>Every call runs with your own permissions, nothing shared.</p></div></div>
</div>
`;

function renderConnectPage({ baseUrl, fields }) {
  const html = renderShell({
    title: 'Connect JOYTREE',
    description: 'Deploy, monitor and protect your JOYTREE projects from your AI agent.',
    main: MAIN,
    baseUrl,
  });
  return html.split('__BASE__').join(baseUrl).split('__FIELDS__').join(fields);
}

module.exports = { renderConnectPage };
