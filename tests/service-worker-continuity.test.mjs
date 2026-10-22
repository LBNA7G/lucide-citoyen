import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const sw=readFileSync('sw.js','utf8');
const html=readFileSync('index.html','utf8');
test('SW update is staged without forcefully replacing a worker in an active tab',()=>{
 assert.match(sw,/cache\.addAll\(ASSETS\)/);
 assert.doesNotMatch(sw,/self\.skipWaiting\s*\(/,'skipWaiting forces an unsafe runtime switch');
 assert.doesNotMatch(sw,/self\.clients\.claim\s*\(/,'clients.claim can take over pages mid-session');
 assert.match(sw,/slice\(0,2\)/);
 assert.match(sw,/caches\.match\(req\)/);
 assert.match(sw,/url\.pathname\.startsWith\('\/api\/'\)/);
});
test('critical frontend dependencies are precached using matching versions',()=>{
 const version=html.match(/styles\.css\?v=(\d+)/)?.[1];
 assert.ok(version);
 for(const path of ['styles.css','app.js','curriculum-beta.js','civic-pack-01.js']){
  assert.ok(sw.includes(path+'?v='+version),path+' missing from cache');
 }
});
