/* Monster Fish — platform-independent rules. No assets, services, or accelerated clock. */
(function (root) {
  'use strict';
  const content = typeof module!=='undefined' && module.exports
    ? {...require('./catalog/rarities.js'),...require('./catalog/lake-events.js'),...require('./catalog/bait.js'),...require('./catalog/fish.js')}
    : root.MFContent;
  const {RARITIES, EVENTS, EVENT_SCHEDULE, BAITS, FISH} = content;
  const minuteOfDay = date => date.getHours() * 60 + date.getMinutes();
  function inWindow(minute, start, end) {
    if (start === undefined || start === end) return true;
    return start < end ? minute >= start && minute < end : minute >= start || minute < end;
  }
  function eligible(fish, date, event, bait) {
    return (!fish.bait || fish.bait.includes(bait)) && (!fish.event || fish.event === event) && inWindow(minuteOfDay(date),fish.start,fish.end);
  }
  function available(date,event,bait) { return FISH.filter(f => eligible(f,date,event,bait)); }
  function weightedCatch(date,event,bait,random = Math.random) {
    const pool = available(date,event,bait);
    let value = Math.min(.999999999999,Math.max(0,random())) * pool.reduce((sum,f)=>sum+RARITIES[f.rarity].weight,0);
    for (const fish of pool) { value -= RARITIES[fish.rarity].weight; if (value < 0) return fish; }
    return pool[pool.length-1];
  }
  function rng(seed) {
    let a = seed >>> 0;
    return () => { a += 0x6D2B79F5; let t = a; t = Math.imul(t ^ t >>> 15,t | 1); t ^= t + Math.imul(t ^ t >>> 7,t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  }
  // Each installation has a persistent random seed. Epoch slots make events survive app restarts.
  const SLOT = EVENT_SCHEDULE.slotMinutes * 60 * 1000;
  function lakeEvent(timestamp,seed) {
    const slot = Math.floor(timestamp / SLOT);
    const random = rng(Math.imul(slot,2654435761) ^ seed);
    if (random() > EVENT_SCHEDULE.chance) return { type:'calm', endsAt:0 };
    const options=Object.entries(EVENTS).filter(([id,event])=>id!=='calm'&&event.weight>0);
    let roll=random()*options.reduce((sum,[,event])=>sum+event.weight,0);
    let type=options[options.length-1][0];
    for(const [id,event] of options){roll-=event.weight;if(roll<0){type=id;break;}}
    const startsAt = slot*SLOT + (EVENT_SCHEDULE.minDelaySeconds+Math.floor(random()*(EVENT_SCHEDULE.maxDelaySeconds-EVENT_SCHEDULE.minDelaySeconds)))*1000;
    const endsAt = Math.min((slot+1)*SLOT,startsAt+(EVENT_SCHEDULE.minDurationSeconds+Math.floor(random()*(EVENT_SCHEDULE.maxDurationSeconds-EVENT_SCHEDULE.minDurationSeconds)))*1000);
    return timestamp >= startsAt && timestamp < endsAt ? {type,startsAt,endsAt} : {type:'calm',endsAt:0};
  }
  function hhmm(minute) { return `${String(Math.floor(minute/60)).padStart(2,'0')}:${String(minute%60).padStart(2,'0')}`; }
  function requirement(fish) {
    const parts=[];
    if (fish.start !== undefined) parts.push(`${hhmm(fish.start)}–${hhmm(fish.end)} local time`);
    if (fish.event) parts.push(EVENTS[fish.event].name);
    if(fish.bait) parts.push(fish.bait.map(id=>BAITS.find(b=>b.id===id)?.name||id).join(' or '));
    return parts.length ? parts.join(' + ') : 'Any time · any bait · any lake conditions';
  }
  function catchSize(fish,random=Math.random) {
    const length = Math.round((fish.min+(fish.max-fish.min)*Math.pow(random(),1.7))*10)/10;
    const mass = Math.max(.1,Math.round(Math.pow(length/40,3)*(fish.form==='eel'?.35:fish.form==='puff'?1.4:.8)*10)/10);
    return {length,mass};
  }
  function recordCatch(records,catchData) {
    const id=catchData.fish.id, old=records[id];
    records[id]={count:(old?.count||0)+1,best:Math.max(old?.best||0,catchData.length),
      first:old?.first||catchData.caughtAt,last:catchData.caughtAt};
    return !old;
  }
  class FishingEngine {
    constructor(seed,random=Math.random) { this.seed=seed;this.random=random;this.bait='worm';this.state='idle';this.catch=null;this.message=''; }
    cast(power,x,now,bait=this.bait) {
      if(this.state!=='idle' && this.state!=='missed') return false;
      if(!BAITS.some(b=>b.id===bait)) return false;
      this.bait=bait;this.state='casting';this.since=now;this.power=Math.max(0,Math.min(1,power));this.targetX=Math.max(.15,Math.min(.85,x));this.catch=null;return true;
    }
    tick(now,date) {
      if(this.state==='casting' && now-this.since>=680) {
        this.state='waiting';this.since=now;this.deadline=now+4000+this.random()*7000;
      } else if(this.state==='waiting' && now>=this.deadline) {
        const event=lakeEvent(date.getTime(),this.seed).type;
        const fish=weightedCatch(date,event,this.bait,this.random);
        this.catch={fish,bait:this.bait,...catchSize(fish,this.random),event,caughtAt:date.toISOString()};
        this.state='bite';this.since=now;this.deadline=now+3600;
      } else if(this.state==='bite' && now>=this.deadline) {
        this.state='missed';this.since=now;this.message='It slipped away. There is always another cast.';this.catch=null;
      } else if(this.state==='reeling' && now-this.since>=1100) { this.state='landed';this.since=now; }
      return this.state;
    }
    hook(now) {
      if(this.state!=='bite') return null;
      if(now>=this.deadline) {this.state='missed';this.catch=null;this.message='A little too late. Cast again.';return null;}
      this.state='reeling';this.since=now;return this.catch;
    }
    reset() {this.state='idle';this.catch=null;}
    cancel() {
      if(this.state==='landed') return;
      if(this.state==='reeling') this.state='landed';
      else this.reset();
    }
  }
  const api={FISH,BAITS,RARITIES,EVENTS,EVENT_SCHEDULE,SLOT,minuteOfDay,inWindow,eligible,available,weightedCatch,rng,lakeEvent,hhmm,requirement,catchSize,recordCatch,FishingEngine};
  if(typeof module!=='undefined' && module.exports) module.exports=api;
  root.MF=api;
})(typeof globalThis!=='undefined'?globalThis:this);
