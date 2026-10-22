import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';

function boot(profile=false,route='accueil'){
 const nodes=new Map(),handlers=new Map();
 const el=id=>{if(!nodes.has(id))nodes.set(id,{id,innerHTML:'',textContent:'',title:'',classList:{add(){},remove(){},toggle(){}},setAttribute(){}});return nodes.get(id);};
 const document={documentElement:{dataset:{},style:{}},body:{classList:{add(){},remove(){}}},getElementById:el,querySelectorAll(){return []},querySelector(s){return s.includes('theme-color')?{setAttribute(){}}:null},addEventListener(n,cb){handlers.set(n,cb)}};
 const stored={value:JSON.stringify({country:'BE',theme:'light',ageGroup:'16-20',firstName:'Sam',onboardingDone:profile,interestsDone:profile})};
 const localStorage={getItem(){return stored.value},setItem(_,v){stored.value=v}};
 const location={hash:'#'+route,protocol:'https:',href:'https://example.org/#'+route};
 const window={location,matchMedia(){return{matches:false,addEventListener(){}}},addEventListener(n,cb){handlers.set(n,cb)},scrollTo(){}};
 const ctx={window,document,location,localStorage,navigator:{},URL,Blob,setTimeout,clearTimeout,console,confirm(){return false}};
 for(const file of ['curriculum-beta.js','civic-pack-01.js','essentials-pack-02.js','party-directory-01.js','world-pack-03.js','life-pack-04.js','public-pack-05.js','app.js'])vm.runInNewContext(readFileSync(file,'utf8'),ctx,{timeout:1500});
 return {get html(){return el('main').innerHTML},click:handlers.get('click'),state(){return JSON.parse(stored.value)}};
}
function event(id='',data={},selector=''){
 return {target:{id,dataset:data,closest(s){return selector===s?this:null}}};
}
test('a first Declic works before giving a name, without points',()=>{
 const app=boot(false);
 assert.match(app.html,/onboarding-form/);
 assert.match(app.html,/guest-start/);
 app.click(event('guest-start'));
 assert.match(app.html,/guest-check/);
 app.click(event('',{guestChoice:'1'},'[data-guest-choice]'));
 app.click(event('guest-check'));
 assert.match(app.html,/Premier Déclic réussi/);
 assert.equal(app.state().xp,0);
 app.click(event('guest-join'));
 assert.match(app.html,/onboarding-form/);
});
test('transfer exercise marks new-context application once, without more XP',()=>{
 const app=boot(true,'declic');
 app.click(event('',{case:'both-video'},'[data-case]'));
 app.click(event('',{caseChoice:'1'},'[data-case-choice]'));
 app.click(event('case-submit'));
 assert.match(app.html,/DÉFI BONUS/);
 const before=app.state();
 assert.equal(before.transferPassed.length,0);
 app.click(event('',{transferChoice:'0'},'[data-transfer-choice]'));
 app.click(event('transfer-check'));
 assert.deepEqual([...app.state().transferPassed],['both-video']);
 assert.equal(app.state().xp,before.xp);
 assert.match(app.html,/Réflexe appliqué dans un nouveau cas/);
});
test('Vigie identifies local documentary sources as distinct from live RSS',()=>{
 const app=boot(true,'vigie');
 assert.match(app.html,/Région et commune/);
 assert.match(app.html,/Mons/);
 assert.match(app.html,/non intégrés au flux RSS/);
});
test('oral option is not an audio recording and does not require voice API',()=>{
 const app=boot(true,'debattre');
 assert.match(app.html,/sans enregistrement/);
 assert.match(app.html,/start-oral-40/);
});
test('deep-link targets an existing non-partisan Declic only',()=>{
 const app=boot(true,'declic/both-video');
 assert.match(app.html,/2 millions de vues/);
 assert.match(app.html,/Partager ce défi sans mes données|Vérifier mon réflexe/);
});

test('first-run microsteps separate name, age and optional gender',()=>{
 const app=boot(false);
 assert.match(app.html,/Question 1 sur 3/);
 assert.match(app.html,/quick-firstname/);
 assert.doesNotMatch(app.html,/name="ageGroup"/);
 assert.doesNotMatch(app.html,/name="gender"/);
 assert.match(app.html,/guest-start/);
 app.click(event('onboarding-skip-name'));
 assert.match(app.html,/Question 2 sur 3/);
 assert.match(app.html,/name="ageGroup"/);
 assert.doesNotMatch(app.html,/name="gender"/);
 app.click(event('onboarding-back'));
 assert.match(app.html,/Question 1 sur 3/);
});
