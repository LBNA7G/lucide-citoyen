import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
const packs=[
  ['essentials-pack-02.js','SAVREO_ESSENTIALS','ess-23','Étaler les frais périodiques'],
  ['life-pack-04.js','SAVREO_LIFE','life-39','Rassembler achat, échanges'],
  ['world-pack-03.js','SAVREO_WORLD','world-47','résultats, le contexte'],
  ['world-pack-03.js','SAVREO_WORLD','world-48','Réviser sa position'],
  ['public-pack-05.js','SAVREO_PUBLIC','civic-life-48','Comparer indicateurs, limites']
];
test('verified semantic choice index regression cases are not reversed',()=>{
  for(const [file,global,id,expected] of packs){
    const ctx={window:{}};
    vm.runInNewContext(readFileSync(file,'utf8'),ctx,{timeout:2000});
    const q=ctx.window[global].items.find(item=>item.id===id);
    assert.ok(q,id+' missing');
    assert.ok(q.choices[q.answer].includes(expected),id+' answer contradicts its explanation');
    assert.equal(q.choices.length,3,id+' bad option count');
  }
});
