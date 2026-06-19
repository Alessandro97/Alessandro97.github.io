const prefersReduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const isMobile = matchMedia('(max-width: 768px)').matches;
const DPR = Math.min(devicePixelRatio || 1, 2);

const c=document.getElementById('hero-bg'),x=c.getContext('2d');
function rs(){c.width=innerWidth*DPR;c.height=innerHeight*DPR;x.setTransform(DPR,0,0,DPR,0,0);}
rs();addEventListener('resize',rs);
const w=()=>innerWidth,h=()=>innerHeight;

// brighter starfield
const stars=Array.from({length:isMobile?70:150},()=>({x:Math.random(),y:Math.random(),s:Math.random()*1.6+.3,tw:Math.random()*6.28}));

const gAngles=[-2.02,-1.72,-1.42,-1.12];

// slower, layered satellites
const sats=[
  {layer:.30,ang:-2.1,sp:.0008,phase:0},
  {layer:.30,ang:-1.2,sp:.0008,phase:.5},
  {layer:.47,ang:-1.9,sp:.0006,phase:.2},
  {layer:.47,ang:-1.0,sp:.0006,phase:.7},
  {layer:.64,ang:-1.55,sp:.00045,phase:.4},
];
sats.length = isMobile ? 3 : sats.length;

// bigger satellite
function drawSat(px,py,ang){
  x.save();x.translate(px,py);x.scale(1.7,1.7);
  x.fillStyle='rgba(180,160,255,.95)';
  x.fillRect(-15,-3,9,6);x.fillRect(6,-3,9,6);
  x.strokeStyle='rgba(255,255,255,.55)';x.lineWidth=.6;
  x.strokeRect(-15,-3,9,6);x.strokeRect(6,-3,9,6);
  // panel cross lines
  x.beginPath();x.moveTo(-10.5,-3);x.lineTo(-10.5,3);x.moveTo(10.5,-3);x.lineTo(10.5,3);x.stroke();
  x.fillStyle='#fff';x.shadowBlur=16;x.shadowColor='#ffd0d0';x.fillRect(-3.5,-3.5,7,7);x.shadowBlur=0;
  x.fillStyle='#ff6b6b';x.fillRect(-2,-2,4,4);
  // dish
  x.beginPath();x.arc(0,4,2.4,0,Math.PI*2);x.fillStyle='rgba(255,255,255,.8)';x.fill();
  x.restore();
}

