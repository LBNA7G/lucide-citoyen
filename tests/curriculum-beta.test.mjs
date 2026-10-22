import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';

const src=readFileSync('curriculum-beta.js','utf8');
const context={window:{}};
vm.runInNewContext(src,context,{filename:'curriculum-beta.js',timeout:1500});
const beta=context.window.SAVREO_BETA;
const register=JSON.parse(readFileSync('content/editorial-registry.json','utf8'));
const registryIds=new Set(register.items.map(x=>x.id));

test('the beta contains nine fictional cases and six concise lessons with sources',()=>{
 assert.equal(beta.scenarios.length,9);
 assert.equal(beta.lessons.length,6);
 const scenariosByAge=new Map([['12-15',0],['16-20',0],['21-28',0]]);
 const lessonsByAge=new Map([['12-15',0],['16-20',0],['21-28',0]]);
 const ids=new Set();
 for(const [type,collection,counter] of [['case',beta.scenarios,scenariosByAge],['lesson',beta.lessons,lessonsByAge]]){
  for(const item of collection){
   assert.ok(!ids.has(item.id),'duplicate '+item.id);ids.add(item.id);
   assert.ok(registryIds.has(type+':'+item.id),'unregistered '+item.id);
   assert.equal(item.choices.length,3);
   assert.ok(Number.isInteger(item.answer)&&item.answer>=0&&item.answer<item.choices.length);
   assert.ok(item.why.length>30);
   assert.ok(item.ageGroups.length>0);
   assert.ok(item.interestIds.length>0);
   if(type==='case')assert.equal(item.kind,'Simulation fictive');
   for(const age of item.ageGroups){assert.ok(counter.has(age));counter.set(age,counter.get(age)+1);}
   const sources=type==='case'?item.source:item.sources;
   assert.ok(Array.isArray(sources)&&sources.length,'source missing '+item.id);
   sources.forEach(([name,url])=>{assert.ok(name.length>5);assert.match(url,/^https:\/\//);});
  }
 }
 assert.deepEqual([...scenariosByAge.values()],[3,3,3]);
 assert.deepEqual([...lessonsByAge.values()],[2,2,2]);
});
test('beta case replies and citations are not labeled as externally approved',()=>{
 for(const item of [...beta.scenarios,...beta.lessons]){
  const pref=beta.scenarios.includes(item)?'case:':'lesson:';
  const meta=register.items.find(x=>x.id===pref+item.id);
  assert.equal(meta.status,'pending_external_review');
  assert.equal(meta.reviewed_at,null);
 }
});
