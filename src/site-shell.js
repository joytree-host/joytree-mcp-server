'use strict';
// Shared page shell for the Connect page and the Privacy Policy. Mirrors the
// JOYTREE docs site (docs.joytree.site): GitHub (Primer) palette, Source Serif
// headings, sunken topbar with a theme toggle, bordered 6px cards, emerald
// accent, Light is the default, dark is selectable.
const { LOGO_DATA_URI } = require('./assets/logo');

const CSS = `
:root{
  --font-body:-apple-system,BlinkMacSystemFont,"Segoe UI","Noto Sans",Helvetica,Arial,sans-serif;
  --font-display:"Source Serif 4","Iowan Old Style","Palatino Linotype",Georgia,"Noto Serif",serif;
  --font-mono:ui-monospace,SFMono-Regular,"SF Mono",Menlo,Consolas,"Liberation Mono",monospace;
  --bg:#ffffff;--bg-raised:#ffffff;--bg-sunken:#f6f8fa;--bg-inset:#eaeef2;
  --bg-hover:rgba(208,215,222,.32);
  --border:#d0d7de;--border-soft:#d8dee4;--border-hi:#afb8c1;
  --text:#1f2328;--text-dim:#59636e;--text-faint:#6e7781;
  --link:#0969da;--focus:#0969da;
  --code-inline:rgba(129,139,152,.16);
  --radius-sm:6px;--topbar-h:56px;--tile:#1f2328;
  color-scheme:light;
}
html[data-theme="dark"]{
  --bg:#0d1117;--bg-raised:#0d1117;--bg-sunken:#151b23;--bg-inset:#262c36;
  --bg-hover:rgba(177,186,196,.12);
  --border:#3d444d;--border-soft:#30363d;--border-hi:#656c76;
  --text:#f0f6fc;--text-dim:#9198a1;--text-faint:#848d97;
  --link:#4493f8;--focus:#4493f8;
  --code-inline:rgba(101,108,118,.2);--tile:#f0f6fc;
  color-scheme:dark;
}
*{box-sizing:border-box}
html{scroll-behavior:smooth}
body{margin:0;background:var(--bg);color:var(--text);font-family:var(--font-body);font-size:16px;line-height:1.5;-webkit-font-smoothing:auto}
a{color:inherit;text-decoration:none}
button,input{font-family:inherit}
::selection{background:var(--bg-inset);color:var(--text)}
:focus-visible{outline:2px solid var(--focus);outline-offset:2px}
svg[hidden]{display:none}

/* Topbar */
.topbar{position:sticky;top:0;z-index:40;height:var(--topbar-h);background:var(--bg-sunken);border-bottom:1px solid var(--border)}
.topbar-inner{height:100%;max-width:1600px;margin:0 auto;padding:0 12px;display:flex;align-items:center;gap:8px}
@media(min-width:900px){.topbar-inner{padding:0 24px;gap:12px}}
.brand{display:flex;align-items:center;gap:8px;flex-shrink:0}
.brand-mark img{width:24px;height:24px;border-radius:50%;display:block;object-fit:cover}
.brand-name{font-weight:600;font-size:16px;color:var(--text)}
.brand-dot{color:var(--text-dim);font-weight:400}
.brand-dot::before{content:'/';color:var(--text-faint);margin:0 6px}
.topnav{display:flex;align-items:center;gap:2px;margin-left:auto}
.topnav-link{padding:5px 10px;border-radius:var(--radius-sm);color:var(--text);font-size:14px;font-weight:600}
.topnav-link:hover{background:var(--bg-hover)}
.icon-btn{display:inline-flex;align-items:center;justify-content:center;width:32px;height:32px;flex:0 0 32px;padding:0;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--bg-raised);color:var(--text);cursor:pointer;transition:background .12s,border-color .12s}
.icon-btn:hover{background:var(--bg-sunken);border-color:var(--border-hi)}
.icon-btn svg{width:16px;height:16px}
@media(max-width:480px){.topnav-link.opt{display:none}}

/* Page */
.page{max-width:880px;margin:0 auto;padding:28px 40px 56px}
@media(max-width:860px){.page{padding:22px 20px 48px}}
@media(max-width:480px){.page{padding:18px 16px 44px}}
.eyebrow{font-size:14px;font-weight:600;color:var(--text-dim);margin:0 0 10px}
.hero{padding-bottom:28px;border-bottom:1px solid var(--border-soft)}
h1{font-family:var(--font-display);color:var(--text);font-size:clamp(34px,5.4vw,48px);font-weight:600;line-height:1.08;letter-spacing:-.02em;margin:0 0 14px}
.lede{font-size:18px;color:var(--text-dim);margin:0;max-width:62ch}
@media(max-width:480px){.lede{font-size:16px}}
.hero-actions{display:flex;gap:10px;flex-wrap:wrap;margin-top:22px}
.jt-btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;height:34px;padding:0 18px;border:1.5px solid #047857;border-radius:10px;background:#059669;color:#fff;font:600 14px/1 var(--font-body);text-decoration:none;white-space:nowrap;cursor:pointer;box-shadow:0 1px 0 rgba(255,255,255,.25) inset,0 2px 0 #047857;transition:background-color .15s ease,box-shadow .15s ease,transform .15s ease;-webkit-tap-highlight-color:transparent}
.jt-btn svg{flex:none;width:17px;height:17px;fill:none;stroke:currentColor;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round}
.jt-btn:hover{background:#047857;border-color:#065f46;box-shadow:0 2px 0 #065f46;transform:translateY(-1px)}
.jt-btn:active{transform:translateY(1px);box-shadow:0 0 0 #047857}
.jt-btn.block{width:100%}
.jt-btn.ghost{background:var(--bg-raised);color:var(--text);border-color:var(--border-hi);box-shadow:0 2px 0 var(--border)}
.jt-btn.ghost:hover{background:var(--bg-hover);border-color:var(--border-hi);box-shadow:0 2px 0 var(--border-hi)}
@media(prefers-reduced-motion:reduce){.jt-btn{transition:none}}
h2{font-family:var(--font-display);font-size:24px;font-weight:600;line-height:1.25;margin:40px 0 16px;padding-bottom:8px;border-bottom:1px solid var(--border-soft);scroll-margin-top:calc(var(--topbar-h) + 16px)}
h3{margin:0 0 4px;font-size:16px;font-weight:600}
p{margin:0 0 12px}
a.md-link,.page p a{color:var(--link);font-weight:500}
a.md-link:hover,.page p a:hover{text-decoration:underline}
code{font-family:var(--font-mono);font-size:85%;background:var(--code-inline);padding:.2em .4em;border-radius:6px}

/* Works with */
.agents{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:10px;margin:0}
.agent{display:flex;align-items:center;gap:10px;font-weight:500;font-size:14px;padding:8px 10px;background:var(--bg-raised);border:1px solid var(--border);border-radius:var(--radius-sm)}
.agent svg{width:24px;height:24px;display:block;flex:none}
.agent img{display:block;height:22px;width:auto;border-radius:4px}
.agent .tile{width:24px;height:24px;background:#fff;border-radius:4px;display:flex;align-items:center;justify-content:center;flex:none}
.agent .tile svg{width:18px;height:18px}
.agent.inv svg{background:var(--tile);border-radius:6px;padding:3px}
.agent.inv svg path{fill:var(--bg)}

/* Cards */
.grid-cards{display:grid;grid-template-columns:1fr;gap:16px;margin:0}
@media(min-width:700px){.grid-cards{grid-template-columns:repeat(2,minmax(0,1fr))}.grid-cards.three{grid-template-columns:repeat(3,minmax(0,1fr))}}
.grid-cards.three{grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}
.grid-card{border:1px solid var(--border);border-radius:var(--radius-sm);padding:16px;background:var(--bg-raised);display:block}
.grid-card .gc-icon{color:var(--text-dim);margin-bottom:12px;display:flex}
.grid-card p{margin:0 0 10px;font-size:14px;color:var(--text-dim);line-height:1.5}
.grid-card code{font-size:12px}
.stat b{display:block;font-family:var(--font-display);font-size:22px;font-weight:600;line-height:1.2;margin-bottom:2px}
.stat span{font-size:14px;color:var(--text-dim)}
@media(max-width:480px){.grid-cards.three{gap:8px}.grid-cards.three .grid-card{padding:12px}.stat b{font-size:17px;white-space:nowrap}.stat span{font-size:13px}}

/* Connect form */
.connect-card{border:1px solid var(--border);border-radius:var(--radius-sm);padding:16px;background:var(--bg-raised)}
.connect-card form{margin-top:4px}
.connect-card input[type=password]{display:block;width:100%;height:40px;padding:0 12px;margin:0 0 12px;font-size:16px;font-family:var(--font-mono);color:var(--text);background:var(--bg-raised);border:1px solid var(--border);border-radius:var(--radius-sm);outline:none;transition:border-color .12s,box-shadow .12s}
.connect-card input[type=password]:hover{border-color:var(--border-hi)}
.connect-card input[type=password]:focus{border-color:var(--focus);box-shadow:0 0 0 3px color-mix(in srgb,var(--focus) 35%,transparent)}
.hint{margin:12px 0 0;font-size:13px;color:var(--text-dim)}

/* Steps */
.steps{border:1px solid var(--border);border-radius:var(--radius-sm);background:var(--bg-raised);overflow:hidden}
.step{display:flex;gap:14px;padding:14px 16px;border-top:1px solid var(--border-soft)}
.step:first-child{border-top:0}
.step .n{font-family:var(--font-mono);font-size:13px;font-weight:600;color:var(--text-dim);padding-top:2px}
.step p{margin:0;font-size:14px;color:var(--text-dim)}

/* Footer */
.foot{margin-top:48px;padding-top:16px;border-top:1px solid var(--border-soft);display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;font-size:14px;color:var(--text-dim)}
.foot a{color:var(--link);font-weight:500}

/* Long-form (privacy policy) */
.doc h2{font-size:24px}
.doc ul{padding-left:22px;margin:0 0 12px}
.doc li{margin:4px 0}
.doc p,.doc li{font-size:16px}
.doc .contact{border:1px solid var(--border);background:var(--bg-sunken);border-radius:var(--radius-sm);padding:16px}
.doc .contact p{margin:0}
`;

