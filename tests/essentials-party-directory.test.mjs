import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
function load(filename,key){const sandbox={window:{}};vm.runInNewContext(readFileSync(filename,'utf8'),sandbox,{timeout:2000});return sandbox.window[key];}
const essentials=load('essentials-pack-02.js','SAVREO_ESSENTIALS');
const directory=load('party-directory-01.js','SAVREO_PARTIES');
const world=load('world-pack-03.js','SAVREO_WORLD');
const life=load('life-pack-04.js','SAVREO_LIFE');
const publicPack=load('public-pack-05.js','SAVREO_PUBLIC');
const register=JSON.parse(readFileSync('content/editorial-registry.json','utf8'));
const ids=new Set(register.items.map(x=>x.id));
test('240 unique educational units, with 32 essentials and 48 world-knowledge exercises',()=>{
 assert.equal(register.items.length,240);
 assert.equal(ids.size,register.items.length);
 assert.equal(essentials.items.length,32);
 const counts=new Map([['12-15',0],['16-20',0],['21-28',0]]);
 const positions=[0,0,0];
 for(const card of essentials.items){
  assert.ok(ids.has('essential:'+card.id));
  assert.equal(card.choices.length,3);
  assert.ok([0,1,2].includes(card.answer));
  positions[card.answer]++;
  assert.ok(card.why.length>=25);
  assert.ok(card.question.length>=10);
  assert.equal(card.status,'pending_external_review');
  for(const age of card.ageGroups){assert.ok(counts.has(age));counts.set(age,counts.get(age)+1);}
  for(const source of card.sources)assert.match(source.url,/^https:\/\//);
 }
 assert.ok(Math.max(...positions)-Math.min(...positions)<=1);
 assert.deepEqual([...counts.values()],[11,11,10]);
});
test('party documents are attributed, dated or explicitly undated, and never assigned political scores',()=>{
 assert.equal(directory.parties.length,17);
 assert.equal(directory.parties.filter(x=>x.country==='BE').length,12);
 assert.equal(directory.parties.filter(x=>x.country==='FR').length,5);
 assert.equal(new Set(directory.parties.map(x=>x.id)).size,17);
 assert.equal(directory.noPoliticalProfiling,true);
 assert.equal(directory.completeCoverage,false);
 for(const record of directory.parties){
  assert.match(record.primarySource.url,/^https:\/\//);
  assert.ok(record.name.length);
  assert.ok(record.docDate);
  assert.equal(record.reviewStatus,'pending_external_review');
  assert.equal(record.leader,null);
  assert.equal(record.courtCases,null);
  assert.equal(record.financialScore,null);
 }
 assert.ok(directory.parties.some(x=>x.primarySource.url.includes('dc2024.be')));
});

test('48 new world-knowledge cases are unique, grounded and age balanced',()=>{
 assert.equal(world.items.length,48);
 assert.equal(new Set(world.items.map(c=>c.id)).size,48);
 for(const age of ['12-15','16-20','21-28']) assert.equal(world.items.filter(c=>c.ageGroups.includes(age)).length,16);
 const positions=[0,0,0];
 for(const c of world.items){
  assert.ok(ids.has('essential:'+c.id),'missing register entry '+c.id);
  assert.equal(c.status,'pending_external_review');
  assert.equal(c.scenarioType,'simulation pédagogique');
  assert.equal(c.choices.length,3);
  assert.ok(c.body.length>45);
  assert.ok(c.why.length>40);
  positions[c.answer]++;
  for(const src of c.sources) assert.match(src.url,/^https:\/\//);
 }
 assert.deepEqual(positions,[16,16,16]);
});

test('final life and civic offline lots add 96 age-balanced, source-backed questions',()=>{
 for(const pack of [life,publicPack]){
  assert.equal(pack.items.length,48);
  for(const age of ['12-15','16-20','21-28'])assert.equal(pack.items.filter(c=>c.ageGroups.includes(age)).length,16);
  const positions=[0,0,0];
  for(const c of pack.items){
   assert.ok(ids.has('essential:'+c.id),'Missing registry '+c.id);
   assert.equal(c.status,'pending_external_review');
   assert.equal(c.scenarioType,'simulation pédagogique');
   assert.equal(c.choices.length,3);
   assert.ok(c.question.length>=15);
   assert.ok(c.why.length>=40);
   positions[c.answer]++;
   for(const src of c.sources)assert.match(src.url,/^https:\/\//);
  }
  assert.deepEqual(positions,[16,16,16]);
 }
 const all=[...essentials.items,...world.items,...life.items,...publicPack.items];
 assert.equal(all.length,176);
 assert.equal(new Set(all.map(x=>x.id)).size,176);
});
