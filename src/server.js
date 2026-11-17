'use strict';

const express = require('express');
const { execSync } = require('child_process');
const { McpServer } = require('@modelcontextprotocol/sdk/server/mcp.js');
const { StreamableHTTPServerTransport } = require('@modelcontextprotocol/sdk/server/streamableHttp.js');
const { mcpAuthRouter } = require('@modelcontextprotocol/sdk/server/auth/router.js');
const { JoyTreeClient } = require('./joytree-client');
const { PRIVACY_POLICY_HTML } = require('./privacy-policy');
const { registerJoyTreeTools } = require('./tools');
const { JoyTreeOAuthProvider } = require('./oauth-provider');

const PORT = process.env.PORT || 8787;
const PUBLIC_URL = process.env.MCP_PUBLIC_URL || `http://localhost:${PORT}`;

// [FIX] /health used to only report { ok: true } -- enough to confirm the
// process is up, but useless for the question that actually matters after
// a manual deploy: "is this the build I just pushed, or a stale one from
// before?" Since deploys here are triggered manually rather than on every
// push, that question previously had no answer short of guessing. Now it
// reports the package version and (best-effort) git commit the running
// process was actually started from, so a single request answers it.
const PACKAGE_VERSION = require('../package.json').version;
const STARTED_AT = new Date().toISOString();
let GIT_COMMIT = 'unknown';
try {
  GIT_COMMIT = execSync('git rev-parse HEAD', { cwd: __dirname + '/..' }).toString().trim();
} catch (_) {
  // No .git directory in this deploy (e.g. a zip/tarball deploy rather than
  // a git clone) -- fall back to whatever the deploy pipeline set explicitly.
  GIT_COMMIT = process.env.GIT_COMMIT || process.env.SOURCE_COMMIT || 'unknown';
}

const oauthProvider = new JoyTreeOAuthProvider();

/**
 * Resolve which JoyTree API key a request is authenticated as, supporting
 * two paths at once:
 *  - An OAuth access token issued by our own /authorize + /token flow
 *    (what Claude's "Add custom connector" UI actually uses)
 *  - A raw jtk_ API key sent directly as a bearer token (for anyone
 *    scripting against this server directly without going through OAuth
 *    at all -- curl, a different MCP client, etc.)
 */
async function resolveApiKey(req) {
  const auth = String(req.headers['authorization'] || '');
  if (!auth.startsWith('Bearer ')) {
    console.error('[joytree-mcp] /mcp request with no/invalid Authorization header:', auth ? '(present but not Bearer)' : '(missing entirely)');
    return null;
  }
  const token = auth.slice(7).trim();

  if (token.startsWith('jtk_')) return token; // direct key, skip OAuth entirely

  try {
    const info = await oauthProvider.verifyAccessToken(token);
    return info.extra.apiKey;
  } catch (err) {
    console.error('[joytree-mcp] OAuth token verification failed:', err.message, '-- token prefix:', token.slice(0, 8) + '...');
    return null;
  }
}

function buildServer(apiKey) {
  const server = new McpServer(
    { name: 'joytree', version: '1.0.0' },
    { capabilities: { tools: {} } }
  );

  registerJoyTreeTools(server, () => new JoyTreeClient(apiKey));
  return server;
}

const app = express();

// This runs behind exactly one reverse proxy (Cloudflare Tunnel), which
// sets X-Forwarded-For. Without telling Express that, express-rate-limit
// (used internally by the SDK's OAuth router) throws a ValidationError on
// every OAuth-related request rather than silently trusting a header it
// has no reason to trust -- correct default behavior on their part, but
// it needs this one line to know the proxy in front of it is legitimate.
app.set('trust proxy', 1);

// The /authorize page (rendered by oauthProvider.authorize) posts here
// with the pasted API key. Mounted BEFORE mcpAuthRouter below -- the SDK's
// router reads the request stream for its own POST endpoints, and once a
// request body stream has been consumed it can't be read again, so this
// has to get first access to its own path.
app.post('/authorize/submit', express.urlencoded({ extended: true }), (req, res) => {
  oauthProvider.handleAuthorizeSubmit(req, res);
});

// OAuth endpoints (/.well-known/oauth-authorization-server, /authorize,
// /token, /register, /revoke) -- everything needed for Claude's connector
// UI to discover and complete the OAuth flow automatically.
app.use(mcpAuthRouter({
  provider: oauthProvider,
  issuerUrl: new URL(PUBLIC_URL),
  resourceName: 'JOYTREE',
  scopesSupported: ['joytree'],
}));

app.use(express.json({ limit: '2mb' }));

app.get('/health', (_req, res) => res.status(200).json({
  ok: true,
  version: PACKAGE_VERSION,
  commit: GIT_COMMIT,
  startedAt: STARTED_AT,
  uptimeSeconds: Math.round(process.uptime()),
}));

app.get('/privacy', (_req, res) => {
  res.status(200).set('Content-Type', 'text/html').send(PRIVACY_POLICY_HTML);
});

// Stateless MCP endpoint: every request gets its own McpServer + transport,
// scoped to whichever key that request resolved to. Nothing about one
// caller's session is ever visible to another.
app.post('/mcp', async (req, res) => {
  const apiKey = await resolveApiKey(req);
  if (!apiKey) {
    res.status(401).json({
      jsonrpc: '2.0',
      error: { code: -32001, message: 'Missing or invalid credentials. Connect via OAuth, or send Authorization: Bearer jtk_... directly.' },
      id: null,
    });
    return;
  }

  try {
    const server = buildServer(apiKey);
    const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });
    res.on('close', () => { transport.close(); server.close(); });
    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);
  } catch (err) {
    console.error('[joytree-mcp] request failed:', err);
    if (!res.headersSent) {
      res.status(500).json({
        jsonrpc: '2.0',
        error: { code: -32603, message: 'Internal server error' },
        id: null,
      });
    }
  }
});

app.get('/mcp', (_req, res) => res.status(405).json({ error: 'Method not allowed in stateless mode' }));
app.delete('/mcp', (_req, res) => res.status(405).json({ error: 'Method not allowed in stateless mode' }));

app.listen(PORT, () => {
  console.log(`[joytree-mcp] listening on :${PORT} (public URL: ${PUBLIC_URL})`);
});
