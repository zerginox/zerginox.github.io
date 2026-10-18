(function(){
'use strict';
const {FISH,BAITS,RARITIES,EVENTS,lakeEvent,available,eligible,requirement,FishingEngine,recordCatch}=MF;
const $=id=>document.getElementById(id),canvas=$('lake'),ctx=canvas.getContext('2d',{alpha:false});
const STORAGE='monster-fish.save.v1';
let storageAvailable=true;
function freshSeed(){const a=new Uint32Array(1);if(window.crypto?.getRandomValues)crypto.getRandomValues(a);else a[0]=Math.random()*4294967296;return a[0];}
function load(){
  let saved;
  try{saved=JSON.parse(localStorage.getItem(STORAGE)||'null');}catch(e){saved=null;}
  const value={version:1,seed:Number.isInteger(saved?.seed)?saved.seed:freshSeed(),bait:BAITS.some(b=>b.id===saved?.bait)?saved.bait:'worm',records:{},sound:saved?.sound===true};
  if(saved?.records&&typeof saved.records==='object')for(const [id,record] of Object.entries(saved.records)){
    if(record&&Number.isInteger(record.count)&&record.count>0&&Number.isFinite(record.best)&&record.best>0)value.records[id]={count:record.count,best:record.best,first:record.first,last:record.last};
  }
  return value;
}
let save=load();
function persist(){try{localStorage.setItem(STORAGE,JSON.stringify(save));storageAvailable=true;}catch(e){storageAvailable=false;}}
persist();
const engine=new FishingEngine(save.seed),pointer={dragging:false,power:0};
let width=0,height=0,pixelRatio=1,filter='all',currentDetail=null,detailReturns=false,catchIsNew=false,catchIsRecord=false;
let lastStatus='',lastSecond='',lastEvent='',lastJournalKey='',lastFrame=0,audio=null,toastTimeout;
const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
function resize(){width=canvas.clientWidth;height=canvas.clientHeight;pixelRatio=Math.min(window.devicePixelRatio||1,2);canvas.width=Math.round(width*pixelRatio);canvas.height=Math.round(height*pixelRatio);ctx.setTransform(pixelRatio,0,0,pixelRatio,0,0);}
window.addEventListener('resize',resize);resize();
const bait=()=>BAITS.find(b=>b.id===save.bait)||BAITS[0];
function toast(message){$('toast').textContent=message;$('toast').classList.add('visible');clearTimeout(toastTimeout);toastTimeout=setTimeout(()=>$('toast').classList.remove('visible'),3000);}
function sound(kind){
  if(!save.sound)return;
  try{
    const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;if(!audio)audio=new AC();audio.resume();
    const now=audio.currentTime,notes=kind==='catch'?[330,440,660]:kind==='bite'?[660,880]:[180];
    notes.forEach((freq,i)=>{const o=audio.createOscillator(),g=audio.createGain();o.type='sine';o.frequency.setValueAtTime(freq,now+i*.1);o.frequency.exponentialRampToValueAtTime(freq*.7,now+i*.1+.2);g.gain.setValueAtTime(0,now+i*.1);g.gain.linearRampToValueAtTime(.09,now+i*.1+.015);g.gain.exponentialRampToValueAtTime(.001,now+i*.1+.3);o.connect(g);g.connect(audio.destination);o.start(now+i*.1);o.stop(now+i*.1+.32);});
  }catch(e){/* Sound is optional; gameplay remains available. */}
}
function haptic(){try{if(navigator.vibrate)navigator.vibrate([35,40,55]);}catch(e){}}
function anyDialog(){return [...document.querySelectorAll('dialog')].some(d=>d.open);}
function totals(){const known=FISH.filter(f=>save.records[f.id]);return {unique:known.length,total:known.reduce((sum,f)=>sum+save.records[f.id].count,0)};}
function updateCounts(){const count=totals();$('journalCount').textContent=`${count.unique}/${FISH.length}`;$('totalCount').textContent=`${count.total} ${count.total===1?'catch':'catches'}`;$('collectionSummary').textContent=`${count.unique} of ${FISH.length} discovered`;$('collectionProgress').style.width=`${count.unique/FISH.length*100}%`;$('recordSummary').textContent=count.total?`${count.total} stories from the deep`:'Every monster has a story.';}
function renderBaitIcon(target,b,size){const c=target.getContext('2d');c.clearRect(0,0,target.width,target.height);MFArt.drawBait(c,b,target.width/2,target.height/2,size);}
function updateBait(){const b=bait();$('baitName').textContent=b.name;renderBaitIcon($('baitIcon'),b,82);lastSecond='';}
function timeUpdate(date){
  const second=Math.floor(date.getTime()/1000);if(second===lastSecond)return;lastSecond=second;
  const clock=[date.getHours(),date.getMinutes(),date.getSeconds()].map(n=>String(n).padStart(2,'0')).join(':');$('clock').textContent=clock;
  const period=MFScene.phase(date);$('dayPhase').textContent=`${period.toUpperCase()} · LOCAL TIME`;
  const event=lakeEvent(date.getTime(),save.seed),meta=EVENTS[event.type];
  $('condition').style.setProperty('--event-color',meta.color);$('eventName').textContent=meta.name;$('eventNote').textContent=meta.note;
  const remaining=Math.max(0,Math.ceil((event.endsAt-date.getTime())/1000));$('eventTimer').textContent=event.endsAt?`${String(Math.floor(remaining/60)).padStart(2,'0')}:${String(remaining%60).padStart(2,'0')}`:'';
  $('eligibleCount').textContent=`${available(date,event.type,save.bait).length} species lurking`;
  if(lastEvent!==event.type){if(lastEvent&&event.type!=='calm')toast(`${meta.name}. Something in the water has changed.`);lastEvent=event.type;}
  if($('journalDialog').open&&lastJournalKey!==`${Math.floor(date.getTime()/60000)}:${event.type}:${save.bait}`)renderJournal();
}
function statusUpdate(){
  if(lastStatus===engine.state)return;lastStatus=engine.state;
  const states={
    idle:['YOUR NEXT STORY IS OUT THERE','Flick up to cast.','Wait for a bite. Tap to reel. Meet the locals.','CAST LINE'],
    casting:['INTO THE UNKNOWN','Make a little ripple.','Your line is on its way.','CASTING…'],
    waiting:['PATIENCE HAS TEETH','Something is down there.','Watch the bobber. You’ll know when it bites.','RETRIEVE'],
    bite:['DON’T LET THIS ONE GET AWAY','You’ve got a bite!','Tap the lake to hook it before it escapes.','REEL IT IN'],
    reeling:['HELLO, STRANGER','Look what found you.','Bringing your catch to the surface…','REELING…'],
    landed:['ANOTHER STORY FROM THE DEEP','A strange new friend.','Your catch has been added to the journal.','CAST LINE'],
    missed:['THE ONE THAT GOT AWAY','A little too slow.','It slipped away. There is always another cast.','CAST AGAIN']
  };
  const [kicker,title,note,action]=states[engine.state];$('statusKicker').textContent=kicker;$('statusTitle').textContent=title;$('statusNote').textContent=note;
  $('castButton').innerHTML=`${action} <span>${engine.state==='bite'?'↓':'↗'}</span>`;
  $('castButton').disabled=['casting','reeling','landed'].includes(engine.state);
  $('baitButton').disabled=['casting','waiting','bite','reeling'].includes(engine.state);
  $('journalButton').disabled=['bite','reeling'].includes(engine.state);$('helpButton').disabled=['bite','reeling'].includes(engine.state);
  $('biteCallout').hidden=engine.state!=='bite';
  if(engine.state==='bite'){sound('bite');haptic();}
}
function cast(power=.5,target=.43){if(anyDialog())return;if(engine.cast(power,target,performance.now(),save.bait)){sound('cast');statusUpdate();}}
function hook(){
  const data=engine.hook(performance.now());if(!data){statusUpdate();return;}
  catchIsRecord=!!save.records[data.fish.id]&&data.length>save.records[data.fish.id].best;
  catchIsNew=recordCatch(save.records,data);persist();updateCounts();sound('catch');haptic();statusUpdate();
}
$('castButton').addEventListener('click',()=>{
  if(engine.state==='bite')hook();else if(engine.state==='waiting'){engine.reset();statusUpdate();}else cast();
});
canvas.addEventListener('pointerdown',e=>{
  if(anyDialog())return;
  if(engine.state==='bite'){hook();return;}
  if(!['idle','missed'].includes(engine.state))return;
  canvas.setPointerCapture(e.pointerId);pointer.dragging=true;pointer.x=e.clientX;pointer.y=e.clientY;pointer.start=performance.now();pointer.power=0;
});
canvas.addEventListener('pointermove',e=>{
  if(!pointer.dragging)return;const dy=pointer.y-e.clientY;pointer.power=Math.max(0,Math.min(1,dy/(height*.34)));
  $('castMeter').hidden=dy<15;$('castMeter').querySelector('i').style.width=`${pointer.power*100}%`;
});
canvas.addEventListener('pointerup',e=>{
  if(!pointer.dragging)return;const dy=pointer.y-e.clientY,elapsed=performance.now()-pointer.start;
  pointer.dragging=false;$('castMeter').hidden=true;
  if(dy>28&&elapsed<1800){const p=Math.max(.15,Math.min(1,dy/(height*.4)+dy/Math.max(1,elapsed)*.12));const rect=canvas.getBoundingClientRect();cast(p,(e.clientX-rect.left)/width);}
  else if(dy<10&&elapsed<400&&pointer.y>height*.5)cast(.42,.45);
});
canvas.addEventListener('pointercancel',()=>{pointer.dragging=false;$('castMeter').hidden=true;});
function pause(){pointer.dragging=false;$('castMeter').hidden=true;engine.cancel();statusUpdate();}
document.addEventListener('visibilitychange',()=>{if(document.hidden)pause();else{lastSecond='';timeUpdate(new Date());}});
window.addEventListener('pagehide',pause);

function hideDialog(dialog){dialog.close();if(dialog.id==='catchDialog'){engine.reset();statusUpdate();}if(dialog.id==='detailDialog'&&detailReturns){detailReturns=false;renderJournal();$('journalDialog').showModal();}}
function closeOverlay(){const open=[...document.querySelectorAll('dialog')].filter(d=>d.open);if(!open.length)return false;hideDialog(open[open.length-1]);return true;}
document.querySelectorAll('[data-close]').forEach(button=>button.addEventListener('click',()=>hideDialog(button.closest('dialog'))));
document.querySelectorAll('dialog').forEach(dialog=>{
  dialog.addEventListener('cancel',e=>{e.preventDefault();hideDialog(dialog);});
  dialog.addEventListener('click',e=>{if(e.target!==dialog)return;const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)hideDialog(dialog);});
});
function openDialog(id){pause();if(engine.state==='landed'){showCatch();return;}$(id).showModal();}
$('helpButton').addEventListener('click',()=>openDialog('helpDialog'));
$('journalButton').addEventListener('click',()=>{renderJournal();openDialog('journalDialog');});
$('baitButton').addEventListener('click',()=>{renderBaits();openDialog('baitDialog');});
$('soundButton').addEventListener('click',()=>{save.sound=!save.sound;persist();$('soundButton').textContent=`SOUND: ${save.sound?'ON':'OFF'}`;if(save.sound)sound('catch');});
$('soundButton').textContent=`SOUND: ${save.sound?'ON':'OFF'}`;
function escapeHTML(value){return String(value).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));}
function renderJournal(){
  updateCounts();const grid=$('fishGrid');grid.replaceChildren();const date=new Date(),event=lakeEvent(date.getTime(),save.seed).type;
  lastJournalKey=`${Math.floor(date.getTime()/60000)}:${event}:${save.bait}`;
  FISH.forEach((fish,index)=>{
    const record=save.records[fish.id],now=eligible(fish,date,event,save.bait);
    if(filter==='caught'&&!record||filter==='now'&&!now)return;
    const card=document.createElement('button');card.className='fish-card';card.dataset.fish=fish.id;card.setAttribute('aria-label',`${fish.name}, ${RARITIES[fish.rarity].label}, ${record?'caught '+record.count+' times':'undiscovered'}`);
    card.innerHTML=`<span class="fish-number">${String(index+1).padStart(2,'0')}</span>${now?'<i class="live-dot" aria-label="Catchable now"></i>':''}<canvas width="360" height="205" aria-hidden="true"></canvas><b>${escapeHTML(fish.name)}</b><small style="color:${RARITIES[fish.rarity].color}">${RARITIES[fish.rarity].label}</small>${record?`<span class="catch-count">×${record.count}</span>`:''}`;
    MFArt.drawFish(card.querySelector('canvas').getContext('2d'),fish,180,100,295,0,!record);
    card.addEventListener('click',()=>{$('journalDialog').close();detailReturns=true;showDetail(fish);});grid.append(card);
  });
  if(!grid.children.length){const p=document.createElement('p');p.className='empty-message';p.textContent='No discoveries yet. Your first strange story is just a cast away.';grid.append(p);}
}
$('filters').addEventListener('click',e=>{const target=e.target.closest('[data-filter]');if(!target)return;filter=target.dataset.filter;document.querySelectorAll('[data-filter]').forEach(b=>b.classList.toggle('active',b===target));renderJournal();});
function showDetail(fish){
  currentDetail=fish;const record=save.records[fish.id],rarity=RARITIES[fish.rarity],date=new Date(),event=lakeEvent(date.getTime(),save.seed).type;
  const art=$('detailArt'),c=art.getContext('2d');c.clearRect(0,0,art.width,art.height);MFArt.drawFish(c,fish,art.width/2,art.height/2,620,0,!record);
  $('detailContent').innerHTML=`<div class="rarity" style="color:${rarity.color}">${rarity.label.toUpperCase()}${!record?' · UNDISCOVERED':''}</div><h2>${escapeHTML(fish.name)}</h2><p class="lore">${escapeHTML(fish.lore)}</p><div class="requirement-box"><small>HOW TO FIND IT</small><p>${escapeHTML(requirement(fish))}</p><div class="availability-tag">${eligible(fish,date,event,save.bait)?'● Catchable with your current bait, time, and water.':'○ Waiting for the right bait, time, or water.'}</div></div><p class="detail-record">${record?`Caught ${record.count} ${record.count===1?'time':'times'} · Best length ${record.best.toFixed(1)} cm<br>First discovered ${new Date(record.first).toLocaleDateString()}`:'Nobody in your journal has met this one yet. Its full colors will be revealed when you catch it.'}</p>`;
  $('detailDialog').showModal();
}
function renderBaits(){
  const grid=$('baitGrid');grid.replaceChildren();const date=new Date(),event=lakeEvent(date.getTime(),save.seed).type;
  BAITS.forEach(b=>{
    const card=document.createElement('button');card.className='bait-card'+(b.id===save.bait?' selected':'');card.dataset.bait=b.id;
    card.setAttribute('aria-pressed',b.id===save.bait?'true':'false');
    card.innerHTML=`${b.id===save.bait?'<span class="selected-mark">✓</span>':''}<canvas width="200" height="145" aria-hidden="true"></canvas><b>${escapeHTML(b.name)}</b><span class="bait-tag">${escapeHTML(b.tag)}</span><p>${escapeHTML(b.note)}</p><span class="bait-availability">${available(date,event,b.id).length} species possible right now</span>`;
    renderBaitIcon(card.querySelector('canvas'),b,145);
    card.addEventListener('click',()=>{save.bait=b.id;persist();updateBait();hideDialog($('baitDialog'));toast(`${b.name} on the hook.`);});grid.append(card);
  });
}
function showCatch(){
  const data=engine.catch;if(!data||anyDialog())return;
  const {fish}=data,rarity=RARITIES[fish.rarity];
  $('catchKicker').textContent=catchIsNew?'A NEW FACE FROM THE DEEP':catchIsRecord?'A NEW SIZE RECORD':'ANOTHER STORY FROM THE DEEP';
  $('catchRarity').textContent=rarity.label.toUpperCase();$('catchRarity').style.color=rarity.color;$('catchName').textContent=fish.name;$('catchLore').textContent=fish.lore;
  $('catchLength').textContent=`${data.length.toFixed(1)} cm`;$('catchMass').textContent=`${data.mass.toFixed(1)} kg`;$('catchRecord').textContent=`×${save.records[fish.id]?.count||1}`;
  const date=new Date(data.caughtAt);$('catchContext').textContent=`${[date.getHours(),date.getMinutes()].map(n=>String(n).padStart(2,'0')).join(':')} · ${EVENTS[data.event].name} · ${BAITS.find(b=>b.id===data.bait)?.name}`;
  $('savedNote').textContent=storageAvailable?'Saved to your journal automatically.':'Storage is unavailable. This catch lasts for this session.';
  const c=$('catchArt').getContext('2d');c.clearRect(0,0,800,530);MFArt.drawFish(c,fish,400,280,640,0);
  $('catchDialog').showModal();
}
$('keepFishing').addEventListener('click',()=>hideDialog($('catchDialog')));
function frame(now){
  requestAnimationFrame(frame);if(document.hidden)return;
  const date=new Date();engine.tick(now,date);timeUpdate(date);statusUpdate();if(engine.state==='landed')showCatch();
  if(now-lastFrame<1000/30)return;lastFrame=now;
  MFScene.render(ctx,width,height,reducedMotion?0:now/1000,date,lakeEvent(date.getTime(),save.seed),engine,pointer,bait());
  if($('catchDialog').open&&engine.catch){const c=$('catchArt').getContext('2d');c.clearRect(0,0,800,530);MFArt.drawFish(c,engine.catch.fish,400,280,640,reducedMotion?0:now/1000);}
}
updateCounts();updateBait();timeUpdate(new Date());statusUpdate();requestAnimationFrame(frame);
if(!storageAvailable)toast('Storage is unavailable. Your journal will last for this session.');
// A tiny lifecycle API for the Android host. No privileged JS bridge is exposed.
window.MonsterFishApp=Object.freeze({pause,closeOverlay});
})();
