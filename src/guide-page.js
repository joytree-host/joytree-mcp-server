'use strict';
// /guide -- step-by-step "connect JOYTREE to Claude" walkthrough with annotated
// screenshots. Rendered inside the shared site shell so it inherits the topbar,
// theme toggle and design tokens (light default, dark selectable).
const fs = require('fs');
const path = require('path');
const { renderShell } = require('./site-shell');

const BODY = fs.readFileSync(path.join(__dirname, 'guide', 'body.html'), 'utf8');

const CSS = `
/* ---- Guide ---------------------------------------------------------- */
.guide{--pin:#0969da;--pin-ink:#fff;--note:#0969da;--warn:#9a6700;--bad:#cf222e;--ok:#0969da}
html[data-theme="dark"] .guide{--pin:#4493f8;--pin-ink:#0d1117;--note:#4493f8;--warn:#d29922;--bad:#f85149;--ok:#4493f8}
.guide{scroll-padding-top:calc(var(--topbar-h) + 16px)}
html{scroll-padding-top:calc(var(--topbar-h) + 16px)}
.g-bar{position:absolute;left:0;bottom:-1px;height:2px;width:0;background:var(--link);transition:width .08s linear}

/* hero */
.guide .g-hero{padding-bottom:28px}
.guide .g-hero h1 em{font-style:italic;font-weight:500;color:var(--text-dim)}
.guide .g-meta{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));margin-top:28px;border:1px solid var(--border);border-radius:var(--radius-sm);background:var(--bg-raised);overflow:hidden}
.guide .g-meta div{padding:14px 16px;min-width:0}
.guide .g-meta div+div{border-left:1px solid var(--border-soft)}
.guide .g-meta b{display:block;font-family:var(--font-display);font-size:22px;font-weight:600;line-height:1.2;white-space:nowrap}
.guide .g-meta span{font-size:14px;color:var(--text-dim)}
@media(max-width:480px){.guide .g-meta div{padding:12px}.guide .g-meta b{font-size:17px}.guide .g-meta span{font-size:13px}}
.guide .g-dock-slot{margin-top:26px}

/* layout */
.guide .g-layout{display:block;padding-top:8px}
.guide aside.g-toc{display:none}
@media(min-width:1000px){
  .guide .g-layout{display:grid;grid-template-columns:200px minmax(0,1fr);gap:56px}
  .guide aside.g-toc{display:block}
  .guide aside .stick{position:sticky;top:calc(var(--topbar-h) + 24px)}
  .guide aside small{display:block;font-size:12px;font-weight:600;color:var(--text-dim);margin-bottom:10px}
  .guide aside a{display:block;padding:6px 0 6px 14px;border-left:2px solid var(--border-soft);color:var(--text-dim);font-size:14px;transition:color .15s,border-color .15s}
  .guide aside a:hover{color:var(--text);border-left-color:var(--border-hi)}
  .guide aside a.on{color:var(--text);font-weight:600;border-left-color:var(--link)}
}
.guide .g-main{max-width:780px;min-width:0}

/* sections */
.guide section.s{padding:36px 0 4px;border-top:1px solid var(--border-soft);margin-top:12px}
.guide section.s:first-child{border-top:0;margin-top:0;padding-top:8px}
.guide .sh{display:flex;align-items:center;gap:12px;margin-bottom:14px;flex-wrap:wrap}
.guide .sh .n{font:600 12px/1 var(--font-mono);letter-spacing:.04em;color:var(--text-dim);border:1px solid var(--border);background:var(--bg-sunken);border-radius:999px;padding:5px 10px}
.guide .sh h2{margin:0;padding:0;border:0;font-size:clamp(22px,4vw,28px)}
.guide h3{margin:26px 0 8px;font-size:17px}
.guide p{color:var(--text-dim);max-width:68ch}
.guide p strong,.guide li strong,.guide td strong{color:var(--text)}
.guide p a,.guide li a,.guide td a,.guide .legend a{color:var(--link);font-weight:500}
.guide p a:hover,.guide li a:hover{text-decoration:underline}
.guide ul.plain,.guide ol.plain{margin:12px 0 12px 20px;padding:0;color:var(--text-dim)}
.guide ul.plain li{margin:8px 0;padding-left:4px}

/* copy field */
.guide .field{display:flex;align-items:stretch;border:1px solid var(--border);border-radius:var(--radius-sm);background:var(--bg-sunken);margin:16px 0;max-width:620px;overflow:hidden}
.guide .field code{flex:1;background:none;font-size:14px;padding:11px 14px;overflow-x:auto;white-space:nowrap;border-radius:0}
.guide .field button,.guide .chip button{border:0;border-left:1px solid var(--border);background:var(--bg-raised);color:var(--text);font:600 13px/1 var(--font-body);padding:0 16px;cursor:pointer;min-width:76px;transition:background .12s}
.guide .field button:hover,.guide .chip button:hover{background:var(--bg-hover)}
.guide .field button.done,.guide .chip button.done{background:var(--link);color:#fff}

/* spec table */
.guide .scroll{overflow-x:auto;border:1px solid var(--border);border-radius:var(--radius-sm);margin:18px 0}
.guide .spec{width:100%;border-collapse:collapse;font-size:14px}
.guide .spec th{font-size:12px;font-weight:600;color:var(--text-dim);text-align:left;padding:10px 14px;background:var(--bg-sunken);border-bottom:1px solid var(--border)}
.guide .spec td{padding:12px 14px;border-top:1px solid var(--border-soft);vertical-align:top;color:var(--text-dim)}
.guide .spec tr:first-child td{border-top:0}
.guide .spec td:first-child{color:var(--text);font-weight:600;white-space:nowrap}
.guide .tag{display:inline-block;font-size:11px;font-weight:600;padding:1px 8px;border:1px solid var(--ok);color:var(--ok);border-radius:999px;margin-left:8px;vertical-align:middle}
.guide .tag.w{border-color:var(--warn);color:var(--warn)}
.guide .tag.r{border-color:var(--bad);color:var(--bad)}

/* callouts */
.guide .note,.guide .warn{margin:20px 0;padding:12px 16px;border:1px solid var(--border);border-left:3px solid var(--note);border-radius:var(--radius-sm);background:var(--bg-sunken);max-width:68ch}
.guide .warn{border-left-color:var(--warn)}
.guide .note b,.guide .warn b{display:block;font-size:13px;font-weight:600;color:var(--note);margin-bottom:2px}
.guide .warn b{color:var(--warn)}
.guide .note p,.guide .warn p{margin:0;color:var(--text);font-size:14px}

/* figures */
.guide figure{margin:24px 0 12px}
.guide .frame{border:1px solid var(--border);border-radius:var(--radius-sm);background:var(--bg-raised);overflow:hidden}
.guide figure{border-radius:var(--radius-sm);box-shadow:0 8px 24px -14px rgba(31,35,40,.22)}
html[data-theme="dark"] .guide figure{box-shadow:0 8px 24px -14px rgba(0,0,0,.7)}
.guide .cap{display:flex;justify-content:space-between;align-items:center;gap:12px;padding:8px 12px;background:var(--bg-sunken);border-bottom:1px solid var(--border);font-size:12px;color:var(--text-dim)}
.guide .cap>span{display:inline-flex;align-items:center;gap:10px}
.guide .cap>span::before{content:'';width:34px;height:10px;flex:none;background:radial-gradient(circle at 5px 5px,var(--border-hi) 4px,transparent 4.5px),radial-gradient(circle at 17px 5px,var(--border-hi) 4px,transparent 4.5px),radial-gradient(circle at 29px 5px,var(--border-hi) 4px,transparent 4.5px)}
.guide .cap i{font-style:normal;color:var(--text-faint)}
.guide .cap button{all:unset;cursor:zoom-in;color:var(--link);font-weight:600;padding:2px 6px;border-radius:4px}
.guide .cap button:hover{background:var(--bg-hover)}
.guide .cap button:focus-visible{outline:2px solid var(--focus)}
.guide .stage{position:relative;line-height:0;cursor:zoom-in;background:#fff}
.guide .stage img{display:block;width:100%;height:auto}
.guide .pin{position:absolute;transform:translate(-50%,-50%) scale(1);width:26px;height:26px;display:grid;place-items:center;border-radius:50%;background:var(--pin);color:var(--pin-ink);font:700 13px/1 var(--font-body);font-style:normal;box-shadow:0 0 0 3px rgba(255,255,255,.9),0 4px 12px rgba(0,0,0,.35);transition:transform .25s cubic-bezier(.34,1.56,.64,1),opacity .2s}
.guide .pin::after{content:'';position:absolute;inset:-3px;border-radius:50%;border:2px solid var(--pin);opacity:0;animation:g-ping 2.6s ease-out infinite;animation-delay:var(--d,0s)}
@keyframes g-ping{0%{transform:scale(.9);opacity:.7}70%,100%{transform:scale(1.9);opacity:0}}
/* entrance: pins spring in one by one when the figure scrolls into view */
.guide.js figure:not(.seen) .pin{transform:translate(-50%,-50%) scale(0);opacity:0}
.guide figure.seen .pin{transition-delay:var(--d,0s)}
/* legend hover highlights the matching pin */
.guide figure.hl .pin{opacity:.35}
.guide figure.hl .pin.on{opacity:1;transform:translate(-50%,-50%) scale(1.25)}

.guide .legend{list-style:none;counter-reset:l;margin:0;padding:0;border:1px solid var(--border);border-top:0;border-radius:0 0 var(--radius-sm) var(--radius-sm);overflow:hidden;margin-top:-1px}
.guide .legend li{counter-increment:l;display:grid;grid-template-columns:44px 1fr;border-top:1px solid var(--border-soft);color:var(--text-dim);font-size:14px;transition:background .12s}
.guide .legend li:first-child{border-top:0}
.guide .legend li:hover{background:var(--bg-sunken)}
.guide .legend li::before{content:counter(l);display:grid;place-items:center;font:700 13px/1 var(--font-body);color:var(--pin);border-right:1px solid var(--border-soft);background:var(--bg-sunken)}
.guide .legend li span{padding:10px 14px}
.guide .legend li b{color:var(--text)}
.guide figure .frame{border-bottom-left-radius:0;border-bottom-right-radius:0}

/* prompts */
.guide .chips{margin:18px 0;border:1px solid var(--border);border-radius:var(--radius-sm);overflow:hidden}
.guide .chip{display:grid;grid-template-columns:1fr auto;border-top:1px solid var(--border-soft);background:var(--bg-raised)}
.guide .chip:first-child{border-top:0}
.guide .chip div{padding:12px 16px;min-width:0}
.guide .chip q{display:block;color:var(--text);quotes:none;font-size:15px;font-weight:500}
.guide .chip small{display:block;margin-top:4px;font:12px/1.4 var(--font-mono);color:var(--text-faint);overflow-wrap:anywhere}

/* accordion */
.guide details{border:1px solid var(--border);border-radius:var(--radius-sm);background:var(--bg-raised);margin:8px 0}
.guide details[open]{background:var(--bg-sunken)}
.guide summary{list-style:none;cursor:pointer;padding:13px 40px 13px 16px;color:var(--text);font-weight:600;font-size:15px;position:relative;border-radius:var(--radius-sm)}
.guide summary::-webkit-details-marker{display:none}
.guide summary:hover{background:var(--bg-hover)}
.guide summary::after{content:'';position:absolute;right:16px;top:50%;width:8px;height:8px;border-right:2px solid var(--text-dim);border-bottom:2px solid var(--text-dim);transform:translateY(-70%) rotate(45deg);transition:transform .2s}
.guide details[open] summary::after{transform:translateY(-30%) rotate(-135deg)}
.guide details>div{padding:0 16px 8px;animation:g-open .22s ease-out}
@keyframes g-open{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:none}}

/* flow */
.guide .flow{display:grid;grid-template-columns:1fr;border:1px solid var(--border);border-radius:var(--radius-sm);margin:22px 0;overflow:hidden;background:var(--bg-raised)}
.guide .flow div{padding:14px 16px;border-top:1px solid var(--border-soft)}
.guide .flow div:first-child{border-top:0}
.guide .flow b{display:block;color:var(--text);font-size:15px}
.guide .flow span{color:var(--text-dim);font-size:14px}
@media(min-width:720px){.guide .flow{grid-template-columns:repeat(3,1fr)}.guide .flow div{border-top:0;border-left:1px solid var(--border-soft)}.guide .flow div:first-child{border-left:0}}

.guide .cta{margin:44px 0 0;border:1px solid var(--border);border-radius:var(--radius-sm);padding:26px 24px;background:var(--bg-sunken)}
.guide .cta h2{margin:0 0 8px;padding:0;border:0;font-size:24px}
.guide .cta .hero-actions{margin-top:16px}

/* lightbox */
.guide-dialog{border:1px solid var(--border);border-radius:var(--radius-sm);background:var(--bg);padding:0;max-width:min(96vw,1180px);width:100%;color:var(--text);overflow:hidden}
.guide-dialog::backdrop{background:rgba(1,4,9,.8);backdrop-filter:blur(3px)}
.guide-dialog .frame{border:0;border-radius:0;box-shadow:none}
.guide-dialog .cap button{cursor:pointer}
.guide-dialog .stage{cursor:zoom-out}
.guide-dialog .pin{transform:translate(-50%,-50%) scale(1)!important;opacity:1!important}
@media(max-width:560px){.guide .pin{width:22px;height:22px;font-size:12px}.guide .spec td:first-child{white-space:normal}.guide .legend li{grid-template-columns:38px 1fr}}
@media(prefers-reduced-motion:reduce){
  .guide .pin::after{animation:none}
  .guide.js figure:not(.seen) .pin{transform:translate(-50%,-50%) scale(1);opacity:1}
  .guide .pin,.guide details>div,.g-bar{transition:none;animation:none}
  html{scroll-behavior:auto}
}
`;

