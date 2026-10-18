'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const {createCanvas}=require('@napi-rs/canvas');
const base=path.resolve(__dirname,'../games/salt-altar');
function load(htmlOverride,rejectPlayback=false){
  let now=0,serial=0;
  const nodes=new Map(),intervals=new Map(),timers=new Map(),storage=new Map(),audios=[],canvas=createCanvas(900,520);
  class Target{constructor(){this.events={};this.textContent='';this.disabled=false;}addEventListener(type,fn){(this.events[type]??=[]).push(fn);}dispatchEvent(e){for(const fn of this.events[e.type]||[])fn(e);}}
  const document=new Target(),window=new Target();
  document.getElementById=id=>{if(id==='game')return canvas;if(!nodes.has(id))nodes.set(id,new Target());return nodes.get(id);};
  document.querySelector=()=>null;window.location={href:''};
  class Audio{constructor(src){this.src=src;this.currentTime=0;this.paused=true;this.playCalls=0;audios.push(this);}play(){this.playCalls++;if(rejectPlayback)return Promise.reject(new Error('Playback blocked'));this.paused=false;return Promise.resolve();}pause(){this.paused=true;}}
  const context=vm.createContext({document,window,console,Math,Date,Audio,performance:{now:()=>now},requestAnimationFrame(){},
    setInterval(fn){const id=++serial;intervals.set(id,fn);return id;},clearInterval:id=>intervals.delete(id),
    setTimeout(fn){const id=++serial;timers.set(id,fn);return id;},clearTimeout:id=>timers.delete(id),
    localStorage:{getItem:key=>storage.get(key),setItem:(key,value)=>storage.set(key,value)}});
  if(!htmlOverride)vm.runInContext(fs.readFileSync(path.join(base,'portal.js'),'utf8'),context);
  for(const script of (htmlOverride||fs.readFileSync(path.join(base,'level2.html'),'utf8')).matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g))if(script[1].trim())vm.runInContext(script[1],context);
  return {get:source=>vm.runInContext(source,context),audios,canvas,nodes,timers,storage,
    advance(milliseconds){now+=milliseconds;},
    countdown(){nodes.get('startBtn').dispatchEvent({type:'click'});for(let i=0;i<3;i++){now+=1000;for(const fn of [...intervals.values()])fn();}}};
}
module.exports={load};
if(require.main===module){
  test('The level is silent until Start, loops the supplied track, and restarts one audio instance from the beginning',()=>{
    const app=load(),music=app.audios[0];
    assert.equal(app.audios.length,1);assert.equal(music.src,'Level_2.mp3');assert.equal(music.loop,true);assert.equal(music.paused,true);assert.equal(music.playCalls,0);
    app.countdown();assert.equal(music.paused,false);assert.equal(music.playCalls,1);
    app.nodes.get('startBtn').dispatchEvent({type:'click'});assert.equal(music.playCalls,1);
    music.currentTime=12;app.nodes.get('restartBtn').dispatchEvent({type:'click'});
    assert.equal(app.audios.length,1);assert.equal(music.currentTime,0);assert.equal(music.playCalls,2);assert.equal(music.paused,false);
  });
  test('Every loss path stops and rewinds the music',()=>{
    for(const cause of ['enemy','salt','timer']){
      const app=load();app.countdown();const music=app.audios[0];music.currentTime=14;
      if(cause==='enemy')app.get('world.lives=1;slug.hurtTimer=0;hitByEnemy()');
      if(cause==='salt')app.get('world.lives=1;slug.hurtTimer=0;slug.x=saltBlocks[0].x;slug.y=saltBlocks[0].y;update()');
      if(cause==='timer'){app.advance(31000);app.get('update()');}
      assert.equal(app.get('world.lose'),true,cause);assert.equal(music.paused,true,cause);assert.equal(music.currentTime,0,cause);
    }
  });
  test('Winning stops and rewinds the music; resetting leaves the level silent',()=>{
    const app=load();app.countdown();const music=app.audios[0];music.currentTime=9;
    app.get('beginWinReturn()');assert.equal(music.paused,true);assert.equal(music.currentTime,0);assert.equal(Number(app.storage.get('saltAltarProgress')),3);
    music.currentTime=5;app.get('resetGame()');assert.equal(music.paused,true);assert.equal(music.currentTime,0);
  });
  test('A browser playback rejection does not stop the game from starting',async()=>{
    const app=load(undefined,true);app.countdown();await Promise.resolve();
    assert.equal(app.get('gameStarted'),true);assert.equal(app.audios[0].playCalls,1);
  });
}
