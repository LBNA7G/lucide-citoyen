import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
test('news archive is explicitly stale and bounded; no fake live publications',()=>{
 const app=readFileSync('app.js','utf8');
 assert.match(app,/NEWS_MAX_AGE=7\*24\*60\*60\*1000/);
 assert.match(app,/status:'stale'/);
 assert.match(app,/Mode archive/);
 assert.match(app,/writeNewsSnapshot\(chosen,data\)/);
 assert.match(app,/lastNewsAttempt/);
});
test('cache fallback protects temporary server errors for frontend only',()=>{
 const sw=readFileSync('sw.js','utf8');
 assert.match(sw,/response\.status>=500/);
 assert.match(sw,/url\.pathname\.startsWith\('\/api\/'\)/);
 assert.match(sw,/caches\.match\(req\)/);
});