let t=0,rings=[];
function frame(){
  t++;const Wd=w(),Hd=h();x.clearRect(0,0,Wd,Hd);

  stars.forEach(s=>{const a=.4+Math.abs(Math.sin(t*.02+s.tw))*.6;x.globalAlpha=a;x.fillStyle='#fff';x.beginPath();x.arc(s.x*Wd,s.y*Hd*.8,s.s,0,6.28);x.fill();});
  x.globalAlpha=1;

  const cx=Wd*.5, R=Hd*1.45, cy=Hd*.82+R;   // bigger earth

  // base
  const grd=x.createRadialGradient(cx,cy-R*1.0,R*.05,cx,cy,R);
  grd.addColorStop(0,'rgba(120,40,55,.98)');grd.addColorStop(.55,'rgba(70,22,38,.97)');grd.addColorStop(1,'rgba(28,10,20,.98)');
  x.beginPath();x.arc(cx,cy,R,0,6.28);x.fillStyle=grd;x.fill();

  // detailed globe: clip then draw grid + continents
  x.save();x.beginPath();x.arc(cx,cy,R,0,6.28);x.clip();
  // parallels (horizontal ellipses)
  x.strokeStyle='rgba(255,150,160,.16)';x.lineWidth=1;
  for(let i=1;i<=6;i++){x.beginPath();x.ellipse(cx,cy,R,R*(i/7),0,0,Math.PI*2);x.stroke();}
  // meridians (vertical ellipses)
  for(let i=-3;i<=3;i++){x.beginPath();x.ellipse(cx,cy,R*Math.abs(i/4)||1,R,0,0,Math.PI*2);x.stroke();}
  // continents (warm landmasses near visible cap)
  x.fillStyle='rgba(255,130,110,.20)';
  const blobs=[[-.22,-.93,.16,.07],[.05,-.97,.12,.05],[.30,-.90,.14,.06],[-.40,-.86,.10,.05],[.50,-.95,.09,.04]];
  blobs.forEach(([bx,by,rw,rh])=>{x.beginPath();x.ellipse(cx+bx*R,cy+by*R,rw*R,rh*R,Math.random()*0,0,6.28);x.fill();});
  // city lights along surface
  x.fillStyle='rgba(255,220,150,.8)';
  for(let i=0;i<26;i++){const a=-2.2+ (i/26)*1.3;x.beginPath();x.arc(cx+R*Math.cos(a),cy+R*Math.sin(a),.9,0,6.28);x.fill();}
  x.restore();

  // bright atmosphere limb
  x.beginPath();x.arc(cx,cy,R,0,6.28);x.strokeStyle='rgba(255,150,150,.75)';x.lineWidth=2.5;x.stroke();
  x.beginPath();x.arc(cx,cy,R+7,0,6.28);x.strokeStyle='rgba(180,160,255,.30)';x.lineWidth=14;x.stroke();

  // ground stations
  const gs=gAngles.map(a=>({x:cx+R*Math.cos(a),y:cy+R*Math.sin(a),a}));
  gs.forEach(g=>{x.beginPath();x.moveTo(g.x,g.y);x.lineTo(g.x,g.y-14);x.strokeStyle='rgba(255,170,170,.85)';x.lineWidth=2;x.stroke();
    x.beginPath();x.arc(g.x,g.y-15,2.4,0,6.28);x.fillStyle='#ff8a8a';x.shadowBlur=8;x.shadowColor='#ff6b6b';x.fill();x.shadowBlur=0;});

  // satellites
  const satPos=sats.map(s=>{s.ang+=s.sp;if(s.ang>-0.55)s.ang=-2.35;const Ro=R+Hd*s.layer;return{x:cx+Ro*Math.cos(s.ang),y:cy+Ro*Math.sin(s.ang),s};});

  [...new Set(sats.map(s=>s.layer))].forEach(L=>{const Ro=R+Hd*L;x.beginPath();x.ellipse(cx,cy,Ro,Ro,0,Math.PI*1.16,Math.PI*1.84);x.strokeStyle='rgba(180,160,255,.14)';x.lineWidth=1;x.stroke();});

  // inter-satellite links (brighter)
  for(let i=0;i<satPos.length;i++)for(let j=i+1;j<satPos.length;j++){const d=Math.hypot(satPos[i].x-satPos[j].x,satPos[i].y-satPos[j].y);
    if(d<Hd*.36){x.beginPath();x.moveTo(satPos[i].x,satPos[i].y);x.lineTo(satPos[j].x,satPos[j].y);x.strokeStyle='rgba(180,160,255,'+(.42*(1-d/(Hd*.36)))+')';x.lineWidth=1.6;x.stroke();
      const tt=(t*.008+i+j)%1,px=satPos[i].x+(satPos[j].x-satPos[i].x)*tt,py=satPos[i].y+(satPos[j].y-satPos[i].y)*tt;
      x.beginPath();x.arc(px,py,2.4,0,6.28);x.fillStyle='#d6c8ff';x.shadowBlur=6;x.shadowColor='#a78bfa';x.fill();x.shadowBlur=0;}}

  // wider, brighter downlink beams
  satPos.forEach((p,i)=>{let best=null,bd=1e9;gs.forEach(g=>{const d=Math.hypot(p.x-g.x,p.y-g.y);if(d<bd){bd=d;best=g;}});
    if(best&&bd<Hd*.95){
      // beam cone (wide translucent) + core line
      const ang=Math.atan2(best.y-13-p.y,best.x-p.x),spread=10;
      x.beginPath();x.moveTo(p.x,p.y);
      x.lineTo(best.x+Math.cos(ang+Math.PI/2)*spread,(best.y-13)+Math.sin(ang+Math.PI/2)*spread);
      x.lineTo(best.x+Math.cos(ang-Math.PI/2)*spread,(best.y-13)+Math.sin(ang-Math.PI/2)*spread);
      x.closePath();
      const cg=x.createLinearGradient(p.x,p.y,best.x,best.y);cg.addColorStop(0,'rgba(255,80,84,.30)');cg.addColorStop(1,'rgba(255,80,84,.02)');
      x.fillStyle=cg;x.fill();
      const lg=x.createLinearGradient(p.x,p.y,best.x,best.y);lg.addColorStop(0,'rgba(255,90,94,.95)');lg.addColorStop(1,'rgba(255,90,94,.15)');
      x.beginPath();x.moveTo(p.x,p.y);x.lineTo(best.x,best.y-13);x.strokeStyle=lg;x.lineWidth=3.5;x.stroke();
      for(let k=0;k<3;k++){const tt=((t*.011)+k*.33+i*.2)%1;const dx=p.x+(best.x-p.x)*tt,dy=p.y+(best.y-13-p.y)*tt;
        x.beginPath();x.arc(dx,dy,2.6,0,6.28);x.fillStyle='#ffd0d0';x.shadowBlur=10;x.shadowColor='#ff3b3f';x.fill();x.shadowBlur=0;}
      if(t%80===i*14)rings.push({x:best.x,y:best.y-13,r:0});
    }
    drawSat(p.x,p.y);
  });

  rings=rings.filter(r=>{r.r+=.9;const o=Math.max(0,1-r.r/85);x.beginPath();x.arc(r.x,r.y,r.r,Math.PI,0);x.strokeStyle='rgba(255,120,120,'+(o*.7)+')';x.lineWidth=1.6;x.stroke();return o>0;});

  if(running && !prefersReduced) requestAnimationFrame(frame);
}

