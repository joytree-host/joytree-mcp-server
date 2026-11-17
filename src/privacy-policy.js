'use strict';

const { renderShell } = require('./site-shell');

const LAST_UPDATED = 'July 2026';

const BODY = `<div class="doc">
  <section class="hero"><p class="eyebrow">Legal</p><h1>Privacy Policy</h1><p class="lede">JOYTREE MCP Server. Last updated: ${LAST_UPDATED}</p></section>

  <p>This policy covers the JOYTREE MCP server (<code>mcp.joytree.site</code>), which lets Claude and other
  MCP-compatible clients deploy and manage resources on <a href="https://joytree.site">JOYTREE</a> on your
  behalf. It does not cover joytree.site itself, which has its own privacy policy.</p>

  <h2>What data this server sees</h2>
  <p>To do anything on your behalf, this server needs to authenticate as you. Depending on how you connect:</p>
  <ul>
    <li><strong>Direct API key</strong> — your JOYTREE API key (<code>jtk_...</code>), sent as a bearer token with each request.</li>
    <li><strong>OAuth (the normal path when connecting through Claude)</strong> — you paste your JOYTREE API key once,
    into a form hosted on this same server, so it can be verified against the real JOYTREE API. From then on,
    Claude only ever holds an opaque OAuth access token that this server maps back to your key — Claude never
    sees your raw API key at any point after the initial connection.</li>
  </ul>
  <p>Beyond that, this server only ever handles whatever a specific tool call requires — project names,
  deployment logs, environment variable keys, database connection info, GitHub repository names, generated
  API details. All of this is <strong>your own JOYTREE data</strong>, fetched directly from JOYTREE's API using
  your own credentials. This server does not independently collect, scrape, or generate any data of its own.</p>

  <h2>How your data is used and stored</h2>
  <ul>
    <li>Your API key (or the OAuth token that maps to it) is used solely to authenticate the specific request
    you're making, at the moment you make it.</li>
    <li>OAuth access and refresh tokens are stored <strong>in server memory only</strong> — not in a database,
    not on disk. Restarting the server clears all of it.</li>
    <li>Tool call arguments and results are not logged or retained beyond what's needed to process that single
    request. Server logs may record that a request happened (timestamp, which tool, success/failure) for
    operational debugging, but not the content of your JOYTREE data.</li>
    <li>Standard web server access logs (IP address, timestamp, endpoint) are kept for a limited time for
    security and debugging purposes, same as any web server.</li>
  </ul>

  <h2>Third-party sharing</h2>
  <p>Never. Every request this server makes goes directly to JOYTREE's own API
  (<code>joytree.site</code>) using your own credentials. Nothing is sent to any other third party, and
  nothing is sold, shared, or used for advertising.</p>

  <h2>Data retention</h2>
  <ul>
    <li>OAuth access tokens: valid for 30 days, or until you revoke access.</li>
    <li>Refresh tokens: valid until revoked.</li>
    <li>All of the above is held in memory only — a server restart (which does happen from time to time as
    this service is updated) clears every session, and you'll simply reconnect.</li>
    <li>You can revoke access at any time by disconnecting the connector in Claude's settings, or by
    generating a new API key on JOYTREE (which invalidates the old one everywhere it was in use).</li>
  </ul>

  <h2>Your rights</h2>
  <p>Since this server holds no persistent database of your data, there's nothing to request deletion of
  beyond disconnecting the connector (which is instant) or rotating your JOYTREE API key (which immediately
  invalidates any in-memory tokens derived from it).</p>

  <h2>Changes to this policy</h2>
  <p>If this policy changes in a way that affects what data is collected or how it's used, the "Last updated"
  date above will change accordingly.</p>

  <h2>Contact</h2>
  <div class="contact">
    <p style="margin:0">Questions about this policy or how this server handles your data:<br>
    <strong><a href="mailto:privacy@joytree.site">privacy@joytree.site</a></strong></p>
  </div>
</div>`;

const PRIVACY_POLICY_HTML = renderShell({
  title: 'Privacy Policy — JOYTREE MCP Server',
  description: 'How the JOYTREE MCP server handles your data.',
  main: BODY,
});

module.exports = { PRIVACY_POLICY_HTML };
