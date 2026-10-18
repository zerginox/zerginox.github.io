/* EDIT THIS CATALOG to add content; keep existing IDs stable for saved journals. */
(function(root){
'use strict';
  const EVENTS = {
    calm: { weight: 0, name: 'Calm waters', color: '#c8edac', note: 'Something is always lurking beneath the surface.' },
    toxic: { weight: 32, name: 'Toxic waste spill', color: '#b5f56d', note: 'The runoff is glowing. So are the things in it.' },
    fire: { weight: 23, name: 'Gasoline fire', color: '#ffb174', note: 'Burning fuel on the lake. The deep is waking up.' },
    storm: { weight: 25, name: 'Electrical storm', color: '#adbeff', note: 'Static in the air. Teeth in the water.' },
    bloom: { weight: 20, name: 'Algae bloom', color: '#7ce0be', note: 'A living carpet of green is feeding strange visitors.' }
  };
  const EVENT_SCHEDULE = {slotMinutes:15, chance:.62, minDelaySeconds:60, maxDelaySeconds:360, minDurationSeconds:240, maxDurationSeconds:480};

const data={EVENTS,EVENT_SCHEDULE};
if(typeof module!=='undefined'&&module.exports) module.exports=data;
Object.assign(root.MFContent||(root.MFContent={}),data);
})(typeof globalThis!=='undefined'?globalThis:this);
