import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';

function load(path,variable){
 const win={};vm.runInNewContext(readFileSync(path,'utf8'),{window:win},{timeout:2500,filename:path});return win[variable];
}
const decks=[
 load('essentials-pack-02.js','SAVREO_ESSENTIALS'),
 load('world-pack-03.js','SAVREO_WORLD'),
 load('life-pack-04.js','SAVREO_LIFE'),
 load('public-pack-05.js','SAVREO_PUBLIC')
];
const registry=JSON.parse(readFileSync('content/editorial-registry.json','utf8'));
const civic=load('civic-pack-01.js','SAVREO_CIVIC');
const parties=load('party-directory-01.js','SAVREO_PARTIES');
test('all 240 educational units are unique and recorded for editorial scrutiny',()=>{
 assert.equal(registry.items.length,240);
 assert.equal(new Set(registry.items.map(x=>x.id)).size,240);
 assert.deepEqual(decks.map(d=>d.items.length),[32,48,48,48]);
 assert.equal(civic.cards.length,24);
 const ids=new Set();
 const required=new Set(registry.items.map(x=>x.id));
 for(const card of decks.flatMap(p=>p.items)){
  assert.ok(!ids.has(card.id),'Repeated micro ID '+card.id);
  ids.add(card.id);
  assert.ok(required.has('essential:'+card.id),'Missing editorial entry for '+card.id);
  assert.equal(card.status,'pending_external_review');
  assert.ok(card.title.length>8&&card.body.length>30&&card.question.length>=10,card.id+' has a very short prompt');
  assert.ok(card.why.length>25,card.id+' missing answer rationale');
  assert.equal(card.choices.length,3,card.id+' wrong number of answers');
  assert.equal(new Set(card.choices).size,3,card.id+' repeats a choice');
  assert.ok(Number.isInteger(card.answer)&&card.answer>=0&&card.answer<3);
  assert.ok(card.sources.length>=1);
  for(const src of card.sources){
   const url=new URL(src.url);
   assert.equal(url.protocol,'https:');
   assert.equal(url.username,'');
   assert.equal(url.password,'');
   assert.ok(src.label&&src.label.length>6);
  }
  assert.ok(card.ageGroups.length>=1);
  for(const age of card.ageGroups)assert.ok(['12-15','16-20','21-28'].includes(age));
 }
 assert.equal(ids.size,176);
});
test('age recommendations stay balanced, but not gated',()=>{
 const cards=decks.flatMap(x=>x.items);
 assert.deepEqual(['12-15','16-20','21-28'].map(age=>cards.filter(c=>c.ageGroups.includes(age)).length),[59,59,58]);
 const app=readFileSync('app.js','utf8');
 assert.match(app,/essentialAvailable=\(\)=>/);
 assert.match(app,/ageGroups\.includes\(catalogAge\)/);
 assert.match(app,/const selected=cards\.find/);
 assert.match(app,/microReviews/);
 assert.ok(!/partyMatch|politicalAffinity|partyScore|voteRecommendation/i.test(app));
});
test('the offline cache includes every learning deck in the correct version',()=>{
 const html=readFileSync('index.html','utf8');
 const sw=readFileSync('sw.js','utf8');
 for(const name of ['essentials-pack-02.js','world-pack-03.js','life-pack-04.js','public-pack-05.js','party-directory-01.js','civic-pack-01.js','app.js']){
  assert.ok(html.includes(name+'?v=14'),name+' missing from HTML');
  assert.ok(sw.includes('./'+name+'?v=14'),name+' missing from service worker');
 }
 assert.match(sw,/savreo-assets-v14/);
 assert.match(sw,/req\.method !== 'GET'/);
 assert.match(sw,/pathname\.startsWith\('\/api\/'\)/);
});
test('political sources are attributed and reviewed independently, not personalized',()=>{
 assert.equal(parties.noPoliticalProfiling,true);
 assert.equal(parties.completeCoverage,false);
 assert.equal(parties.parties.length,17);
 for(const p of parties.parties){
  assert.equal(p.reviewStatus,'pending_external_review');
  assert.equal(p.financialScore,null);
  assert.equal(p.leader,null);
  assert.equal(p.courtCases,null);
  assert.ok(p.primarySource.url.startsWith('https://'));
 }
 assert.ok(readFileSync('docs/PILOT_24_YOUNG_USERS.md','utf8').includes('recrutement et sessions non réalisés'));
});
