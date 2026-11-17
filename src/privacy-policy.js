'use strict';

const LAST_UPDATED = 'July 2026';

const PRIVACY_POLICY_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Privacy Policy — JoyTree MCP Server</title>
<style>
  :root{color-scheme:light dark;--bg:#ffffff;--sub:#f6f8fa;--bd:#d0d7de;--bdm:#d8dee4;--fg:#1f2328;--mu:#59636e;--link:#066648;--em:#10b981}
  @media (prefers-color-scheme:dark){:root{--bg:#0d1117;--sub:#151b23;--bd:#3d444d;--bdm:#30363d;--fg:#e6edf3;--mu:#9198a1;--link:#34d399}}
  body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','Noto Sans',Helvetica,Arial,sans-serif;background:var(--bg);color:var(--fg);
       max-width:720px;margin:0 auto;padding:48px 24px 96px;line-height:1.65;}
  h1{font-size:1.7rem;font-weight:600;letter-spacing:-.015em;margin-bottom:4px;}
  .updated{color:var(--mu);font-size:.85rem;margin-bottom:32px;padding-bottom:16px;border-bottom:1px solid var(--bd);}
  h2{font-size:1.15rem;font-weight:600;color:var(--fg);margin-top:36px;margin-bottom:10px;padding-bottom:6px;border-bottom:1px solid var(--bdm);}
  p,li{color:var(--fg);font-size:.96rem;}
  ul{padding-left:20px;}
  a{color:var(--link);text-decoration:none;} a:hover{text-decoration:underline;}
  code{background:var(--sub);border:1px solid var(--bdm);padding:1px 6px;border-radius:6px;font-size:.86em;}
  .contact{background:var(--sub);border:1px solid var(--bd);border-radius:6px;padding:18px 20px;margin-top:8px;}
</style>
</head>
<body>
  <h1>Privacy Policy — JoyTree MCP Server</h1>
  <div class="updated">Last updated: ${LAST_UPDATED}</div>

  <p>This policy covers the JoyTree MCP server (<code>mcp.joytree.site</code>), which lets Claude and other
  MCP-compatible clients deploy and manage resources on <a href="https://joytree.site">JoyTree</a> on your
  behalf. It does not cover joytree.site itself, which has its own privacy policy.</p>

  <h2>What data this server sees</h2>
  <p>To do anything on your behalf, this server needs to authenticate as you. Depending on how you connect:</p>
  <ul>
    <li><strong>Direct API key</strong> — your JoyTree API key (<code>jtk_...</code>), sent as a bearer token with each request.</li>
    <li><strong>OAuth (the normal path when connecting through Claude)</strong> — you paste your JoyTree API key once,
    into a form hosted on this same server, so it can be verified against the real JoyTree API. From then on,
    Claude only ever holds an opaque OAuth access token that this server maps back to your key — Claude never
    sees your raw API key at any point after the initial connection.</li>
  </ul>
  <p>Beyond that, this server only ever handles whatever a specific tool call requires — project names,
  deployment logs, environment variable keys, database connection info, GitHub repository names, generated
  API details. All of this is <strong>your own JoyTree data</strong>, fetched directly from JoyTree's API using
  your own credentials. This server does not independently collect, scrape, or generate any data of its own.</p>

  <h2>How your data is used and stored</h2>
  <ul>
    <li>Your API key (or the OAuth token that maps to it) is used solely to authenticate the specific request
    you're making, at the moment you make it.</li>
    <li>OAuth access and refresh tokens are stored <strong>in server memory only</strong> — not in a database,
    not on disk. Restarting the server clears all of it.</li>
    <li>Tool call arguments and results are not logged or retained beyond what's needed to process that single
    request. Server logs may record that a request happened (timestamp, which tool, success/failure) for
    operational debugging, but not the content of your JoyTree data.</li>
    <li>Standard web server access logs (IP address, timestamp, endpoint) are kept for a limited time for
    security and debugging purposes, same as any web server.</li>
  </ul>

  <h2>Third-party sharing</h2>
  <p>Never. Every request this server makes goes directly to JoyTree's own API
  (<code>joytree.site</code>) using your own credentials. Nothing is sent to any other third party, and
  nothing is sold, shared, or used for advertising.</p>

  <h2>Data retention</h2>
  <ul>
    <li>OAuth access tokens: valid for 30 days, or until you revoke access.</li>
    <li>Refresh tokens: valid until revoked.</li>
    <li>All of the above is held in memory only — a server restart (which does happen from time to time as
    this service is updated) clears every session, and you'll simply reconnect.</li>
    <li>You can revoke access at any time by disconnecting the connector in Claude's settings, or by
    generating a new API key on JoyTree (which invalidates the old one everywhere it was in use).</li>
  </ul>

  <h2>Your rights</h2>
  <p>Since this server holds no persistent database of your data, there's nothing to request deletion of
  beyond disconnecting the connector (which is instant) or rotating your JoyTree API key (which immediately
  invalidates any in-memory tokens derived from it).</p>

  <h2>Changes to this policy</h2>
  <p>If this policy changes in a way that affects what data is collected or how it's used, the "Last updated"
  date above will change accordingly.</p>

  <h2>Contact</h2>
  <div class="contact">
    <p style="margin:0">Questions about this policy or how this server handles your data:<br>
    <strong><a href="mailto:privacy@joytree.site">privacy@joytree.site</a></strong></p>
  </div>
</body>
</html>`;

module.exports = { PRIVACY_POLICY_HTML };
