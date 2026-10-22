import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const app=readFileSync('app.js','utf8');
const registry=JSON.parse(readFileSync('content/editorial-registry.json','utf8'));
const entries=registry.items;

test('each content entry has an ID, status and jurisdiction',()=>{
  assert.equal(entries.length,new Set(entries.map(item=>item.id)).size,'duplicate content IDs');
  for(const e of entries){
    assert.ok(e.id&&e.kind&&e.country,'missing metadata');
    assert.ok(['BE','FR','ALL'].includes(e.country),'unknown jurisdiction '+e.id);
    assert.ok(['pending_external_review','approved','needs_update','archived'].includes(e.status),'invalid review status');
    assert.ok(Array.isArray(e.source_urls),'no source list '+e.id);
    for(const url of e.source_urls)assert.match(url,/^https:\/\//,'non HTTPS source '+e.id);
    if(e.status==='approved'){
      assert.ok(e.reviewed_at && e.reviewer && e.next_review_at,'approved content missing review evidence: '+e.id);
      assert.ok(e.source_urls.length>0,'approved content requires sources: '+e.id);
    }
  }
});

test('all scenarios, lessons and legal rights are in the editorial registry',()=>{
  const ids=new Set(entries.map(e=>e.id));
  const scenarioBlock=app.slice(app.indexOf('const scenarios = ['),app.indexOf('const words = ['));
  const caseIds=[...scenarioBlock.matchAll(/\{id:'([^']+)',country:'[^']+',category:/g)].map(m=>'case:'+m[1]);
  const lessonsBlock=app.slice(app.indexOf('const lessons = ['),app.indexOf('const debates=['));
  const lessonIds=[...lessonsBlock.matchAll(/\{id:'([^']+)',icon:/g)].map(m=>'lesson:'+m[1]);
  for(const id of [...caseIds,...lessonIds]) assert.ok(ids.has(id),'unregistered '+id);
  assert.equal(entries.filter(e=>e.kind==='legal_right' && e.country==='BE').length,5);
  assert.equal(entries.filter(e=>e.kind==='legal_right' && e.country==='FR').length,5);
});

test('journeys, spaced review and privacy affordances remain present',()=>{
  for(const feature of ['function journeys()','function reviewPage()','function editorialPage()','function queueReview(id)','function recordReview(id,correct)','reviews:{}','journeyDebates:[]','id="clear-progress"','id="export-progress"']){
    assert.ok(app.includes(feature),'feature missing: '+feature);
  }
});
