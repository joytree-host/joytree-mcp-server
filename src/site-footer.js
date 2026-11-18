'use strict';
/** The joytree.site footer (green cloth + line art), ported from the main site's edge-footer.js
 *  so the mcp pages carry the same footer. Flat: no borders, radius or shadows. */
const { LOGO_DATA_URI } = require('./assets/logo');

const EDGE_FOOTER_ART = `<svg class="sf-art" viewBox="0 0 1200 260" preserveAspectRatio="xMidYMax slice" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <path d="M0 232C120 210 220 214 330 226S560 242 700 228 950 206 1080 220 1170 230 1200 226"/>
  <path d="M0 250C150 236 300 244 450 248S800 238 1000 246 1160 244 1200 242" opacity=".6"/>
  <path d="M600 232V150M600 190L574 168M600 176L628 154M600 160L584 142M600 232C590 246 570 250 552 254M600 232C612 246 634 250 650 254"/>
  <circle cx="600" cy="112" r="40"/><circle cx="566" cy="136" r="28"/><circle cx="636" cy="132" r="30"/><circle cx="600" cy="84" r="24"/>
  <circle cx="540" cy="92" r="3" fill="currentColor"/><circle cx="664" cy="98" r="3" fill="currentColor"/><circle cx="600" cy="48" r="3" fill="currentColor"/>
  <path d="M432 152H512C534 152 542 124 520 118C522 94 490 84 474 100C462 84 430 92 430 114C412 116 410 150 432 152Z"/>
  <path d="M472 140V114M462 124L472 114L482 124"/>
  <path d="M522 132C548 142 560 150 574 162" stroke-dasharray="3 7"/>
  <path d="M740 120C756 96 758 70 740 46C722 70 724 96 740 120Z"/><circle cx="740" cy="78" r="7"/>
  <path d="M726 104L710 124L728 118M754 104L770 124L752 118M734 124C738 138 742 138 746 124"/>
  <path d="M740 150V204" stroke-dasharray="3 7"/>
  <rect x="210" y="150" width="80" height="82" rx="6"/><path d="M210 177H290M210 204H290"/>
  <circle cx="272" cy="163" r="2.5" fill="currentColor"/><circle cx="272" cy="190" r="2.5" fill="currentColor"/><circle cx="272" cy="217" r="2.5" fill="currentColor"/>
  <path d="M292 182C340 172 380 150 430 138" stroke-dasharray="3 7"/>
  <ellipse cx="120" cy="170" rx="34" ry="10"/><path d="M86 170V212C86 224 154 224 154 212V170M86 191C86 203 154 203 154 191"/>
  <path d="M154 190C170 190 190 190 210 190" stroke-dasharray="3 7"/>
  <rect x="900" y="150" width="110" height="76" rx="8"/><path d="M900 170H1010M918 190L930 198L918 206M938 208H962"/>
  <circle cx="912" cy="160" r="2.5" fill="currentColor"/><circle cx="924" cy="160" r="2.5" fill="currentColor"/><circle cx="936" cy="160" r="2.5" fill="currentColor"/>
  <path d="M772 112C830 122 860 150 900 172" stroke-dasharray="3 7"/>
  <circle cx="1080" cy="110" r="5"/><circle cx="1136" cy="150" r="5"/><circle cx="1064" cy="176" r="5"/>
  <path d="M1085 113L1131 147M1131 153L1069 174M1010 190L1060 178" stroke-dasharray="3 7"/>
  <circle cx="60" cy="108" r="5"/><circle cx="34" cy="150" r="5"/><path d="M56 112L38 146M65 111L96 150" stroke-dasharray="3 7"/>
  <path d="M330 80h10M335 75v10M880 70h10M885 65v10M1010 60h10M1015 55v10M150 70h10M155 65v10" opacity=".7"/>
</svg>`;
const EDGE_SOCIAL = {
  github:   `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.57.1.78-.25.78-.55 0-.27-.01-1.17-.02-2.12-3.2.7-3.88-1.36-3.88-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.02 1.75 2.68 1.25 3.34.96.1-.74.4-1.25.72-1.54-2.56-.29-5.26-1.28-5.26-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.64 1.59.24 2.76.12 3.05.74.81 1.18 1.84 1.18 3.1 0 4.43-2.7 5.4-5.28 5.69.42.36.78 1.08.78 2.18 0 1.57-.01 2.84-.01 3.23 0 .3.2.66.79.55A10.52 10.52 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z"/></svg>`,
  linkedin: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.03-1.85-3.03-1.85 0-2.14 1.45-2.14 2.94v5.66H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45z"/></svg>`,
  whatsapp: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12 .5C5.7.5.6 5.6.6 11.9c0 2.1.56 4.06 1.53 5.76L.5 23.5l5.98-1.57a11.3 11.3 0 0 0 5.5 1.4h.01c6.3 0 11.4-5.1 11.4-11.4S18.3.5 12 .5zm0 20.7h-.01a9.4 9.4 0 0 1-4.8-1.32l-.34-.2-3.55.93.95-3.46-.22-.36a9.36 9.36 0 0 1-1.44-5c0-5.18 4.22-9.4 9.41-9.4 2.51 0 4.87.98 6.65 2.76a9.34 9.34 0 0 1 2.75 6.65c0 5.19-4.22 9.4-9.4 9.4zm5.16-7.04c-.28-.14-1.67-.82-1.93-.92-.26-.1-.45-.14-.64.14-.19.28-.73.92-.9 1.11-.17.19-.33.21-.61.07-.28-.14-1.18-.43-2.25-1.38-.83-.74-1.4-1.66-1.56-1.94-.16-.28-.02-.43.12-.57.13-.13.28-.33.42-.5.14-.17.19-.28.28-.47.09-.19.05-.35-.02-.5-.07-.14-.64-1.54-.87-2.11-.23-.55-.47-.48-.64-.49h-.55c-.19 0-.5.07-.76.35-.26.28-1 .98-1 2.38 0 1.4 1.02 2.76 1.16 2.95.14.19 2.01 3.07 4.87 4.3.68.29 1.21.47 1.62.6.68.22 1.3.19 1.79.11.55-.08 1.67-.68 1.9-1.34.24-.66.24-1.22.17-1.34-.07-.12-.26-.19-.54-.33z"/></svg>`,
};
function siteFooter(base) {
  const B = String(base || 'https://joytree.site').replace(/\/+$/, '');
  const L = (href, text, ext) => `<a href="${href}"${ext ? ' target="_blank" rel="noopener"' : ''}>${text}</a>`;
  const col = (title, links) => `<div class="sf-col"><div class="sf-title">${title}</div>${links.join('')}</div>`;
  return `<footer class="sf">${EDGE_FOOTER_ART}
  <div class="sf-top">
    <div class="sf-brand">
      <div class="sf-logo"><img src="${LOGO_DATA_URI}" alt="" width="28" height="28"><span>JOYTREE</span></div>
      <p class="sf-tag">Deploy apps, build backends, and ship anything — one platform, every layer.</p>
      <div class="sf-title">FOLLOW US</div>
      <div class="sf-social">
        <a href="https://github.com/Joy-tree" target="_blank" rel="noopener" aria-label="GitHub">${EDGE_SOCIAL.github}</a>
        <a href="https://www.linkedin.com/company/joytree" target="_blank" rel="noopener" aria-label="LinkedIn">${EDGE_SOCIAL.linkedin}</a>
        <a href="https://chat.whatsapp.com/CfTUZ0r6QlW6htOSR0erNv" target="_blank" rel="noopener" aria-label="WhatsApp Community">${EDGE_SOCIAL.whatsapp}</a>
      </div>
    </div>
    <div class="sf-cols">
      ${col('GET STARTED', [L(B + '/signup', 'Create Account'), L(B + '/#pricing', 'Pricing'), L(B + '/whois', 'Search Domains'), L(B + '/domains', 'Domains'), L(B + '/databases', 'Databases'), L(B + '/deploy', 'Deploy'), L(B + '/#how-it-works', 'How It Works'), L(B + '/dashboard', 'Dashboard')])}
      ${col('PLATFORM', [L(B + '/#how-it-works', 'Features'), L('https://docs.joytree.site', 'Documentation'), L('https://github.com/Joy-tree', 'GitHub', true)])}
      ${col('SUPPORT', [L('https://support.joytree.site/', 'Help Center', true), L('https://chat.whatsapp.com/CfTUZ0r6QlW6htOSR0erNv', 'WhatsApp Community', true), L('mailto:support@joytree.site', 'support@joytree.site')])}
      ${col('COMPANY', [L(B + '/about', 'About Us')])}
      ${col('LEGAL', [L(B + '/privacy', 'Privacy Policy')])}
    </div>
  </div>
  <div class="sf-bottom"><span>Built by developers, for developers.</span><span>&copy; ${new Date().getFullYear()} JOYTREE</span></div>
</footer>`;
}

