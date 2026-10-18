'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const {createCanvas}=require('@napi-rs/canvas');
const ROOT=path.resolve(__dirname,'..');
class Target {
  constructor(){this.listeners={};this.dataset={};this.textContent='';this.disabled=false;this.classList={add(){},remove(){}};}
  addEventListener(type,fn){(this.listeners[type]??=[]).push(fn);}
  dispatchEvent(e){for(const fn of this.listeners[e.type]||[])fn(e);return true;}
  setPointerCapture(){}
}
function audioNode(){return new Proxy({gain:{value:0,setValueAtTime(){},linearRampToValueAtTime(){},exponentialRampToValueAtTime(){}},frequency:{value:0,setValueAtTime(){},linearRampToValueAtTime(){},exponentialRampToValueAtTime(){}},Q:{value:0},connect(){},start(){},stop(){},disconnect(){}},{get(target,key){return key in target?target[key]:()=>audioNode();}});}
class AudioContext {constructor(){this.currentTime=0;this.state='running';this.destination={};this.sampleRate=44100;}resume(){return Promise.resolve();}createOscillator(){return audioNode();}createGain(){return audioNode();}createBiquadFilter(){return audioNode();}createBuffer(){return{getChannelData(){return new Float32Array(44100);}};}createBufferSource(){return audioNode();}}
function exerciseLevel(n,initial){
  const source=fs.readFileSync(path.join(ROOT,`games/salt-altar/level${n}.html`),'utf8');
  const nativeCanvas=createCanvas(900,520),elements=new Map(),document=new Target(),window=new Target(),frames=[],intervals=new Map(),timers=[];
  let now=1000,nextInterval=0;
  const storage=new Map([['saltAltarProgress',String(initial)]]);
  const buttons=['ArrowLeft','ArrowUp','ArrowDown','ArrowRight'].map(key=>{const b=new Target();b.dataset.key=key;return b;});
  const controls={querySelectorAll(){return buttons;}};
  document.getElementById=id=>{if(id==='game')return nativeCanvas;if(!elements.has(id))elements.set(id,new Target());return elements.get(id);};
  document.querySelector=selector=>selector==='.touch-controls'?controls:null;
  const sandbox={document,window,console,Math,Date,Float32Array,Uint8Array,performance:{now:()=>now},localStorage:{getItem:key=>storage.get(key)||null,setItem:(key,value)=>storage.set(key,value)},
    requestAnimationFrame:fn=>{frames.push(fn);return frames.length;},setTimeout:fn=>{timers.push(fn);return timers.length;},clearTimeout(){},setInterval:fn=>{const id=++nextInterval;intervals.set(id,fn);return id;},clearInterval:id=>intervals.delete(id),
    Audio:class {constructor(){this.currentTime=0;this.volume=1;}play(){return Promise.resolve();}pause(){}},AudioContext,
    KeyboardEvent:class{constructor(type,props){this.type=type;Object.assign(this,props);}preventDefault(){}}};
  window.AudioContext=AudioContext;window.webkitAudioContext=AudioContext;window.location={href:''};
  window.dispatchEvent=Target.prototype.dispatchEvent.bind(window);
  const context=vm.createContext(sandbox);
  vm.runInContext(fs.readFileSync(path.join(ROOT,'games/salt-altar/portal.js'),'utf8'),context);
  for(const script of source.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g))if(script[1].trim())vm.runInContext(script[1],context,{filename:`level${n}.html`});
  document.dispatchEvent({type:'DOMContentLoaded'});
  assert.equal(vm.runInContext('world.width',context),900);assert.ok(Number(elements.get('total').textContent)>0);
  elements.get('startBtn').dispatchEvent({type:'click'});
  for(let i=0;i<4;i++){now+=1000;for(const fn of [...intervals.values()])fn();}
  assert.equal(vm.runInContext('gameStarted',context),true);
  const start=vm.runInContext('slug.x',context),right=buttons[3],pointer={type:'pointerdown',pointerId:1,preventDefault(){}};
  right.dispatchEvent(pointer);assert.equal(vm.runInContext('keys.arrowright',context),true);
  for(let i=0;i<5;i++){now+=16;const frame=frames.shift();assert.ok(frame);frame(now);}
  assert.ok(vm.runInContext('slug.x',context)>start,`level ${n}: touch movement`);
  right.dispatchEvent({...pointer,type:'pointerup'});assert.equal(vm.runInContext('keys.arrowright',context),false);
  right.dispatchEvent(pointer);window.dispatchEvent({type:'blur'});assert.equal(vm.runInContext('keys.arrowright',context),false);
  vm.runInContext('beginWinReturn()',context);assert.equal(Number(storage.get('saltAltarProgress')),Math.max(initial,n+1));
  for(const fn of timers)fn();assert.equal(window.location.href,'index.html');
  return true;
}
for(let n=1;n<=6;n++){exerciseLevel(n,1);exerciseLevel(n,7);console.log(`PASS Salt Altar ${n}: initialize, countdown, Canvas drawing, touch movement/release, win return, unlock and replay persistence.`);}
const files=[];function walk(dir){for(const entry of fs.readdirSync(dir,{withFileTypes:true})){if(entry.name==='.git')continue;const file=path.join(dir,entry.name);if(entry.isDirectory())walk(file);else files.push(file);}}walk(ROOT);
for(const file of files.filter(f=>f.endsWith('.js'))){new vm.Script(fs.readFileSync(file,'utf8'),{filename:file});}
const core=require('../games/monster-fish/play/core.js');assert.equal(core.FISH.length,25);assert.equal(core.BAITS.length,7);
assert.equal(core.eligible(core.FISH.find(f=>f.id==='leviathanzero'),new Date(2026,9,18,0,30),'toxic','rad'),true);
assert.equal(core.eligible(core.FISH.find(f=>f.id==='leviathanzero'),new Date(2026,9,18,0,30),'toxic','worm'),false);
const {drawWizard}=require('../assets/wizard.js');const art=createCanvas(690,640);drawWizard(art.getContext('2d'),690,640,0,{x:0,y:0});drawWizard(art.getContext('2d'),690,640,5,{x:1,y:-1});
assert.equal(fs.readFileSync(path.join(ROOT,'CNAME'),'utf8').trim(),'www.zerginox.com');
console.log('PASS JavaScript syntax, Monster Fish roster/bait rules, procedural wizard rendering, and custom domain.');
