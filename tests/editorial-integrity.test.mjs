import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';

const registry=JSON.parse(readFileSync('content/editorial-registry.json','utf8'));
const index=new Map(registry.items.map(entry=>[entry.id,entry]));
const sourceFiles=[
  ['curriculum-beta.js','SAVREO_BETA'],
  ['civic-pack-01.js','SAVREO_CIVIC'],
  ['essentials-pack-02.js','SAVREO_ESSENTIALS'],
  ['world-pack-03.js','SAVREO_WORLD'],
  ['life-pack-04.js','SAVREO_LIFE'],
  ['public-pack-05.js','SAVREO_PUBLIC']
];
const load=(path,key)=>{
  const context={window:{}};
  vm.runInNewContext(readFileSync(path,'utf8'),context,{timeout:2000,filename:path});
  assert.ok(context.window[key],path+' missing '+key);
  return context.window[key];
};
const sources=[];
for(const [file,key] of sourceFiles){
  const pack=load(file,key);
  for(const x of pack.cards||[])sources.push(['civic:'+x.id,x.sources]);
  for(const x of pack.scenarios||[])sources.push(['case:'+x.id,x.source]);
  for(const x of pack.lessons||[])sources.push(['lesson:'+x.id,x.sources]);
  for(const x of pack.items||[])sources.push(['essential:'+x.id,x.sources]);
}
const toUrl=x=>Array.isArray(x)?x[1]:x?.url;
const isGeneric=url=>{
  try{
    const path=new URL(url).pathname;
    return ['/', '/fr','/fr/','/index.html','/fr/accueil'].includes(path);
  }catch{return true;}
};

test('all 240 entries have unique identifiers and transparent status',()=>{
  assert.equal(registry.items.length,240);
  assert.equal(index.size,registry.items.length,'duplicate catalog item');
  for(const entry of registry.items){
    assert.ok(entry.id?.includes(':'),'invalid ID');
    assert.ok(Array.isArray(entry.source_urls)&&entry.source_urls.length>0,entry.id+' missing source');
    for(const url of entry.source_urls)assert.match(url,/^https:\/\S+$/,entry.id+' invalid source URL');
    assert.ok(['draft','pending_external_review','reviewed','needs_correction','archived'].includes(entry.status),entry.id+' invalid status');
    if(entry.status==='reviewed'){
      assert.ok(entry.reviewed_at&&entry.reviewer_role,entry.id+' cannot be reviewed without proof of review');
      assert.ok(entry.source_urls.some(url=>!isGeneric(url)),entry.id+' cannot be certified from generic-only homepages');
    }
  }
});

test('215 modular units have registry records with exactly matching source URLs',()=>{
  assert.equal(sources.length,215);
  assert.equal(new Set(sources.map(([id])=>id)).size,sources.length,'duplicate modular ID');
  for(const [id,links] of sources){
    const record=index.get(id);
    assert.ok(record,'missing editorial registry: '+id);
    const urls=links.map(toUrl);
    assert.deepEqual(urls,record.source_urls,'outdated source in registry: '+id);
  }
});

test('political source is never treated as a verified neutral endorsement',()=>{
  const file=readFileSync('party-directory-01.js','utf8');
  const context={window:{}};
  vm.runInNewContext(file,context,{timeout:2000});
  const data=context.window.SAVREO_PARTIES;
  assert.equal(data.noPoliticalProfiling,true);
  assert.equal(data.completeCoverage,false);
  for(const party of data.parties){
    assert.equal(party.reviewStatus,'pending_external_review');
    assert.equal(party.courtCases,null);
    assert.equal(party.financialScore,null);
    assert.equal(party.leader,null);
  }
});

test('generic homepage links are measurable but never mistaken for final validation',()=>{
  const urls=registry.items.flatMap(entry=>entry.source_urls);
  const generic=urls.filter(isGeneric);
  assert.ok(generic.length>0,'generic links should not be silently treated as deep citation');
  assert.equal(registry.items.filter(x=>x.status==='reviewed').length,0,'no independent expert review has been completed');
  // Report a warning (not a hard failure) so additions with valid provenance are not blocked.
  process.stdout.write('EDITORIAL SOURCE AUDIT: '+generic.length+'/'+urls.length+' links generic; source-specific expert review outstanding.\n');
});