const words=["Non-Terrestrial Networks","Integrated Access & Backhaul","UAV & HAP Edge Computing","6G Connectivity","Satellite IoT","MIMO Beamforming"];
let wi=0;const el=document.getElementById('rot');el.style.transition='opacity .25s';
setInterval(()=>{wi=(wi+1)%words.length;el.style.opacity=0;setTimeout(()=>{el.textContent=words[wi];el.style.opacity=1;},250);},2400);

let running = true;
document.addEventListener('visibilitychange', ()=>{ running = !document.hidden; if(running && !prefersReduced) requestAnimationFrame(frame); });
function start(){ if(prefersReduced){ frame(); return; } requestAnimationFrame(frame); }
start();

// mobile menu toggle
const navToggle=document.querySelector('.nav-toggle'),navLinks=document.querySelector('.nav-links');
navToggle.addEventListener('click',()=>{const open=navLinks.classList.toggle('open');navToggle.setAttribute('aria-expanded',open);});
navLinks.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{navLinks.classList.remove('open');navToggle.setAttribute('aria-expanded',false);}));
// active section highlight
const navMap=[...document.querySelectorAll('.nav-links a[href^="#"]')];
const obs=new IntersectionObserver(es=>{es.forEach(e=>{if(e.isIntersecting){const id=e.target.id;
  navMap.forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+id));}});},{rootMargin:'-45% 0px -50% 0px'});
['hero','research','publications','education','contact'].forEach(id=>{const el=document.getElementById(id);if(el)obs.observe(el);});
const revObs=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');revObs.unobserve(e.target);}}),{threshold:.15});
document.querySelectorAll('.reveal').forEach(el=>revObs.observe(el));
document.getElementById('year').textContent=new Date().getFullYear();
