/* Original art, drawn at runtime from paths, gradients, and deterministic marks. */
(function(root){
'use strict';
const TAU=Math.PI*2;
const forms={};
function hash(text){let h=2166136261;for(const char of text){h^=char.charCodeAt(0);h=Math.imul(h,16777619);}return h>>>0;}
function shade(hex,factor){const n=parseInt(hex.replace('#',''),16);return `rgb(${Math.min(255,Math.round((n>>16)*factor))},${Math.min(255,Math.round((n>>8&255)*factor))},${Math.min(255,Math.round((n&255)*factor))})`;}
function path(c,points,fill,stroke,width=2){c.beginPath();c.moveTo(...points[0]);for(let i=1;i<points.length;i++)c.lineTo(...points[i]);c.closePath();if(fill){c.fillStyle=fill;c.fill();}if(stroke){c.strokeStyle=stroke;c.lineWidth=width;c.stroke();}}
function line(c,x1,y1,x2,y2,color,width=2){c.beginPath();c.moveTo(x1,y1);c.lineTo(x2,y2);c.lineWidth=width;c.strokeStyle=color;c.stroke();}
function ellipse(c,x,y,rx,ry,color){c.beginPath();c.ellipse(x,y,rx,ry,0,0,TAU);c.fillStyle=color;c.fill();}
function curve(c,points,color,width){c.beginPath();c.moveTo(points[0],points[1]);c.bezierCurveTo(...points.slice(2));c.strokeStyle=color;c.lineWidth=width;c.lineCap='round';c.stroke();}
forms.round=(c)=>{c.moveTo(-76,4);c.bezierCurveTo(-81,-52,-2,-65,49,-23);c.bezierCurveTo(83,3,44,55,-14,47);c.bezierCurveTo(-53,47,-72,32,-76,4);};
forms.perch=(c)=>{c.moveTo(-85,5);c.bezierCurveTo(-72,-34,-18,-49,35,-26);c.lineTo(78,-7);c.lineTo(78,10);c.bezierCurveTo(18,50,-39,51,-76,22);c.lineTo(-85,5);};
forms.puff=(c)=>c.ellipse(-8,0,66,59,0,0,TAU);
forms.cat=(c)=>{c.moveTo(-88,0);c.bezierCurveTo(-73,-45,-5,-39,64,-9);c.lineTo(85,0);c.bezierCurveTo(36,38,-54,49,-88,14);c.closePath();};
forms.maw=(c)=>{c.moveTo(-82,-10);c.bezierCurveTo(-75,-58,23,-68,57,-17);c.bezierCurveTo(97,27,12,65,-51,48);c.bezierCurveTo(-85,39,-92,4,-82,-10);};
forms.angler=(c)=>{c.moveTo(-71,4);c.bezierCurveTo(-78,-46,13,-63,52,-26);c.bezierCurveTo(85,9,54,49,-9,47);c.bezierCurveTo(-55,44,-77,32,-71,4);};
forms.eel=(c)=>{c.moveTo(-100,-2);c.bezierCurveTo(-95,-39,-57,-35,-24,-9);c.bezierCurveTo(20,26,47,-27,84,-7);c.quadraticCurveTo(108,3,116,-18);c.bezierCurveTo(115,31,77,41,49,24);c.bezierCurveTo(16,7,-10,45,-48,27);c.bezierCurveTo(-70,29,-100,19,-100,-2);};
forms.ray=(c)=>{c.moveTo(-88,0);c.quadraticCurveTo(-42,-17,-9,-25);c.quadraticCurveTo(24,-94,66,-63);c.quadraticCurveTo(25,-8,53,0);c.quadraticCurveTo(22,14,68,66);c.quadraticCurveTo(17,83,-10,28);c.quadraticCurveTo(-67,27,-88,0);};
forms.shark=(c)=>{c.moveTo(-102,0);c.quadraticCurveTo(-59,-44,5,-29);c.lineTo(58,-8);c.lineTo(82,-7);c.lineTo(82,8);c.quadraticCurveTo(17,47,-54,27);c.quadraticCurveTo(-87,21,-102,0);};

function drawFish(c,fish,x,y,size,time=0,silhouette=false){
  const seed=hash(fish.id), accent=fish.accent, base=fish.base, shape=forms[fish.form]||forms.perch;
  c.save();c.translate(x,y);c.scale(size/245,size/245);c.rotate(Math.sin(time*1.4+seed%10)*.025);
  c.lineJoin='round';c.lineCap='round';
  if(silhouette){c.globalAlpha=.75;c.fillStyle='#29464b';c.beginPath();shape(c);c.fill();path(c,[[55,0],[105,-33],[94,7],[107,35]],'#29464b');ellipse(c,-42,-8,3,3,'#70918a');c.restore();return;}
  // Soft bioluminescent aura, generated from a radial gradient.
  const glow=c.createRadialGradient(0,0,8,0,0,130);glow.addColorStop(0,accent+'28');glow.addColorStop(1,accent+'00');c.fillStyle=glow;c.fillRect(-150,-140,300,280);
  c.save();c.translate(65,1);c.rotate(Math.sin(time*3+seed%5)*.07);path(c,[[0,0],[44,-32],[35,-1],[49,35],[2,13]],shade(base,.74),'#122f34',3);for(let i=0;i<4;i++)line(c,5,6,35+i*2,-23+i*18,accent+'50',1);c.restore();
  if(fish.form==='ray') curve(c,[35,0,90,-28,87,47,127,12],accent,4);
  else {
    path(c,[[-31,-24],[-6,-66-seed%15],[18,-30],[41,-23]],shade(base,1.1),'#163139',3);
    for(let i=0;i<3;i++)line(c,-17+i*13,-32,-6,-62-seed%15,accent+'80',1);
    path(c,[[0,27],[23,63],[33,29]],shade(base,.78),'#163139',2);
  }
  // Silhouette, shaded body, and surface markings share the exact same path.
  c.beginPath();shape(c);const body=c.createLinearGradient(0,-55,0,56);body.addColorStop(0,shade(base,1.3));body.addColorStop(.5,base);body.addColorStop(1,shade(base,.55));c.fillStyle=body;c.fill();c.strokeStyle='#102d34';c.lineWidth=3;c.stroke();
  c.save();c.beginPath();shape(c);c.clip();
  const random=root.MF.rng(seed);
  for(let i=0;i<32;i++){
    const px=-70+random()*135,py=-40+random()*84,r=1+random()*5;
    ellipse(c,px,py,r,r*.7,i%3?accent+'26':'#061d2c30');
  }
  if(fish.form==='perch'||fish.form==='shark')for(let i=0;i<5;i++)curve(c,[-6+i*18,-40,-19+i*18,-5,10+i*18,12,-2+i*18,47],shade(base,.68),5);
  if(fish.form==='puff')for(let i=0;i<12;i++){const a=i*TAU/12;ellipse(c,-8+Math.cos(a)*43,Math.sin(a)*35,3.5,4,accent+'aa');}
  if(['glassfin','noonmirage'].includes(fish.id)){for(let i=0;i<6;i++)path(c,[[-70+i*24,0],[-14+i*6,-53],[-14+i*6,58]],accent+'26');}
  c.restore();
  if(fish.form==='puff')for(let i=0;i<12;i++){const a=i*TAU/12,px=-8+Math.cos(a)*64,py=Math.sin(a)*56;path(c,[[px-5,py-3],[px+Math.cos(a)*14,py+Math.sin(a)*14],[px+4,py+4]],shade(base,1.25),'#23423c',1.3);}
  // Asymmetric little side fin.
  path(c,[[-1,5],[28,13+Math.sin(time*4)*3],[9,30]],shade(base,1.2),'#24463d',2);line(c,1,8,13,22,accent+'88',1);
  let head=fish.form==='eel'?-71:fish.form==='shark'?-66:fish.form==='cat'?-54:-43;
  const ey=fish.form==='maw'?-19:-12,eyeR=fish.form==='maw'?13:fish.form==='eel'?8:11;
  const eye=(ex,ey,r)=>{ellipse(c,ex,ey,r+3,r+3,shade(base,.48));ellipse(c,ex,ey,r,r,accent);ellipse(c,ex-2,ey+.4,r*.42,r*.69,'#112b31');ellipse(c,ex-4,ey-4,r*.2,r*.2,'#f3ffdc');};
  eye(head,ey,eyeR);
  if(seed%3===0||fish.rarity==='mythic')eye(head+25,ey-7,eyeR*.66);
  if(fish.form==='maw')eye(head+12,ey-22,6);
  // A grin full of tiny, mismatched teeth.
  const mx=head-14,my=11,mw=fish.form==='maw'?53:fish.form==='shark'?47:36;
  c.beginPath();c.moveTo(mx-12,my);c.quadraticCurveTo(mx+mw*.6,my+14,mx+mw,my-1);c.quadraticCurveTo(mx+mw*.5,my+34,mx-12,my);c.fillStyle='#12242d';c.fill();
  for(let i=0;i<5;i++){const tx=mx-3+i*mw/6;path(c,[[tx,my+6],[tx+4,my+14+(i%2)*3],[tx+7,my+7]],'#e1e3b5');}
  curve(c,[head+27,-14,head+37,-4,head+33,14,head+25,21],shade(base,.5),2);
  if(fish.form==='cat')for(let i=0;i<3;i++)curve(c,[head-22,8+i*4,head-60,4+i*14,head-47,40+i*10,head-69,20+i*12],accent+'aa',1.8);
  // ID-based horns and a few species-specific signatures.
  if(fish.form!=='ray'&&fish.form!=='eel'){
    const horns=fish.id==='radking'?5:fish.rarity==='mythic'?3:seed%3+1;
    for(let i=0;i<horns;i++){const hx=-46+i*18;path(c,[[hx,-33],[hx-6,-56-(i%2)*10],[hx+12,-39]],accent,'#28403b',1.7);}
  }
  if(fish.form==='angler'){
    curve(c,[-19,-34,-34,-109,-91,-94,-90,-56],shade(base,1.18),4);
    const pulse=8+Math.sin(time*3)*1.4,g=c.createRadialGradient(-90,-56,1,-90,-56,27);g.addColorStop(0,accent+'cc');g.addColorStop(1,accent+'00');c.fillStyle=g;c.fillRect(-121,-87,62,62);ellipse(c,-90,-56,pulse,pulse,accent);ellipse(c,-92,-58,3,3,'#fbffe0');
  }
  if(fish.id==='staticeel')for(let i=0;i<3;i++)path(c,[[-5+i*25,-14],[8+i*25,-3],[0+i*25,1],[13+i*25,16],[5+i*25,0],[15+i*25,-5]],accent+'dd');
  if(fish.id==='leviathanzero'){for(let i=0;i<5;i++)curve(c,[-7+i*16,-18,3+i*16,-8,3+i*16,15,-8+i*16,23],accent+'bb',2);}
  if(['witchlight','noonmirage','leviathanzero'].includes(fish.id))for(let i=0;i<8;i++){const a=i*2.4+time*.2,px=Math.cos(a)*(106+(i%3)*13),py=Math.sin(a)*77;path(c,[[px-3,py],[px,py-5],[px+3,py],[px,py+5]],accent+'99');}
  c.restore();
}

const baitForms={};
baitForms.worm=(c,b)=>{curve(c,[-32,10,-17,-40,15,40,31,-13],shade(b.color,.5),15);curve(c,[-32,10,-17,-40,15,40,31,-13],b.color,11);for(let i=0;i<7;i++){const x=-26+i*8,y=Math.sin(i*.9)*7;line(c,x,y-4,x+1,y+5,shade(b.color,.75),1.2);}ellipse(c,28,-10,1.6,1.6,'#402e2b');};
baitForms.grub=(c,b)=>{for(let i=0;i<6;i++)ellipse(c,-28+i*10,Math.sin(i*.7)*6,9,12,shade(b.color,1-i*.04));ellipse(c,-28,0,2,2,'#153b36');};
baitForms.slug=(c,b)=>{c.beginPath();c.moveTo(-35,12);c.quadraticCurveTo(-30,-23,-2,-10);c.quadraticCurveTo(25,-23,35,12);c.closePath();c.fillStyle=b.color;c.fill();curve(c,[15,-5,16,-28,24,-24,25,-25],b.color,3);curve(c,[27,-3,28,-24,35,-22,36,-24],b.color,3);ellipse(c,25,-26,3,3,'#eaffe3');ellipse(c,36,-25,3,3,'#eaffe3');for(let i=0;i<4;i++)ellipse(c,-21+i*12,3,3,3,'#6d983d');};
baitForms.meat=(c,b)=>{path(c,[[-32,-15],[-5,-24],[30,-14],[35,11],[8,25],[-30,13]],b.color,shade(b.color,.55),2);curve(c,[-23,-9,-3,11,17,-8,26,8],'#ffe0c6',4);ellipse(c,5,1,8,7,'#a94b5d');ellipse(c,5,1,4,3,'#f6d9ba');};
baitForms.bug=(c,b)=>{for(let i=0;i<3;i++){line(c,-5,-8+i*9,-30,-17+i*17,b.color,2);line(c,5,-8+i*9,30,-17+i*17,b.color,2);}ellipse(c,0,3,17,23,shade(b.color,.7));ellipse(c,0,4,13,21,b.color);line(c,0,-15,0,25,shade(b.color,.5),2);ellipse(c,0,-20,10,8,shade(b.color,.55));for(let i=0;i<4;i++)ellipse(c,(i%2?1:-1)*7,-6+Math.floor(i/2)*15,3,3,'#a04f33');};
baitForms.spinner=(c,b)=>{line(c,0,-30,0,24,'#e0cfb5',2);c.save();c.rotate(.5);ellipse(c,0,-4,12,24,b.color);ellipse(c,-3,-8,3,11,'#efecd1');c.restore();curve(c,[0,19,15,40,27,22,18,20],'#c7c7aa',2);};
baitForms.fly=(c,b)=>{ellipse(c,-15,-9,18,10,b.color+'aa');ellipse(c,15,-9,18,10,b.color+'aa');line(c,0,-22,0,23,'#cfa86a',5);for(let i=0;i<4;i++)line(c,0,-9+i*7,(i%2?1:-1)*16,12+i*4,b.color,1.5);ellipse(c,0,-22,5,5,b.color);};
function drawBait(c,bait,x,y,size=90){c.save();c.translate(x,y);c.scale(size/90,size/90);c.lineCap='round';(baitForms[bait.kind]||baitForms.worm)(c,bait);c.restore();}
const api={drawFish,drawBait,hash,shade,path,line,ellipse,curve,registerForm:(name,draw)=>forms[name]=draw,registerBaitForm:(name,draw)=>baitForms[name]=draw};
root.MFArt=api;if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof globalThis!=='undefined'?globalThis:this);
