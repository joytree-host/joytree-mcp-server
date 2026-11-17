'use strict';

/**
 * "Works with" agent dock -- an overlapping avatar stack in a pill:
 *   - springs in once, staggered, when it scrolls into view
 *   - spotlights one agent at a time (lift + ring) with the name cross-fading
 *   - on hover (desktop) the stack fans out and magnifies around the pointer,
 *     like a dock; touch users can tap any avatar to spotlight it
 *   - "Show all" expands it into a labelled grid (same DOM, so logo gradient
 *     ids never duplicate)
 *   - prefers-reduced-motion: fully static, no cycling, no entrance
 *
 * Logos come from ./assets/agents (the official marks already used on the
 * Connect page), so swapping a logo there updates the dock automatically.
 * No dependencies, no network.
 */
const { AGENTS_HTML } = require('./assets/agents');

// Parse the Connect page's logo entries: <div class="agent[ inv]">LOGO Name</div>
function parseAgents(html) {
  return html
    .split('<div class="agent')
    .slice(1)
    .map((chunk) => {
      const inv = /^\s*inv"/.test(chunk);
      const inner = chunk.replace(/^[^"]*">/, '').replace(/<\/div>\s*$/, '').trim();
      const name = inner.replace(/<svg[\s\S]*?<\/svg>/g, '').replace(/<img[^>]*>/g, '').replace(/<[^>]+>/g, '').trim();
      return { name, inv, logo: inner.slice(0, inner.lastIndexOf(name)).trim() };
    });
}

const AGENTS = parseAgents(AGENTS_HTML);

const items = AGENTS.map(
  (a, i) =>
    `<li class="dk-it" style="--i:${i}" tabindex="0" data-name="${a.name}"><span class="dk-av${a.inv ? ' inv' : ''}" aria-hidden="true">${a.logo}</span><span class="dk-lb">${a.name}</span></li>`
).join('');

const AGENT_DOCK_HTML =
  `<div class="dock" data-dock>` +
  `<div class="dk-row">` +
  `<div class="dk-pill"><ul class="dk-stack" id="dkStack" aria-label="Agents that work with JOYTREE">${items}</ul></div>` +
  `<button type="button" class="dk-toggle" aria-expanded="false" aria-controls="dkStack" data-l-open="Show less" data-l-closed="Show all ${AGENTS.length}" data-s-open="Less" data-s-closed="All ${AGENTS.length}"><span class="dk-l">Show all ${AGENTS.length}</span><span class="dk-s">All ${AGENTS.length}</span></button>` +
  `</div>` +
  `<p class="dk-cap" aria-hidden="true"><span class="dk-name">${AGENTS[0].name}</span><span class="dk-sub">and any other MCP-compatible client</span></p>` +
  `</div>`;

const AGENT_DOCK_CSS = `
/* ---- Agent dock ----------------------------------------------------- */
.dock{--s:44px;--ov:-14px;--spring:cubic-bezier(.34,1.56,.64,1)}
.dk-row{display:flex;align-items:center;justify-content:space-between;gap:12px}
.dk-pill{display:inline-flex;min-width:0;max-width:100%;padding:8px 14px 8px 20px;border:1px solid var(--border);background:var(--bg-sunken);border-radius:999px;transition:border-radius .3s,padding .3s}
.dk-stack{display:flex;align-items:center;list-style:none;margin:0;padding:0}
.dk-it{position:relative;margin-left:var(--ov);outline:none;cursor:default;transition:margin .38s cubic-bezier(.2,.8,.2,1)}
.dk-it:first-child{margin-left:0}
.dk-av{display:grid;place-items:center;width:var(--s);height:var(--s);border-radius:50%;background:#fff;overflow:hidden;
  border:2px solid var(--bg-sunken);box-shadow:0 0 0 1px var(--border-soft);
  transform:translateY(calc(var(--lift,0) * -1px)) scale(var(--sc,1));
  transition:transform .4s var(--spring),box-shadow .25s}
.dk-av svg{width:26px;height:26px;display:block;flex:none;background:none;padding:0;border-radius:0}
.dk-av img{display:block;height:26px;width:auto;border-radius:4px}
.dk-av .tile{display:grid;place-items:center;width:100%;height:100%;background:transparent}
.dk-av .tile svg{width:24px;height:24px}
.dk-av.inv{background:var(--tile)}
.dk-av.inv svg path{fill:var(--bg)}
.dk-it.is-on{z-index:10}
.dk-it.is-on .dk-av,.dk-it:focus-visible .dk-av{--lift:7;--sc:1.14;box-shadow:0 0 0 2px var(--link),0 8px 16px -6px rgba(31,35,40,.45)}
.dk-it:focus-visible{z-index:11}
.dk-lb{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}

.dk-s{display:none}
.dk-toggle{flex:none;display:inline-flex;align-items:center;gap:6px;height:32px;padding:0 12px;border:1px solid var(--border);border-radius:var(--radius-sm);background:var(--bg-raised);color:var(--text);font:600 13px/1 var(--font-body);cursor:pointer;transition:background .12s,border-color .12s}
.dk-toggle:hover{background:var(--bg-sunken);border-color:var(--border-hi)}
.dk-toggle::after{content:'';width:6px;height:6px;border-right:2px solid var(--text-dim);border-bottom:2px solid var(--text-dim);transform:translateY(-2px) rotate(45deg);transition:transform .25s}
.dk-toggle[aria-expanded="true"]::after{transform:translateY(1px) rotate(-135deg)}

.dk-cap{display:flex;align-items:baseline;gap:8px;flex-wrap:wrap;margin:10px 4px 0;min-height:22px;font-size:14px;color:var(--text-dim)}
.dk-name{display:inline-block;font-weight:600;color:var(--text);transition:opacity .18s,transform .18s}
.dk-name.swap{opacity:0;transform:translateY(5px)}

/* entrance: avatars spring in one by one when scrolled into view */
.dock.js:not(.in) .dk-av{opacity:0}
.dock.in .dk-av{animation:dk-in .65s var(--spring) backwards;animation-delay:calc(var(--i,0) * 60ms)}
@keyframes dk-in{from{opacity:0;transform:translateY(18px) scale(.45)}to{opacity:1}}

/* fan-out on hover (pointer devices, roomy screens) */
@media(hover:hover) and (min-width:640px){
  .dock:not(.open) .dk-pill:hover .dk-it{margin-left:8px}
  .dock:not(.open) .dk-pill:hover .dk-it:first-child{margin-left:0}
}

/* expanded: labelled grid */
.dock.open .dk-row{flex-direction:column;align-items:stretch;gap:8px}
.dock.open .dk-toggle{align-self:flex-end}
.dock.open .dk-pill{display:block;width:100%;padding:12px;border-radius:12px}
.dock.open .dk-stack{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:8px}
.dock.open .dk-it,.dock.open .dk-it:first-child{margin:0;display:flex;align-items:center;gap:10px;padding:6px 10px 6px 6px;border:1px solid var(--border);border-radius:var(--radius-sm);background:var(--bg-raised);animation:dk-pop .4s var(--spring) backwards;animation-delay:calc(var(--i,0) * 35ms)}
.dock.open .dk-av{--s:32px;width:32px;height:32px;box-shadow:0 0 0 1px var(--border-soft);border-color:transparent}
.dock.open .dk-av svg,.dock.open .dk-av img{width:20px;height:20px}
.dock.open .dk-av img{width:auto}
.dock.open .dk-av .tile svg{width:18px;height:18px}
.dock.open .dk-lb{position:static;width:auto;height:auto;overflow:visible;clip:auto;font-size:14px;font-weight:500;color:var(--text)}
.dock.open .dk-it.is-on .dk-av{--lift:0;--sc:1}
.dock.open .dk-cap{display:none}
@keyframes dk-pop{from{opacity:0;transform:translateY(8px) scale(.96)}to{opacity:1}}

@media(max-width:480px){.dock{--s:38px;--ov:-15px}.dk-pill{padding:6px 10px 6px 14px;min-width:0}.dk-toggle{padding:0 10px}.dk-l{display:none}.dk-s{display:inline}}
@media(prefers-reduced-motion:reduce){
  .dock.js:not(.in) .dk-av{opacity:1}
  .dock.in .dk-av,.dock.open .dk-it{animation:none}
  .dk-av,.dk-it,.dk-name,.dk-pill{transition:none}
}
`;

const AGENT_DOCK_JS = `(function(){
  var docks=document.querySelectorAll('[data-dock]'); if(!docks.length) return;
  var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  var canHover=window.matchMedia&&matchMedia('(hover:hover) and (pointer:fine)').matches;

  [].forEach.call(docks,function(dock){
    dock.classList.add('js');
    var pill=dock.querySelector('.dk-pill'), items=[].slice.call(dock.querySelectorAll('.dk-it'));
    var nameEl=dock.querySelector('.dk-name'), toggle=dock.querySelector('.dk-toggle');
    var cur=0, hovering=false, focused=false, timer=null, swapT=null;

    function setName(n){
      if(!nameEl||nameEl.textContent===n) return;
      nameEl.classList.add('swap'); clearTimeout(swapT);
      swapT=setTimeout(function(){ nameEl.textContent=n; nameEl.classList.remove('swap'); },150);
    }
    function spot(i){
      cur=i; items.forEach(function(it,k){ it.classList.toggle('is-on',k===i); });
      setName(items[i].getAttribute('data-name'));
    }
    function paused(){ return hovering||focused||dock.classList.contains('open')||document.hidden; }
    function tick(){ if(!paused()) spot((cur+1)%items.length); timer=setTimeout(tick,2200); }
    function start(){ if(reduce||timer) return; timer=setTimeout(tick,1300); }

    // entrance, once, when scrolled into view
    function enter(){ dock.classList.add('in'); spot(0); start(); }
    if('IntersectionObserver' in window && !reduce){
      var io=new IntersectionObserver(function(es){ if(es[0].isIntersecting){ io.disconnect(); enter(); } },{threshold:.5});
      io.observe(dock);
    } else { dock.classList.add('in'); }

    // dock-style magnification around the pointer
    function reset(){ items.forEach(function(it){ var a=it.firstChild; a.style.removeProperty('--lift'); a.style.removeProperty('--sc'); }); }
    if(canHover && !reduce){
      pill.addEventListener('pointermove',function(e){
        if(dock.classList.contains('open')) return;
        hovering=true; var best=0, bd=1e9;
        items.forEach(function(it,k){
          var r=it.getBoundingClientRect(), d=Math.abs(r.left+r.width/2-e.clientX);
          if(d<bd){ bd=d; best=k; }
          var m=Math.pow(Math.max(0,1-d/90),2), a=it.firstChild;
          a.style.setProperty('--lift',(m*10).toFixed(2)); a.style.setProperty('--sc',(1+m*.3).toFixed(3));
          it.style.zIndex=Math.round(m*10);
        });
        if(best!==cur) spot(best);
      });
      pill.addEventListener('pointerleave',function(){ hovering=false; reset(); items.forEach(function(it){ it.style.zIndex=''; }); });
    }
    // touch / click on an avatar spotlights it; keyboard focus does too
    items.forEach(function(it,k){
      it.addEventListener('pointerup',function(e){ if(e.pointerType!=='mouse') spot(k); });
      it.addEventListener('focus',function(){ focused=true; spot(k); });
      it.addEventListener('blur',function(){ focused=false; });
    });

    toggle.addEventListener('click',function(){
      var open=!dock.classList.contains('open');
      dock.classList.toggle('open',open); reset();
      toggle.setAttribute('aria-expanded',open?'true':'false');
      var k=open?'open':'closed'; toggle.querySelector('.dk-l').textContent=toggle.getAttribute('data-l-'+k); toggle.querySelector('.dk-s').textContent=toggle.getAttribute('data-s-'+k);
    });
    document.addEventListener('visibilitychange',function(){ if(!document.hidden&&!timer) start(); });
  });
})();`;

module.exports = { AGENT_DOCK_HTML, AGENT_DOCK_CSS, AGENT_DOCK_JS, AGENT_NAMES: AGENTS.map((a) => a.name) };
