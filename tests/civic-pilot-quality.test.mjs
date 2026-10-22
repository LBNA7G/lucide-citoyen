import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';

const context={window:{}};
vm.runInNewContext(readFileSync('civic-pack-01.js','utf8'),context,{timeout:1500});
const cards=context.window.SAVREO_CIVIC.cards;
const registry=JSON.parse(readFileSync('content/editorial-registry.json','utf8'));
const index=new Map(registry.items.map(x=>[x.id,x]));
const pilotIds=[
 'promesse-loi','budget-deficit','aides','programmes','sondage-resultat','accusation-decision',
 'autorites-locales','be-16-europe','be-participation','be-resultats','fr-voter-18','fr-comptes-partis'
];

test('12 rewritten civic questions have balanced answers and plausible alternatives',()=>{
 const pilot=pilotIds.map(id=>{const c=cards.find(x=>x.id===id);assert.ok(c,id+' missing');return c;});
 const distribution=[0,0,0];
 let longest=0;
 for(const card of pilot){
  distribution[card.answer]++;
  assert.equal(card.choices.length,3,card.id);
  assert.equal(new Set(Array.from(card.choices)).size,3,card.id+' duplicate option');
  assert.ok(card.question.length>=24,card.id+' question too short');
  assert.ok(card.why.length>=90,card.id+' explanation needs more context');
  assert.ok(card.body.length>=95,card.id+' setup too thin');
  assert.ok(card.choices.every(x=>x.length>=25),card.id+' distractor is trivial');
  if(card.choices[card.answer].length>=Math.max(...card.choices.map(x=>x.length)))longest++;
  const meta=index.get('civic:'+card.id);
  assert.ok(meta,card.id+' missing editorial metadata');
  assert.equal(meta.status,'pending_external_review','automated tests do not constitute external review');
  assert.deepEqual(Array.from(card.sources,s=>s.url),meta.source_urls,card.id+' source mismatch');
 }
 assert.deepEqual(distribution,[4,4,4]);
 assert.ok(longest<=3,'pilot still signals answer by length in too many questions');
});
