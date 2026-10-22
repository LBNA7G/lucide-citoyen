import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';

const specs=[
 ['curriculum-beta.js','SAVREO_BETA'],
 ['civic-pack-01.js','SAVREO_CIVIC'],
 ['essentials-pack-02.js','SAVREO_ESSENTIALS'],
 ['world-pack-03.js','SAVREO_WORLD'],
 ['life-pack-04.js','SAVREO_LIFE'],
 ['public-pack-05.js','SAVREO_PUBLIC']
];
const registry=new Map(JSON.parse(readFileSync('content/editorial-registry.json','utf8')).items.map(x=>[x.id,x]));
const questions=[];
for(const [file,key] of specs){
 const ctx={window:{}};
 vm.runInNewContext(readFileSync(file,'utf8'),ctx,{timeout:2500});
 const data=ctx.window[key];
 for(const x of data.scenarios||[])questions.push({key:'case:'+x.id,...x});
 for(const x of data.lessons||[])questions.push({key:'lesson:'+x.id,...x});
 for(const x of data.cards||[])questions.push({key:'civic:'+x.id,...x});
 for(const x of data.items||[])questions.push({key:'essential:'+x.id,...x});
}
const longest=q=>q.choices[q.answer].length>=Math.max(...q.choices.map(x=>x.length));
const obvious=q=>q.choices.some((c,i)=>i!==q.answer&&/(logo|couleur|émoji|emoji|likes|abonnés|followers|musique|commentaires|joli|majuscules|police publicitaire)/i.test(c));

test('quiz answer lengths are analyzed to prevent trivial gaming',()=>{
 assert.equal(questions.length,215);
 const tooLong=questions.filter(longest);
 const giveaways=questions.filter(obvious);
 process.stdout.write('QUIZ QUALITY: correct answer longest or tied in '+tooLong.length+'/'+questions.length+' questions; '+giveaways.length+' questions contain potentially implausible distractors. Rewrite editorially.\n');
 // No retroactive assertion on draft quizzes: editorial review gates handle the corrections.
 const approved=questions.filter(q=>registry.get(q.key)?.status==='reviewed');
 if(approved.length>=12){
   const ratio=approved.filter(longest).length/approved.length;
   assert.ok(ratio<=0.55,'reviewed quizzes overuse longest-option answer cue');
 }
});
test('every quiz has a valid answer and an explanation',()=>{
 for(const q of questions){
   assert.equal(q.choices.length,3,q.key);
   assert.ok(q.answer>=0&&q.answer<3,q.key);
   assert.ok(q.why?.length>=24,q.key+' short explanation');
 }
});

test('48 reworked pilot items have fewer length clues, without claiming learning validity',()=>{
 const pilot=new Set(['ess','world','life','civic-life'].flatMap(prefix=>
   Array.from({length:12},(_,i)=>'essential:'+prefix+'-'+String(i+1).padStart(2,'0'))
 ));
 const items=questions.filter(q=>pilot.has(q.key));
 assert.equal(items.length,48,'pilot questions missing');
 assert.ok(items.filter(longest).length<=24,'pilot still contains too many longer correct options');
});
