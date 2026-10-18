/* EDIT THIS CATALOG to add content; keep existing IDs stable for saved journals. */
(function(root){
'use strict';
const BAITS = Object.freeze([
 {id:'worm',name:'Earthworm',kind:'worm',color:'#dfac88',tag:'The trusty classic',note:'A wriggling favorite of bottom feeders and bloom grazers.'},
 {id:'glow',name:'Glow Grub',kind:'grub',color:'#b2f3d0',tag:'For things in the dark',note:'A soft green glow draws moonlit hunters and curious lights.'},
 {id:'meat',name:'Meat Scrap',kind:'meat',color:'#ee9a9b',tag:'For bigger appetites',note:'A bloody little morsel for sharp teeth and dusk predators.'},
 {id:'rad',name:'Rad Slug',kind:'slug',color:'#c4f66a',tag:'A little unstable',note:'Thrives in toxic runoff. Attracts fish that really should not exist.'},
 {id:'ember',name:'Ember Bug',kind:'bug',color:'#ffb077',tag:'Some like it hot',note:'A heat-loving beetle for hunters beneath burning gasoline.'},
 {id:'copper',name:'Copper Spinner',kind:'spinner',color:'#c0b8ff',tag:'A storm chaser',note:'Conducts a tiny current. Best when the sky is feeling electric.'},
 {id:'prism',name:'Prism Fly',kind:'fly',color:'#ffe6ac',tag:'Chasing strange light',note:'Iridescent wings for glassy fins, first light, and a five-minute mirage.'}
]);
const data={BAITS};
if(typeof module!=='undefined'&&module.exports) module.exports=data;
Object.assign(root.MFContent||(root.MFContent={}),data);
})(typeof globalThis!=='undefined'?globalThis:this);
