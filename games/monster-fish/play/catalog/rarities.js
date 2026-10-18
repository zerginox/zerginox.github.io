/* EDIT THIS CATALOG to add content; keep existing IDs stable for saved journals. */
(function(root){
'use strict';
  const RARITIES = {
    common: { label: 'Common', color: '#a5c5ba', weight: 45 },
    uncommon: { label: 'Uncommon', color: '#bde989', weight: 18 },
    rare: { label: 'Rare', color: '#73ccf2', weight: 5 },
    epic: { label: 'Epic', color: '#c5a1ff', weight: 1.2 },
    legendary: { label: 'Legendary', color: '#ffca70', weight: .3 },
    mythic: { label: 'Mythic', color: '#ff93b7', weight: .02 }
  };

const data={RARITIES};
if(typeof module!=='undefined'&&module.exports) module.exports=data;
Object.assign(root.MFContent||(root.MFContent={}),data);
})(typeof globalThis!=='undefined'?globalThis:this);
