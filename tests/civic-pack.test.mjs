import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
const context={window:{}};
vm.runInNewContext(readFileSync('civic-pack-01.js','utf8'),context,{timeout:1000});
const pack=context.window.SAVREO_CIVIC;
const registry=JSON.parse(readFileSync('content/editorial-registry.json','utf8'));
const officialIds=new Set(registry.items.map(x=>x.id));
test('a first offline civic lot of 24 uniquely sourced exercises covers both jurisdictions',()=>{
  assert.equal(pack.cards.length,24);
  assert.equal(new Set(pack.cards.map(x=>x.id)).size,24);
  for(const country of ['BE','FR'])assert.equal(pack.cards.filter(x=>x.country==='ALL'||x.country===country).length,16);
  for(const c of pack.cards){
    assert.ok(officialIds.has('civic:'+c.id),'Missing registry entry '+c.id);
    assert.ok(['ALL','BE','FR'].includes(c.country));
    assert.ok(c.title.length>8 && c.question.length>10 && c.body.length>35 && c.why.length>30);
    assert.equal(c.choices.length,3);
    assert.ok(Number.isInteger(c.answer)&&c.answer>=0&&c.answer<3);
    assert.ok(c.sources.length>=1);
    for(const link of c.sources)assert.match(link.url,/^https:\/\S+/);
    assert.equal(c.status,'pending_external_review');
    const r=registry.items.find(x=>x.id==='civic:'+c.id);
    assert.equal(r.status,'pending_external_review');
  }
});
test('dated public-decision examples are clearly labeled as archives, not current live law',()=>{
  assert.equal(pack.snapshots.length,2);
  for(const x of pack.snapshots){
    assert.match(x.date,/^\d{4}-\d\d-\d\d$/);
    assert.ok(x.scope&&x.type&&x.verification&&x.summary);
    assert.match(x.source.url,/^https:\/\//);
    assert.ok(!/confirmed effective law|condamnation definitive/i.test(x.type));
  }
  assert.ok(pack.localSources.BE.some(x=>x.url.includes('mons.be')));
  assert.ok(pack.localSources.FR.some(x=>x.url.includes('paris.fr')));
});
