import test from 'node:test';
import assert from 'node:assert/strict';
import health from '../api/health.js';
function makeRes(){return {statusCode:200,headers:{},body:null,setHeader(k,v){this.headers[k]=v;return this},status(v){this.statusCode=v;return this},json(d){this.body=d;return this}}}
test('health GET confirms technical endpoint only, without private data',()=>{
 const res=makeRes();health({method:'GET'},res);
 assert.equal(res.statusCode,200);
 assert.equal(res.body.status,'ok');
 assert.equal(res.body.service,'SAVRÉO');
 assert.match(res.headers['Cache-Control'],/no-store/);
 assert.ok(res.body.checkedAt);
 assert.deepEqual(Object.keys(res.body).sort(),['checkedAt','release','service','status']);
});
test('health endpoint has no write side effects',()=>{
 const res=makeRes();health({method:'POST'},res);assert.equal(res.statusCode,405);
});