const JS = `(function(){
  var root=document.querySelector('.guide'); if(!root) return;
  root.classList.add('js');
  var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;

  // copy buttons
  document.addEventListener('click',function(e){
    var b=e.target.closest('[data-copy]'); if(!b) return;
    var t=b.getAttribute('data-copy'), old=b.textContent;
    function ok(){ b.textContent='Copied'; b.classList.add('done'); setTimeout(function(){b.textContent=old;b.classList.remove('done');},1400); }
    if(navigator.clipboard&&navigator.clipboard.writeText){ navigator.clipboard.writeText(t).then(ok,function(){}); }
    else { var a=document.createElement('textarea'); a.value=t; document.body.appendChild(a); a.select(); try{document.execCommand('copy');ok();}catch(_){} a.remove(); }
  });

  // pins: stagger delay, legend <-> pin highlighting, spring-in on scroll
  var figs=[].slice.call(root.querySelectorAll('figure'));
  figs.forEach(function(fig){
    var pins=[].slice.call(fig.querySelectorAll('.pin'));
    pins.forEach(function(p,i){
      p.style.setProperty('--d',(i*0.09+0.12)+'s');
      var l=p.style.left; if(l&&l.indexOf('%')>0) p.style.left='clamp(14px,'+l+',calc(100% - 14px))';
    });
    [].slice.call(fig.querySelectorAll('.legend li')).forEach(function(li,i){
      function on(){ fig.classList.add('hl'); if(pins[i]) pins[i].classList.add('on'); }
      function off(){ fig.classList.remove('hl'); pins.forEach(function(p){p.classList.remove('on');}); }
      li.addEventListener('mouseenter',on); li.addEventListener('mouseleave',off);
    });
  });
  if('IntersectionObserver' in window && !reduce){
    var fio=new IntersectionObserver(function(es){ es.forEach(function(en){ if(en.isIntersecting){ en.target.classList.add('seen'); fio.unobserve(en.target); } }); },{threshold:.35});
    figs.forEach(function(f){ fio.observe(f); });
  } else { figs.forEach(function(f){ f.classList.add('seen'); }); }

  // lightbox (clone the frame; pins use %, so they stay aligned)
  var lb=document.createElement('dialog'); lb.className='guide-dialog'; lb.setAttribute('aria-label','Enlarged screenshot'); document.body.appendChild(lb);
  function open(frame){
    lb.innerHTML=''; var c=frame.cloneNode(true);
    var z=c.querySelector('.zoom'); if(z) z.textContent='Close';
    lb.appendChild(c);
    if(lb.showModal) lb.showModal(); else lb.setAttribute('open','');
  }
  root.querySelectorAll('figure .frame').forEach(function(f){
    f.addEventListener('click',function(e){ if(e.target.closest('.stage')||e.target.closest('.zoom')) open(f); });
  });
  lb.addEventListener('click',function(){ if(lb.close) lb.close(); else lb.removeAttribute('open'); });

  // reading progress in the topbar + scroll-spy for the sidebar
  var top=document.querySelector('.topbar'), bar=document.createElement('div'); bar.className='g-bar'; if(top) top.appendChild(bar);
  function prog(){ var h=document.documentElement, m=h.scrollHeight-h.clientHeight; bar.style.width=(m>0?(h.scrollTop/m*100):0)+'%'; }
  addEventListener('scroll',prog,{passive:true}); prog();
  var links={}; root.querySelectorAll('aside a').forEach(function(a){ links[a.getAttribute('href').slice(1)]=a; });
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){
      es.forEach(function(en){ if(en.isIntersecting){
        Object.keys(links).forEach(function(k){ links[k].classList.remove('on'); });
        var l=links[en.target.id]; if(l) l.classList.add('on');
      }});
    },{rootMargin:'-20% 0px -70% 0px'});
    root.querySelectorAll('section.s').forEach(function(s){ io.observe(s); });
  }
})();`;

function renderGuidePage({ baseUrl, dock = '' } = {}) {
  const main = `
<div class="guide">
  <section class="g-hero hero">
    <p class="eyebrow">Setup guide</p>
    <h1>Connect JOYTREE to Claude in <em>two minutes.</em></h1>
    <p class="lede">A step-by-step walkthrough using the real screens: add the connector, sign in once, then decide exactly what Claude may do on its own and what it must ask you about first.</p>
    <div class="g-meta">
      <div><b>~2 min</b><span>to connect</span></div>
      <div><b>5 steps</b><span>start to finish</span></div>
      <div><b>0 installs</b><span>runs in the cloud</span></div>
    </div>
    ${dock ? `<div class="g-dock-slot">${dock}</div>` : ''}
  </section>
${BODY}
</div>`;
  return renderShell({
    title: 'Setup guide - JOYTREE MCP',
    description: 'Step-by-step guide to connecting JOYTREE to Claude, with annotated screenshots, permission modes and troubleshooting.',
    main,
    baseUrl,
    wide: true,
    extraCss: CSS,
    extraScript: JS,
  });
}

module.exports = { renderGuidePage };
