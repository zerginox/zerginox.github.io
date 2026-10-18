/* Runtime lake renderer. Register a new event effect without changing the fishing rules. */
(function(root){
'use strict';
const {ellipse,line,path,curve}=root.MFArt,TAU=Math.PI*2,effects={};
const palettes={night:['#071822','#213a45','#153842','#0a2934','#061a26'],dawn:['#273446','#ac8184','#476b72','#1b4751','#102d3d'],day:['#12343c','#779995','#34636a','#174b55','#092d3c'],dusk:['#293745','#9e7474','#3b5862','#214652','#102c3c']};
const stars=Array.from({length:70},(_,i)=>{const r=root.MF.rng(i*37+80);return{x:r(),y:r()*.39,size:r()*.9+.3,phase:r()*TAU};});
function phase(date){const h=date.getHours()+date.getMinutes()/60;return h>=19||h<5?'night':h<7?'dawn':h<17?'day':h<19?'dusk':'night';}
function bg(c,w,h,t,date){
  const p=palettes[phase(date)],horizon=h*.397;
  let g=c.createLinearGradient(0,0,0,horizon);g.addColorStop(0,p[0]);g.addColorStop(1,p[1]);c.fillStyle=g;c.fillRect(0,0,w,horizon+2);
  if(phase(date)==='night'){
    for(const s of stars){c.globalAlpha=.25+(.5+.5*Math.sin(t*.5+s.phase))*.5;ellipse(c,s.x*w,s.y*h,s.size,s.size,'#d5e9d5');}c.globalAlpha=1;
  }
  const sun=phase(date)==='day'||phase(date)==='dawn';
  const mx=w*.73,my=h*.28;
  g=c.createRadialGradient(mx,my,1,mx,my,w*.22);g.addColorStop(0,sun?'#e6e9bd26':'#cce3d21a');g.addColorStop(1,'#cce3d200');c.fillStyle=g;c.fillRect(mx-w*.24,my-w*.24,w*.48,w*.48);
  ellipse(c,mx,my,sun?17:19,sun?17:19,sun?'#e7dfb7':'#cfdfd1');
  if(!sun){ellipse(c,mx+7,my-7,18,18,p[0]);ellipse(c,mx-8,my+3,3,3,'#a7c3b71a');}
  // Distant layered hills.
  for(let layer=0;layer<3;layer++){
    c.beginPath();c.moveTo(0,horizon+8);for(let x=0;x<=w+12;x+=12){const y=horizon-14-layer*8-Math.sin(x/w*5+layer*2)*17-Math.cos(x/w*11+layer)*8;c.lineTo(x,y);}c.lineTo(w,horizon+12);c.closePath();c.fillStyle=[p[2]+'77','#1c3d45','#15323b'][layer];c.fill();
  }
  // Jagged pine skyline. Every tree comes from a stable seed.
  for(let i=0;i<64;i++){
    const r=root.MF.rng(i*39+41),x=i/63*w,y=horizon-1,th=13+r()*27,tw=4+r()*5;
    path(c,[[x,y-th],[x-tw*.7,y-th*.52],[x-tw*.3,y-th*.52],[x-tw,y-th*.17],[x+tw,y-th*.17],[x+tw*.3,y-th*.52],[x+tw*.7,y-th*.52]],'#0e2e36');line(c,x,y-th,x,y+3,'#0e2e36',2);
  }
  g=c.createLinearGradient(0,horizon,0,h);g.addColorStop(0,p[3]);g.addColorStop(1,p[4]);c.fillStyle=g;c.fillRect(0,horizon,w,h-horizon);
  // Reflection, broken by moving ripples.
  for(let i=0;i<22;i++){
    const y=horizon+9+i*7,spread=7+i*1.6,x=mx+Math.sin(i*5+t*.8)*(3+i*.3);
    c.globalAlpha=(1-i/23)*.09;line(c,x-spread,y,x+spread,y,sun?'#f0e0a1':'#ceeed3',1+i*.07);
  }c.globalAlpha=1;
  // Perspective wavelets.
  for(let i=0;i<78;i++){
    const r=root.MF.rng(i*911+7),depth=r(),y=horizon+depth*(h*.79-horizon),x=(r()*w+t*(1+depth*3))%(w+60)-30,len=4+depth*26+r()*14;
    c.globalAlpha=.03+depth*.055;curve(c,[x,y,x+len*.3,y-1.7,x+len*.7,y+1.3,x+len,y],'#d5ece0',.6+depth*.6);
  }c.globalAlpha=1;
  // A pair of drifting banks of mist.
  for(let i=0;i<3;i++){const y=horizon+12+i*32,x=w*(.25+i*.3)+Math.sin(t*.07+i)*30;g=c.createRadialGradient(x,y,2,x,y,w*.45);g.addColorStop(0,'#aec9ba0a');g.addColorStop(1,'#aec9ba00');c.save();c.translate(x,y);c.scale(1,.13);c.fillStyle=g;c.setTransform(c.getTransform());c.restore();c.fillStyle=g;c.fillRect(0,y-12,w,35);}
}
function ripple(c,x,y,t,color='#c1e3ce',strength=1){for(let i=0;i<3;i++){const f=((t*.6+i/3)%1);c.globalAlpha=(1-f)*.32*strength;c.beginPath();c.ellipse(x,y,8+f*37,2+f*9,0,0,TAU);c.strokeStyle=color;c.lineWidth=.8;c.stroke();}c.globalAlpha=1;}
effects.toxic=(c,w,h,t)=>{
  const x=w*.25,y=h*.49,g=c.createRadialGradient(x,y,2,x,y,w*.47);g.addColorStop(0,'#b8f54d24');g.addColorStop(.45,'#94d74b17');g.addColorStop(1,'#94d74b00');c.save();c.translate(0,y);c.scale(1,.4);c.fillStyle=g;c.restore();c.fillStyle=g;c.fillRect(0,h*.4,w,h*.35);
  for(let i=0;i<18;i++){const r=root.MF.rng(i*73+49),bx=r()*w*.65,by=h*.43+r()*h*.17-Math.sin(t*.4+i)*3;ellipse(c,bx,by,2+r()*3,1+r(),i%2?'#c4f66a60':'#79a83160');if(i%4===0)ripple(c,bx,by,t+i,'#b1ef6c',.5);}
  // Half-submerged barrel and visible runoff pipe on the bank.
  c.save();c.translate(w*.09,h*.44);c.rotate(.2);c.fillStyle='#526448';c.fillRect(-8,-14,16,23);line(c,-8,-10,8,-10,'#8d9e59',2);line(c,-8,4,8,4,'#8d9e59',2);ellipse(c,0,-2,5,5,'#bfd660');path(c,[[0,-7],[-4,-1],[4,-1]],'#394f36');c.restore();
};
effects.fire=(c,w,h,t)=>{
  const g=c.createRadialGradient(w*.3,h*.46,2,w*.3,h*.46,w*.55);g.addColorStop(0,'#ff8c4523');g.addColorStop(1,'#ff8c4500');c.fillStyle=g;c.fillRect(0,h*.3,w,h*.4);
  for(let i=0;i<24;i++){const r=root.MF.rng(i*71+14),x=w*.07+r()*w*.66,y=h*.43+r()*h*.08,fh=13+r()*18+Math.sin(t*5+i)*5;path(c,[[x-7,y],[x-8,y-fh*.4],[x,y-fh],[x+2,y-fh*.4],[x+7,y]],i%2?'#fbb064aa':'#f5784ba9');path(c,[[x-3,y],[x,y-fh*.63],[x+4,y]],'#ffe2a6bb');c.globalAlpha=.13;line(c,x-4,y+9,x+6,y+20+Math.sin(t*3+i)*5,'#ffa55e',3);c.globalAlpha=1;}
  for(let i=0;i<13;i++){const r=root.MF.rng(i*97),a=(t*.08+r())%1;ellipse(c,w*.12+r()*w*.6+a*20,h*.44-a*h*.14,8+a*16,13+a*20,`rgba(31,36,37,${(1-a)*.18})`);}
};
effects.storm=(c,w,h,t)=>{
  for(let i=0;i<65;i++){const r=root.MF.rng(i*77+5),x=(r()*w-t*45)%(w+40),y=(r()*h+t*350)%(h*.8);line(c,x,y,x-5,y+14,'#b1c5d828',.7);}
  if(Math.sin(t*.7)> .992){path(c,[[w*.27,h*.25],[w*.24,h*.3],[w*.28,h*.3],[w*.23,h*.38]],null,'#d6deff',2);c.fillStyle='#bbc9ff0a';c.fillRect(0,0,w,h);}
};
effects.bloom=(c,w,h,t)=>{
  for(let i=0;i<50;i++){const r=root.MF.rng(i*339+12),x=r()*w+Math.sin(t*.12+i)*6,y=h*.42+r()*h*.23;ellipse(c,x,y,8+r()*24,1.5+r()*3,i%2?'#63b28118':'#88c59c18');}
};
function dock(c,w,h,t){
  const y=h*.815;
  path(c,[[w*.73,y],[w*.99,y-4],[w*1.22,h],[w*.58,h]],'#332f2c','#1a292c',2);
  for(let i=0;i<8;i++){const yy=y+i*(h-y)/7;line(c,w*.7-(i/7)*w*.12,yy,w*1.13,yy,'#1d2427',2);line(c,w*.71-i*2,yy+3,w,yy+3,'#74604b24',1);}
  for(let i=0;i<9;i++){const r=root.MF.rng(i*33+8),x=w*(.73+r()*.3),yy=y+r()*(h-y);line(c,x,yy,x+r()*30+10,yy+1,'#9b79582c',.7);}
  // Reeds framing the foreground without covering the bait controls.
  for(let i=0;i<11;i++){const x=-10+i*5,y0=h*.8+i*3,top=y0-22-(i%4)*16;curve(c,[x,y0,x+8,top+15,x+12,top+12,x+10,top],'#173c3c',2);if(i%2===0)ellipse(c,x+10,top+4,2,6,'#32483e');}
}
function fishing(c,w,h,t,engine,pointer,bait){
  const baseX=w*.89,baseY=h*.92;
  let tipX=w*.48,tipY=h*.57;
  const active=['waiting','bite','reeling','casting'].includes(engine.state);
  const bend=engine.state==='bite'?Math.sin(t*30)*5:active?3:Math.sin(t*.8)*2;
  if(pointer?.dragging){tipX+=pointer.power*20;tipY+=pointer.power*40;}
  curve(c,[baseX+4,baseY+4,baseX-25,h*.76,tipX+65,h*.65,tipX,tipY+bend],'#071b22',8);
  const rod=c.createLinearGradient(tipX,tipY,baseX,baseY);rod.addColorStop(0,'#bbbd96');rod.addColorStop(.5,'#75877b');rod.addColorStop(1,'#485c55');curve(c,[baseX,baseY,baseX-25,h*.76,tipX+65,h*.65,tipX,tipY+bend],rod,3);
  curve(c,[baseX,baseY,baseX-8,baseY-15,baseX-15,baseY-32,baseX-20,baseY-44],'#ac8863',10);
  for(let i=0;i<8;i++)line(c,baseX-3-i*2.4,baseY-i*5.5,baseX+4-i*2.4,baseY-3-i*5.5,'#584c3b',1);
  ellipse(c,baseX-26,baseY-35,11,13,'#8a9580');ellipse(c,baseX-26,baseY-35,7,8,'#30494a');ellipse(c,baseX-26,baseY-35,4,5,'#b8b692');line(c,baseX-30,baseY-31,baseX-39,baseY-22,'#b1b89b',2);ellipse(c,baseX-40,baseY-21,3,3,'#778b76');
  for(let i=1;i<5;i++){const f=i/5,u=1-f,x=u*u*u*baseX+3*u*u*f*(baseX-25)+3*u*f*f*(tipX+65)+f*f*f*tipX,y=u*u*u*baseY+3*u*u*f*h*.76+3*u*f*f*h*.65+f*f*f*(tipY+bend);c.beginPath();c.ellipse(x-2,y+1,2,3,-.5,0,TAU);c.strokeStyle='#d2d4b088';c.lineWidth=1;c.stroke();}
  let bx=tipX-7,by=tipY+57;
  if(active){
    bx=engine.targetX*w;by=h*(.61-engine.power*.115);
    if(engine.state==='casting'){const f=Math.min(1,(performance.now()-engine.since)/680);bx=tipX+(bx-tipX)*f;by=tipY+(by-tipY)*f-Math.sin(f*Math.PI)*h*.14;}
    else if(engine.state==='reeling'){const f=Math.min(1,(performance.now()-engine.since)/1100);bx+=(baseX-bx)*f;by+=(baseY-by)*f;}
    by+=Math.sin(t*(engine.state==='bite'?20:2.5))* (engine.state==='bite'?5:1.5);
    if(engine.state!=='casting'&&engine.state!=='reeling')ripple(c,bx,by+5,t,engine.state==='bite'?'#e4ffc5':'#c1e3ce',engine.state==='bite'?2:1);
  }
  curve(c,[tipX,tipY+bend,tipX-12,tipY+33,bx-5,by-17,bx,by],'#dce7c178',.7);
  // The bobber, with a bait-colored band.
  if(engine.state!=='reeling'||performance.now()-engine.since<700){line(c,bx,by-8,bx,by+6,'#a4b4a2',1);ellipse(c,bx,by,3.4,5.2,'#e5dfbc');c.save();c.beginPath();c.ellipse(bx,by,3.4,5.2,0,0,TAU);c.clip();c.fillStyle=bait.color;c.fillRect(bx-5,by,10,6);c.restore();}
  if(engine.state==='bite'){const elapsed=performance.now()-engine.since;const f=1-elapsed/3600;c.beginPath();c.arc(bx,by-30,9,-Math.PI/2,-Math.PI/2+TAU*Math.max(0,f));c.lineWidth=2;c.strokeStyle='#d5f8ad';c.stroke();}
  if(engine.state==='reeling'&&engine.catch){const f=Math.min(1,(performance.now()-engine.since)/1100);root.MFArt.drawFish(c,engine.catch.fish,bx,by-Math.sin(f*Math.PI)*70,30+f*50,t);}
}
function render(c,w,h,t,date,event,engine,pointer,bait){
  c.clearRect(0,0,w,h);bg(c,w,h,t,date);
  if(effects[event.type])effects[event.type](c,w,h,t);
  // Foreground vignette keeps the fishing interface legible.
  const vignette=c.createLinearGradient(0,h*.56,0,h);vignette.addColorStop(0,'#071a2200');vignette.addColorStop(.48,'#071a2240');vignette.addColorStop(1,'#071a22f5');c.fillStyle=vignette;c.fillRect(0,h*.56,w,h*.44);
  dock(c,w,h,t);fishing(c,w,h,t,engine,pointer,bait);
}
root.MFScene={render,phase,registerEffect:(id,draw)=>effects[id]=draw};
})(typeof globalThis!=='undefined'?globalThis:this);
