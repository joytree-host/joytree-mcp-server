'use strict';
// Setup guide (now a section of the single Connect page) -- step-by-step "connect JOYTREE to Claude" walkthrough with annotated
// screenshots. Exposes the guide's CSS, script and body so connect-page.js can
// render it inline under the hero; /guide redirects to /#guide.
const fs = require('fs');
const path = require('path');

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
.guide p a,.guide li a,.guide td a,.guide .notes a{color:var(--link);font-weight:500}
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



/* step captions + travelling cursor ---------------------------------- */
.guide{--cur-ring:#e8590c}
.guide .gstep{display:flex;gap:12px;align-items:flex-start;margin:0 0 10px;font-size:16px;line-height:1.45;color:var(--text)}
.guide .gstep b.n,.guide .gstep>b:first-child{flex:none;display:grid;place-items:center;width:28px;height:28px;border-radius:50%;background:var(--cur-ring);color:#fff;font:700 14px/1 var(--font-body)}
.guide .gstep span b{font-weight:600}
.guide figure{margin:28px 0 12px}
.guide .frame{border-radius:var(--radius-sm)}
.guide .stage{position:relative;overflow:hidden}
.curx{position:absolute;left:var(--x1);top:var(--y1);width:0;height:0;z-index:3;pointer-events:none;filter:drop-shadow(0 3px 3px rgba(0,0,0,.35))}
.curx svg{position:absolute;left:-3px;top:-3px;display:block;max-width:none}
.curx::after{content:'';position:absolute;left:-22px;top:-22px;width:44px;height:44px;border-radius:50%;border:4px solid var(--cur-ring,#e8590c);opacity:0;transform:scale(.3)}
.guide.js figure:not(.seen) .curx{opacity:0;left:var(--sx);top:var(--sy)}
.guide figure.seen .curx.one{animation:cur-one 5s cubic-bezier(.5,0,.2,1) .25s infinite}
.guide figure.seen .curx.two{animation:cur-two 7s cubic-bezier(.5,0,.2,1) .25s infinite}
.guide figure.seen .curx.one::after{animation:ring-one 5s ease-out .25s infinite}
.guide figure.seen .curx.two::after{animation:ring-two 7s ease-out .25s infinite}
@keyframes cur-one{0%{left:var(--sx);top:var(--sy);opacity:0}10%{opacity:1}38%,80%{left:var(--x1);top:var(--y1);opacity:1}92%,100%{left:var(--x1);top:var(--y1);opacity:0}}
@keyframes ring-one{0%,40%{opacity:0;transform:scale(.3)}42%{opacity:.95;transform:scale(.55)}58%,100%{opacity:0;transform:scale(1.6)}}
@keyframes cur-two{0%{left:var(--sx);top:var(--sy);opacity:0}8%{opacity:1}24%,40%{left:var(--x1);top:var(--y1);opacity:1}62%,84%{left:var(--x2);top:var(--y2);opacity:1}94%,100%{left:var(--x2);top:var(--y2);opacity:0}}
@keyframes ring-two{0%,25%{opacity:0;transform:scale(.3)}27%{opacity:.95;transform:scale(.55)}38%{opacity:0;transform:scale(1.6)}39%,63%{opacity:0;transform:scale(.3)}65%{opacity:.95;transform:scale(.55)}78%,100%{opacity:0;transform:scale(1.6)}}
.guide .notes{list-style:none;margin:12px 0 0;padding:0 0 0 14px;border-left:2px solid var(--border-soft);color:var(--text-dim);font-size:14px}
.guide .notes li{margin:6px 0}
.guide .notes b{color:var(--text)}
.guide-dialog .curx{left:var(--x1);top:var(--y1);opacity:1;animation:none}
.guide-dialog .curx::after{display:none}

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
@media(max-width:560px){.guide .spec td:first-child{white-space:normal}.guide .curx svg{width:24px;height:32px}}
@media(prefers-reduced-motion:reduce){
  .guide figure .curx,.guide figure .curx::after{animation:none!important}
  .guide figure .curx{left:var(--x1);top:var(--y1);opacity:1}
  .guide details>div,.g-bar{transition:none;animation:none}
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

  // cursors start travelling once their figure scrolls into view
  var figs=[].slice.call(root.querySelectorAll('figure'));
  if('IntersectionObserver' in window && !reduce){
    var fio=new IntersectionObserver(function(es){ es.forEach(function(en){ if(en.isIntersecting){ en.target.classList.add('seen'); fio.unobserve(en.target); } }); },{threshold:.35});
    figs.forEach(function(f){ fio.observe(f); });
  } else { figs.forEach(function(f){ f.classList.add('seen'); }); }

  // lightbox (clone the frame; cursor positions use %, so they stay aligned)
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

module.exports = { GUIDE_CSS: CSS, GUIDE_JS: JS, GUIDE_BODY: BODY };