const THEME_BOOT = `(function(){var s=null;try{s=localStorage.getItem('joytree-theme')}catch(e){}document.documentElement.setAttribute('data-theme',s==='dark'?'dark':'light')})();`;
const THEME_TOGGLE = `(function(){var b=document.getElementById('themeToggle');if(!b)return;var sun=document.getElementById('iconSun'),moon=document.getElementById('iconMoon');function paint(){var d=document.documentElement.getAttribute('data-theme')==='dark';sun.hidden=d;moon.hidden=!d;}paint();b.addEventListener('click',function(){var d=document.documentElement.getAttribute('data-theme')==='dark';var n=d?'light':'dark';document.documentElement.setAttribute('data-theme',n);try{localStorage.setItem('joytree-theme',n)}catch(e){}paint();});})();`;

function renderShell({ title, description, main, baseUrl }) {
  const base = baseUrl || 'https://joytree.site';
  return `<!DOCTYPE html>
<html lang="en" data-theme="light"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="theme-color" content="#f6f8fa">
<title>${title}</title>
<meta name="description" content="${description}">
<link rel="icon" type="image/png" href="${LOGO_DATA_URI}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Source+Serif+4:opsz,wght@8..60,500;8..60,600&display=swap">
<script>${THEME_BOOT}</script>
<style>${CSS}</style></head>
<body>
<header class="topbar"><div class="topbar-inner">
  <a href="${base}" class="brand" target="_blank" rel="noopener"><span class="brand-mark" aria-hidden="true"><img src="${LOGO_DATA_URI}" alt="" width="24" height="24"></span><span class="brand-name">JOYTREE<span class="brand-dot">mcp</span></span></a>
  <nav class="topnav">
    <a class="topnav-link" href="https://docs.joytree.site" target="_blank" rel="noopener">Docs</a>
    <a class="topnav-link opt" href="${base}/dashboard" target="_blank" rel="noopener">Dashboard</a>
  </nav>
  <button class="icon-btn theme-toggle" id="themeToggle" aria-label="Toggle theme">
    <svg id="iconSun" width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="2"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
    <svg id="iconMoon" width="18" height="18" viewBox="0 0 24 24" fill="none" hidden><path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>
  </button>
</div></header>
<main class="page">
${main}
<footer class="foot"><span>&copy; JOYTREE</span><span><a href="${base}" target="_blank" rel="noopener">joytree.site</a></span></footer>
</main>
<script>${THEME_TOGGLE}</script>
</body></html>`;
}

module.exports = { renderShell };
