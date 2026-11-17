(() => {
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const items=[
{id:0,name:"Orra",sub:"Amber glass dome",shape:"dome",glass:"#b98535",price:340,size:"18 × 38 cm",material:"Amber, mouth-blown",temp:"2200 K",length:"2 m, cut to length",desc:"A low dome of amber glass, blown thick at the rim so the light pools honey-gold under it.",dim:80,limited:false},
{id:1,name:"Moro",sub:"Smoked glass sphere",shape:"sphere",glass:"#747d7c",price:380,size:"22 × 32 cm",material:"Smoke, mouth-blown",temp:"2400 K",length:"2 m, cut to length",desc:"A softly mirrored sphere with a smoky finish, made to hold a warm and quiet glow.",dim:72},
{id:2,name:"Neri",sub:"Pale celadon drop",shape:"drop",glass:"#b6d0c8",price:360,size:"16 × 34 cm",material:"Celadon, mouth-blown",temp:"2700 K",length:"2 m, cut to length",desc:"A slim celadon drop with subtle irregularities that reveal the hand of its maker.",dim:68},
{id:3,name:"Vetro",sub:"Graphite globe",shape:"sphere",glass:"#646b6b",price:390,size:"22 × 32 cm",material:"Graphite, mouth-blown",temp:"2400 K",length:"2 m, cut to length",desc:"A dark glass globe that catches reflections by day and glows softly after dusk.",dim:65},
{id:4,name:"Nuvola",sub:"Opal glass shade",shape:"opal",glass:"#e9e6dd",price:410,size:"28 × 18 cm",material:"Opal, mouth-blown",temp:"2700 K",length:"2 m, cut to length",desc:"A cloud-like opal shade that diffuses light into a soft, even pool.",dim:75},
{id:5,name:"Goccia",sub:"Cognac teardrop",shape:"teardrop",glass:"#a65c20",price:620,size:"18 × 38 cm",material:"Cognac, mouth-blown",temp:"2200 K",length:"2 m, cut to length",desc:"A long drop of cognac glass that thins at the tip, so the light runs darker to brighter.",dim:80,limited:true},
{id:6,name:"Corallo",sub:"Coral glass cylinder",shape:"cylinder",glass:"#d78b82",price:300,size:"20 × 24 cm",material:"Coral, mouth-blown",temp:"2700 K",length:"2 m, cut to length",desc:"A short cylinder of coral-pink glass, open at the bottom: a rosy wash and a bright disc below.",dim:75,limited:false}
];
const state={selected:-1,detail:5,brightness:80,drag:null,ambient:false};
const code=`private tick = () => {
  const now = clockNow();
  const dt = Math.min(0.033, (now - this.last) / 1000);
  const g = G * this.scale;
  for (const b of this.bodies) {
    // the carriage springs to where the hand put it
    const a = (b.target - b.x) * SPRING_K - b.v * SPRING_C;
    b.v += a * dt;
    b.x += b.v * dt;
    // a pendulum on a moving pivot: the shade lags behind
    const alpha = -(g / b.len) * Math.sin(b.th)
      - DAMP * b.om - (a / b.len) * Math.cos(b.th);
    b.om += alpha * dt;
    b.th += b.om * dt;
  }
};`;
$("#code code").textContent=code;
function svgFor(p){let shape="";
switch(p.shape){
case"dome":shape=`<path class="glass" d="M8 31 Q8 8 35 8 Q62 8 62 31 L62 39 Q35 46 8 39Z"/><path class="rim" d="M8 37 Q35 44 62 37"/>`;break;
case"sphere":shape=`<circle class="glass" cx="35" cy="34" r="27"/><ellipse class="rim" cx="35" cy="34" rx="26" ry="27"/>`;break;
case"drop":shape=`<path class="glass" d="M25 7 Q25 20 17 30 Q7 45 16 59 Q22 67 35 67 Q48 67 54 59 Q63 45 53 30 Q45 20 45 7Z"/><path class="rim" d="M25 8 Q35 11 45 8"/>`;break;
case"opal":shape=`<path class="glass" d="M7 28 Q8 9 35 8 Q62 9 63 28 Q61 48 35 48 Q9 48 7 28Z"/><path class="rim" d="M7 28 Q35 35 63 28"/>`;break;
case"teardrop":shape=`<path class="glass" d="M35 4 C32 22 13 39 16 54 C18 68 52 68 54 54 C57 39 38 22 35 4Z"/><path class="rim" d="M32 7 Q35 10 38 7"/>`;break;
case"cylinder":shape=`<path class="glass" d="M13 8 Q13 3 20 3 H50 Q57 3 57 8 V56 Q57 65 35 65 Q13 65 13 56Z"/><path class="rim" d="M13 56 Q35 63 57 56 M20 4 H50"/>`;break;
}
return `<svg viewBox="0 0 70 75" role="img" aria-label="${p.sub}"><defs><radialGradient id="g${p.id}" cx="35%" cy="25%" r="70%"><stop stop-color="#fff" stop-opacity=".6"/><stop offset=".35" stop-color="${p.glass}" stop-opacity=".75"/><stop offset="1" stop-color="#161c1a" stop-opacity=".85"/></radialGradient><radialGradient id="glow${p.id}"><stop stop-color="#ffe3a1" stop-opacity=".9"/><stop offset="1" stop-color="#e6a14c" stop-opacity="0"/></radialGradient></defs><ellipse class="glow" cx="35" cy="40" rx="43" ry="40" fill="url(#glow${p.id})"/><rect class="cap" x="30" y="0" width="10" height="9" rx="1"/><g style="--glass:url(#g${p.id})">${shape.replaceAll('class="glass"','class="glass" fill="url(#g'+p.id+')"')}</g><path class="filament" d="M35 29 Q28 36 35 43 Q42 36 35 29"/></svg>`}
function renderPendants(){let host=$("#pendants");host.innerHTML=items.map((p,i)=>`<button class="pendant ${state.selected===i?"selected on":""}" data-id="${i}" style="--cord:${[70,90,72,90,78,92,68][i]}px;--lamp-w:${[55,48,36,48,56,37,39][i]}px;--lamp-h:${[42,49,55,49,34,65,57][i]}px;--glass:${p.glass}" aria-label="${p.name}, select pendant"><span class="cord"></span><span class="lamp">${svgFor(p)}</span><span class="beam"></span><span class="pendant-label">${p.name.toUpperCase()}</span></button>`).join("");
$$(".pendant").forEach(el=>{let id=+el.dataset.id;el.addEventListener("mouseenter",()=>light(id));el.addEventListener("focus",()=>light(id));el.addEventListener("click",()=>{light(id);state.detail=id;showDetail(id)})});
}
function light(id){state.selected=id;$$(".pendant").forEach((el,i)=>{el.classList.toggle("selected",i===id);el.classList.toggle("on",i===id)});let p=items[id];$("#caption").innerHTML=`<strong>${p.name}</strong> · ${p.sub} · €${p.price} <button class="caption-more" id="more">Explore shade ↗</button>`;$("#hint").textContent="Selected · tap to explore";$("#more").onclick=()=>showDetail(id)}
function showDetail(id){state.detail=id;let p=items[id];$("#detailProduct").innerHTML=`<div class="cord"></div><div class="lamp">${svgFor(p)}</div>`;$("#detailInfo").innerHTML=`<div class="detail-nav"><button id="prev">‹</button><span>${String(id+1).padStart(2,"0")} / 07</span><button id="next">›</button>${p.limited?'<span class="limited">Limited</span>':""}</div><h2>${p.name}</h2><div class="sub">${p.sub}</div><p>${p.desc}</p><div class="specs"><span>◉ ${p.size}</span><span>${p.material}</span><span>ET ${p.temp}</span><span>${p.length}</span></div><div class="dim-row"><div class="dim-top"><span>Dimmer</span><b id="dimValue">${state.brightness}%</b></div><input id="dimmer" type="range" min="5" max="100" value="${state.brightness}"></div><div class="detail-buy"><span class="price">◆ €${p.price}</span><button class="reserve" id="reserve">Reserve this shade</button></div>`;$("#detailBackdrop").classList.add("open");$("#detailBackdrop").dataset.active=id;$("#prev").onclick=()=>showDetail((state.detail+6)%7);$("#next").onclick=()=>showDetail((state.detail+1)%7);$("#dimmer").oninput=e=>{state.brightness=+e.target.value;$("#dimValue").textContent=state.brightness+"%";let l=$("#detailProduct .lamp");l.style.filter=`drop-shadow(0 0 ${8+state.brightness/4}px rgba(230,151,63,${state.brightness/180})) drop-shadow(0 0 ${15+state.brightness/2}px rgba(230,151,63,${state.brightness/220}))`};$("#reserve").onclick=()=>{toast(`${p.name} added to your enquiry`);$("#detailBackdrop").classList.remove("open")}}
function toast(s){let t=$("#toast");t.textContent=s;t.classList.add("show");clearTimeout(window.__toast);window.__toast=setTimeout(()=>t.classList.remove("show"),1800)}
$("#closeDetail").onclick=()=>$("#detailBackdrop").classList.remove("open");$("#detailBackdrop").onclick=e=>{if(e.target.id==="detailBackdrop")e.currentTarget.classList.remove("open")};
$("#shop").onclick=()=>showDetail(0);
$("#theme").onclick=()=>{$("#showcase").classList.toggle("warm");state.ambient=!state.ambient;toast(state.ambient?"Warm ambient mode":"Cool ambient mode")};
renderPendants();light(0);
// Small spring-and-pendulum motion, inspired by the visible src/rail.ts excerpt.
const bodies=$$(".pendant").map((el,i)=>({el,x:0,v:0,target:0,th:0,om:0,len:70+i*2}));
let last=performance.now(),raf;
function tick(){const now=performance.now();const dt=Math.min(.033,(now-last)/1000);last=now;const g=9.81;for(const b of bodies){const a=(b.target-b.x)*19-b.v*7.2;b.v+=a*dt;b.x+=b.v*dt;const alpha=-(g/b.len)*Math.sin(b.th)-1.15*b.om-(a/b.len)*Math.cos(b.th);b.om+=alpha*dt;b.th+=b.om*dt;b.el.style.setProperty("--x",`${b.x.toFixed(2)}px`);b.el.style.rotate=`${(b.th*180/Math.PI).toFixed(2)}deg`}raf=requestAnimationFrame(tick)}tick();
let dragging=null,startX=0,baseX=0;
$("#pendants").addEventListener("pointerdown",e=>{let el=e.target.closest(".pendant");if(!el)return;dragging=+el.dataset.id;startX=e.clientX;baseX=bodies[dragging].target;el.setPointerCapture?.(e.pointerId)});
$("#pendants").addEventListener("pointermove",e=>{if(dragging===null)return;let b=bodies[dragging];b.target=Math.max(-55,Math.min(55,baseX+e.clientX-startX))});
$("#pendants").addEventListener("pointerup",()=>{dragging=null});
$("#pendants").addEventListener("pointercancel",()=>{dragging=null});
document.addEventListener("keydown",e=>{if(e.key==="Escape")$("#detailBackdrop").classList.remove("open");if(e.key==="ArrowRight"&&$("#detailBackdrop").classList.contains("open"))showDetail((state.detail+1)%7);if(e.key==="ArrowLeft"&&$("#detailBackdrop").classList.contains("open"))showDetail((state.detail+6)%7)});
})();