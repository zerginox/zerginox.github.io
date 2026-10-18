/* EDIT THIS CATALOG to add content; keep existing IDs stable for saved journals. */
(function(root){
'use strict';
  function species(id, name, rarity, form, base, accent, min, max, lore, rules = {}) {
    return Object.freeze({ id, name, rarity, form, base, accent, min, max, lore, ...rules });
  }
  const FISH = Object.freeze([
    species('bogling','Bogling','common','round','#819c62','#d3e79a',12,28,'Small, grumpy, and absolutely convinced it owns the lake.'),
    species('snagglefin','Snagglefin','common','perch','#b27f66','#eac092',18,41,'Its teeth grow faster than its common sense.'),
    species('mossjaw','Mossjaw','common','cat','#527d68','#aed494',22,53,'Half fish, half compost. All appetite.'),
    species('rustscale','Rustscale','common','perch','#ad6448','#f8b56e',16,38,'Armored in scales the color of abandoned machinery.'),
    species('pebblepuff','Pebblepuff','common','puff','#9c997b','#e9ddb2',10,26,'A prickly little stone with a terrible attitude.', {bait:["worm"]}),
    species('ribbongrub','Ribbon Grub','common','eel','#748f87','#c3dfb4',25,63,'It ties itself into knots when nobody is looking.', {bait:["worm"]}),
    species('crookedgill','Crooked Gill','common','maw','#747c9c','#a7ccdb',19,44,'Three eyes. Two fins. One very suspicious expression.', {bait:["meat"]}),
    species('glassfin','Glassfin','uncommon','ray','#6ba9ad','#c2fcde',20,47,'Sunlight passes through it, then comes out the wrong color.',{bait:["prism"],start:360,end:1140}),
    species('moonbelly','Moonbelly','uncommon','puff','#6977ae','#b5d8ff',18,40,'A little piece of moonlight that learned to bite.',{bait:["glow"],start:1140,end:360}),
    species('lanterngoby','Lantern Goby','uncommon','angler','#4b687e','#8af4d1',16,33,'The light is friendly. The rest of it is not.',{bait:["glow"],start:1140,end:360}),
    species('sunspotsnapper','Sunspot Snapper','uncommon','perch','#ca8b4e','#ffe17d',24,58,'Its golden spots get brighter when it is annoyed.',{bait:["worm", "prism"],start:480,end:1020}),
    species('rainwhisker','Rainwhisker','uncommon','cat','#657ba1','#bfcafc',30,73,'It tastes the thunder through its whiskers.',{bait:["copper"],event:'storm'}),
    species('oilskipper','Oilskipper','uncommon','eel','#595c74','#ffb084',35,81,'Slips between burning patches without a single singed scale.',{bait:["ember"],event:'fire'}),
    species('widowray','Widow Ray','rare','ray','#66518d','#d7b9ff',54,120,'Its shadow always seems to swim in the other direction.',{bait:["meat"],start:1140,end:360}),
    species('barreljaw','Barreljaw','rare','maw','#728c37','#d7ff75',40,94,'Nobody knows what was in that barrel. This fish does.',{bait:["rad"],event:'toxic'}),
    species('cinderpike','Cinder Pike','rare','shark','#9e4f42','#ffb372',60,139,'It hunts the orange reflections beneath burning fuel.',{bait:["ember"],event:'fire'}),
    species('bloomback','Bloomback','rare','puff','#378f7d','#98f3b6',28,67,'A wandering garden, if gardens had fangs.',{bait:["worm"],event:'bloom'}),
    species('dawndrifter','Dawn Drifter','rare','ray','#af889a','#ffe4bb',45,101,'Appears where the last stars meet the first light.',{bait:["prism"],start:300,end:420}),
    species('radking','Rad King','epic','angler','#5a843b','#c6ff5b',71,165,'A radioactive crown for the ruler of the runoff.',{bait:["rad"],event:'toxic'}),
    species('hellgill','Hellgill','epic','maw','#873f45','#ff9566',86,198,'The hotter the water gets, the wider it smiles.',{bait:["ember"],event:'fire'}),
    species('staticeel','Static Eel','epic','eel','#5551a0','#c7bcff',95,227,'Lightning is just what happens when it sneezes.',{bait:["copper"],event:'storm',start:1140,end:360}),
    species('gloammaw','Gloam Maw','epic','maw','#62537f','#f5a3d7',102,240,'It eats the light that falls between day and night.',{bait:["meat"],start:1080,end:1200}),
    species('noonmirage','Noon Mirage','legendary','ray','#c49d6b','#fff1b4',110,260,'For five minutes, the lake remembers a different sun.',{bait:["prism"],start:720,end:725}),
    species('witchlight','Witchlight','legendary','angler','#7673aa','#ccfffa',90,210,'Five minutes of impossible light in the dead of night.',{bait:["glow"],start:183,end:188}),
    species('leviathanzero','Leviathan Zero','mythic','shark','#3b536b','#ff9abc',300,720,'The first thing in the lake. Maybe the reason there is a lake.',{bait:["rad"],event:'toxic',start:0,end:60})
  ]);
const data={FISH};
if(typeof module!=='undefined'&&module.exports) module.exports=data;
Object.assign(root.MFContent||(root.MFContent={}),data);
})(typeof globalThis!=='undefined'?globalThis:this);