const SITE_FOOTER_CSS = `
/* ── Footer (same content + green cloth as the site footer, flat: no borders, no radius, no shadows) ── */
.sf{position:relative;overflow:hidden;isolation:isolate;margin-top:8px;padding:44px 22px 196px;background:#05452f;color:rgba(255,255,255,.86)}
.sf::before{content:"";position:absolute;inset:0;z-index:-2;opacity:.5;pointer-events:none;background:radial-gradient(rgba(255,255,255,.16) 1px,transparent 1.4px) 0 0/22px 22px}
.sf-art{position:absolute;left:0;right:0;bottom:0;width:100%;height:190px;z-index:-1;pointer-events:none;color:rgba(255,255,255,.3)}
.sf-top{max-width:1100px;margin:0 auto;display:flex;flex-wrap:wrap;gap:36px 56px;justify-content:space-between}
.sf-logo{display:flex;align-items:center;gap:10px;margin-bottom:12px}
.sf-logo img{display:block;width:28px;height:28px}
.sf-logo span{font-weight:800;font-size:.9rem;letter-spacing:.06em;color:#fff}
.sf-tag{max-width:34ch;margin:0 0 20px;font-size:.88rem;line-height:1.6;color:rgba(255,255,255,.82)}
.sf-title{font-weight:700;font-size:.68rem;letter-spacing:.14em;color:#fff;margin-bottom:10px}
.sf-social{display:flex;gap:8px}
.sf-social a{width:38px;height:38px;display:inline-flex;align-items:center;justify-content:center;background:#0a6b4a;color:#fff;border:0;border-radius:0;transition:background .15s,color .15s}
.sf-social a:hover{background:#fff;color:#047857}
.sf-cols{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:28px 24px;flex:1 1 320px}
.sf-col a{display:block;padding:4px 0;font-size:.86rem;color:rgba(255,255,255,.88);text-decoration:none;word-break:break-word}
.sf-col a:hover{color:#a7f3d0;text-decoration:underline}
.sf-bottom{max-width:1100px;margin:36px auto 0;display:flex;flex-wrap:wrap;justify-content:space-between;gap:8px 24px;font-size:.78rem;color:rgba(255,255,255,.82)}
@media (min-width:721px){.sf-cols{grid-template-columns:repeat(5,max-content);justify-content:space-between;flex:1 1 auto}.sf-top{flex-wrap:nowrap}.sf{padding-bottom:210px}.sf-art{height:230px}}
`;

module.exports = { siteFooter, SITE_FOOTER_CSS };
