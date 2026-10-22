import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';

const code=readFileSync('app.js','utf8');
const curriculumCode=readFileSync('curriculum-beta.js','utf8');

function mount(route='accueil',theme='light',profileComplete=true,ageGroup='16-20',interests=[]){
  const nodes=new Map(), handlers=new Map();
  function node(id){
    if(!nodes.has(id))nodes.set(id,{id,innerHTML:'',textContent:'',title:'',classList:{add(){},remove(){},toggle(){}},setAttribute(){}});
    return nodes.get(id);
  }
  const meta={setAttribute(){}};
  const document={
    documentElement:{dataset:{},style:{}},
    body:{classList:{add(){},remove(){}}},
    getElementById:node,
    querySelectorAll(){return [];},
    querySelector(selector){return selector.includes('theme-color')?meta:null;},
    addEventListener(name,cb){handlers.set(name,cb);}
  };
  const state={firstName:'Lina',ageGroup,country:'BE',theme,interests,interestsDone:profileComplete,onboardingDone:profileComplete};
  const stored={value:JSON.stringify(state)};
  const localStorage={getItem(){return stored.value},setItem(_,v){stored.value=v}};
  const window={
    matchMedia(){return {matches:false,addEventListener(){}};},
    addEventListener(name,cb){handlers.set(name,cb);},
    scrollTo(){}
  };
  const location={hash:'#'+route,protocol:'https:'};
  const context={window,document,navigator:{},location,localStorage,console,setTimeout,clearTimeout,URL,Blob,confirm(){return false}};
  vm.runInNewContext(curriculumCode,context,{timeout:1500,filename:'curriculum-beta.js'});
  vm.runInNewContext(code,context,{timeout:1500,filename:'app.js'});
  return {html:node('main').innerHTML,root:document.documentElement,handlers,store:stored,window,document};
}

test('Calm UI renders each main page in a fake browser DOM without throwing',()=>{
 const expected={
   accueil:['calm-greeting','calm-feature','Continuer'],
   explorer:['calm-menu','Situations de la vie','Autres ressources'],
   pratiquer:['calm-menu','Mes parcours','Mes missions du jour'],
   droits:['calm-rights','right-entry','Rechercher un sujet'],
   profil:['theme-selector','calm-country-picker','Historique et points'],
   parcours:['calm-journey-card','Découvrir les autres parcours'],
   reviser:['révision','Aucune révision'],
   apprendre:['calm-lesson-card','Voir toutes les leçons'],
   'lecon/penser':['calm-reading','lesson-quiz','Exemples et détails'],
   sources:['calm-source-point','Consulter les institutions'],
   vigie:['calm-feed-primary','Limites du radar']
 };
 for(const [route,markers] of Object.entries(expected)){
   const {html,root}=mount(route);
   assert.equal(root.dataset.theme,'light',route+' theme');
   for(const marker of markers)assert.ok(html.includes(marker),route+' missing '+marker);
 }
});

test('automatically chosen dark theme and first-launch switch are operational',()=>{
 const initial=mount('accueil','auto');
 assert.equal(initial.root.dataset.theme,'light');
 const first=mount('accueil','light',false);
 assert.ok(first.html.includes('onboarding-form'));
 assert.ok(first.html.includes('theme-entry'));
 const click=first.handlers.get('click');
 const entry={id:'theme-entry',closest(selector){return selector.includes('#theme-entry')?this:null}};
 click({target:entry});
 assert.equal(first.root.dataset.theme,'dark');
 assert.ok(JSON.parse(first.store.value).theme==='dark');
});

test('rights use closed detail panels and light/dark themes preserve content',()=>{
 for(const theme of ['light','dark']){
   const {html,root}=mount('droits',theme);
   assert.equal(root.dataset.theme,theme);
   assert.match(html,/<details class="right-entry">/);
   assert.match(html,/calm-country-context/);
   assert.doesNotMatch(html,/<details class="right-entry" open/);
 }
});


test('age-based curriculum is recommended but other materials stay accessible',()=>{
  for(const [group,label] of [['12-15','Ma photo, mon choix'],['16-20','Repérer un message de phishing'],['21-28','Visiter et vérifier avant de louer']]){
    const {html}=mount('apprendre','light',true,group);
    assert.ok(html.includes(label),group+' missing age-relevant recommendation');
    assert.ok(html.includes('Voir toutes les leçons (12)'),group+' incomplete lesson library');
    assert.ok(html.includes('Une opinion n’est pas un fait'),group+' legacy lesson inaccessible');
  }
  const {html}=mount('accueil','light',true,'16-20',['argent']);
  assert.ok(html.includes('Ton premier salaire')||html.includes('mot de passe')||html.includes('position'), 'age-related prompt missing');
});
test('beta scenarios are accessible across ages without filtering out other content',()=>{
 for(const group of ['12-15','16-20','21-28']){
   const {html}=mount('declic','light',true,group);
   assert.ok(html.includes('Explorer d’autres situations'));
   assert.ok(html.includes('beta'), 'unexpected missing beta marker in age '+group);
   assert.ok(html.includes('Tu dépasses 650 h'), 'old rights case should remain available');
 }
});
