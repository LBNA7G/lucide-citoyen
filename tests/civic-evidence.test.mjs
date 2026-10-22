import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';

const sandbox={window:{}};
vm.runInNewContext(readFileSync('civic-pack-01.js','utf8'),sandbox,{filename:'civic-pack-01.js',timeout:2000});
const d=sandbox.window.SAVREO_CIVIC;
const allCountries=['BE','FR'];

test('all 24 civic cards honestly report editing and external review state',()=>{
 assert.equal(d.cards.length,24);
 assert.equal(d.editorial.independentReviewCompleted,false);
 assert.equal(d.editorial.liveCoverage,false);
 for(const c of d.cards){
  assert.match(c.edition,/^\d{4}-\d{2}-\d{2}$/);
  assert.equal(c.editorialStatus,'pending_external_review');
  assert.ok(Array.isArray(c.sources)&&c.sources.length>=1);
  assert.ok(['ALL',...allCountries].includes(c.country));
 }
 assert.ok(d.cards.find(x=>x.id==='be-16-europe').freshnessWarning);
 assert.ok(d.cards.find(x=>x.id==='be-participation').freshnessWarning);
});
test('dated public items are archives, not claimed live or judicially approved',()=>{
 assert.equal(d.snapshots.length,2);
 for(const snap of d.snapshots){
  assert.equal(snap.editorialStatus,'pending_external_review');
  assert.equal(snap.isLive,false);
  assert.equal(snap.checkedAt,null);
  assert.ok(['annonce','archive_documentaire'].includes(snap.statusCategory));
  assert.match(snap.date,/^\d{4}-\d{2}-\d{2}$/);
  assert.ok(snap.verification.length>65);
 }
});
test('country source repositories include national, local and appropriate regional scopes',()=>{
 for(const country of allCountries){
  const sources=d.localSources[country];
  assert.ok(sources.length>=3);
  assert.ok(sources.some(x=>x.level==='national'));
  assert.ok(sources.some(x=>x.level==='local'));
  for(const x of sources){
   assert.ok(['national','regional','local'].includes(x.level));
   assert.equal(x.isLiveFeed,false);
   assert.equal(x.lastVerifiedAt,null);
   assert.match(x.url,/^https:\/\//);
  }
 }
 assert.ok(d.localSources.BE.some(x=>x.level==='regional'));
 assert.ok(d.localSources.BE.some(x=>x.scope==='Commune de Brugelette'&&x.isArchive));
});
