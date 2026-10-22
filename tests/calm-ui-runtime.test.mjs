import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';

const code=readFileSync('app.js','utf8');
const curriculumCode=readFileSync('curriculum-beta.js','utf8');
const civicCode=readFileSync('civic-pack-01.js','utf8');
const essentialCode=readFileSync('essentials-pack-02.js','utf8');
const partyCode=readFileSync('party-directory-01.js','utf8');
const worldCode=readFileSync('world-pack-03.js','utf8');
const lifeCode=readFileSync('life-pack-04.js','utf8');
const publicCode=readFileSync('public-pack-05.js','utf8');

function mount(route='accueil',theme='light',profileComplete=true,ageGroup='16-20',interests=[],extraState={}){
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
  const state={firstName:'Lina',ageGroup,country:'BE',theme,interests,interestsDone:profileComplete,onboardingDone:profileComplete,...extraState};
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
  vm.runInNewContext(civicCode,context,{timeout:1500,filename:'civic-pack-01.js'});
  vm.runInNewContext(essentialCode,context,{timeout:1500,filename:'essentials-pack-02.js'});
  vm.runInNewContext(partyCode,context,{timeout:1500,filename:'party-directory-01.js'});
  vm.runInNewContext(worldCode,context,{timeout:1500,filename:'world-pack-03.js'});
  vm.runInNewContext(lifeCode,context,{timeout:1500,filename:'life-pack-04.js'});
  vm.runInNewContext(publicCode,context,{timeout:1500,filename:'public-pack-05.js'});
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
   vigie:['calm-feed-primary','Limites du radar'],
   'vie-publique':['civic-spotlight','Apprendre à voter','Notre méthode de neutralité'],
   civique:['civic-question','Vérifier ma réponse','Parcourir les 16 notions'],
   dossiers:['party-library','Résultats, budgets et organismes de contrôle'],
   essentiels:['civic-question','Parcourir les 176 savoirs']
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

test('simulation and lesson retain XP, review scheduling and answer feedback across rerenders',()=>{
 const screen=mount('declic','light',true,'12-15');
 const click=screen.handlers.get('click');
 const selectedCase={dataset:{case:'beta-photo'},closest(selector){return selector==='[data-case]'?this:null}};
 click({target:selectedCase});
 assert.ok(screen.document.getElementById('main').innerHTML.includes("Une photo de toi circule"));
 const selectAnswer={dataset:{caseChoice:'1'},closest(selector){return selector==='[data-case-choice]'?this:null}};
 click({target:selectAnswer});
 click({target:{id:'case-submit',closest(){return null}}});
 const stateAfter=JSON.parse(screen.store.value);
 assert.ok(stateAfter.completed.includes('case:beta-photo'));
 assert.ok(stateAfter.xp>=30);
 assert.ok(screen.document.getElementById('main').innerHTML.includes('Une publication peut exposer la vie privée'));

 const lesson=mount('lecon/info-context','light',true,'12-15');
 const submit=lesson.handlers.get('submit');
 submit({
   target:{id:'lesson-quiz',querySelector(){return {value:'0'};}},
   preventDefault(){}
 });
 const after=JSON.parse(lesson.store.value);
 assert.ok(after.completed.includes('lesson:info-context'));
 assert.ok(after.reviews['info-context']);
 assert.match(lesson.document.getElementById('main').innerHTML,/Bonne réponse/);
});

test('a wrong answer shows the actual correct choice in the feedback',()=>{
 const quiz=mount('lecon/info-context','light',true,'12-15');
 quiz.handlers.get('submit')({target:{id:'lesson-quiz',querySelector(){return {value:'2'};}},preventDefault(){}});
 assert.ok(quiz.document.getElementById('main').innerHTML.includes('La bonne réponse est :'));
 const state=JSON.parse(quiz.store.value);
 assert.ok(!(state.completed||[]).includes('lesson:info-context'));
});

test('civic lesson remains neutral and stores a correct answer locally',()=>{
 const screen=mount('civique','light',true,'16-20');
 assert.ok(screen.html.includes('promesse')||screen.html.includes('budget')||screen.html.includes('programme'));
 const click=screen.handlers.get('click');
 const choice={dataset:{civicChoice:'1'},closest(selector){return selector==='[data-civic-choice]'?this:null}};
 click({target:choice});
 const check={id:'civic-check',closest(){return null}};
 click({target:check});
 const displayed=screen.document.getElementById('main').innerHTML;
 assert.ok(displayed.includes('feedback'));
 assert.ok(displayed.includes('Lire les sources'));
 const next={id:'civic-next',closest(){return null}};
 click({target:next});
 assert.ok(!screen.document.getElementById('main').innerHTML.includes('Lire les sources'));
});
test('Belgian and French civic libraries have the same baseline topic count',()=>{
 for(const country of ['BE','FR']){
  const s=mount('civique');
  const button={dataset:{country},closest(selector){return selector==='[data-country]'?this:null}};
  s.handlers.get('click')({target:button});
  assert.ok(s.document.getElementById('main').innerHTML.includes('Parcourir les 16 notions'));
 }
});

test('32 new essential lessons unlock locally, retain explanations and support all ages',()=>{
 for(const age of ['12-15','16-20','21-28']){
   const sample=mount('essentiels','light',true,age);
   assert.ok(sample.html.includes('Parcourir les 176 savoirs'));
   assert.ok(sample.html.includes('Vérifier ma réponse'));
 }
 const screen=mount('essentiels');
 const click=screen.handlers.get('click');
 const choose={dataset:{essentialId:'ess-01'},closest(q){return q==='[data-essential-id]'?this:null}};
 click({target:choose});
 const option={dataset:{essentialChoice:'0'},closest(q){return q==='[data-essential-choice]'?this:null}};
 click({target:option});
 click({target:{id:'essential-check',closest(){return null}}});
 const data=JSON.parse(screen.store.value);
 assert.ok((data.completed||[]).includes('essential:ess-01'));
 assert.ok(screen.document.getElementById('main').innerHTML.includes('Sources et approfondissement'));
 assert.ok(JSON.parse(screen.store.value).microReviews['ess-01']?.due);
});

test('party catalogue attributes documents, with no election ranking',()=>{
 const be=mount('dossiers');
 assert.ok(be.html.includes('12 dossiers documentaires'));
 assert.ok(be.html.includes('Bureau fédéral du Plan'));
 assert.ok(be.html.includes('party-record'));
 assert.ok(!be.html.includes('meilleur parti'));
 const select={dataset:{country:'FR'},closest(q){return q==='[data-country]'?this:null}};
 be.handlers.get('click')({target:select});
 assert.ok(be.document.getElementById('main').innerHTML.includes('5 dossiers documentaires'));
 assert.match(be.document.getElementById('main').innerHTML,/(non exhaustif|pas une liste exhaustive)/);
});

test('176 micro-lessons stay accessible and age catalogues are not electoral profiling',()=>{
 const screen=mount('essentiels','light',true,'12-15');
 assert.ok(screen.html.includes('Parcourir les 176 savoirs'));
 assert.ok(screen.html.includes('59 fiches proposées'));
 const age={dataset:{essentialAge:'21-28'},closest(q){return q==='[data-essential-age]'?this:null}};
 screen.handlers.get('click')({target:age});
 assert.ok(screen.document.getElementById('main').innerHTML.includes('58 fiches proposées'));
 const choose={dataset:{essentialId:'world-48'},closest(q){return q==='[data-essential-id]'?this:null}};
 screen.handlers.get('click')({target:choose});
 assert.ok(screen.document.getElementById('main').innerHTML.includes('Faire évoluer son avis'));
});

test('after completing a micro-lesson, the next lesson is an unseen one',()=>{
 const screen=mount('essentiels','light',true,'12-15');
 const click=screen.handlers.get('click');
 const current={dataset:{essentialId:'ess-01'},closest(q){return q==='[data-essential-id]'?this:null}};
 click({target:current});
 click({target:{dataset:{essentialChoice:'0'},closest(q){return q==='[data-essential-choice]'?this:null}}});
 click({target:{id:'essential-check',closest(){return null}}});
 const after=JSON.parse(screen.store.value);
 assert.ok(after.microReviews['ess-01'].due,'first review was not scheduled');
 click({target:{id:'essential-next',closest(){return null}}});
 const html=screen.document.getElementById('main').innerHTML;
 assert.ok(html.includes('Une publicité ressemble à un conseil'),'expected an unseen next lesson');
});

test('review screen presents only three urgent items before an expandable backlog',()=>{
 const due={};for(let n=1;n<=10;n++)due['ess-'+String(n).padStart(2,'0')]={due:'2020-01-01',stage:0,attempts:1};
 const screen=mount('reviser','light',true,'12-15',[],{microReviews:due});
 assert.ok(screen.html.includes('10</strong>'),'due count should include all ten');
 assert.ok(screen.html.includes('Voir 7 autres révisions'),'remaining reviews should be collapsible');
 assert.ok(screen.html.includes('data-micro-review="ess-01"'),'first review must still be actionable');
});

test('civic source provenance is visible before any quiz answer and remains candid about review',()=>{
 const screen=mount('civique');
 const html=screen.document.getElementById('main').innerHTML;
 assert.ok(html.includes('Lire les sources et leur fiabilité'));
 assert.ok(html.includes('Relecture indépendante'));
 assert.ok(html.includes('non réalisée'));
 assert.ok(html.includes('Édition 2026-10-22'));
 const click=screen.handlers.get('click');
 click({target:{dataset:{civicId:'be-16-europe'},closest(sel){return sel==='[data-civic-id]'?this:null;}}});
 const next=screen.document.getElementById('main').innerHTML;
 assert.ok(next.includes('règles du prochain scrutin'),'outdated election rules must have a date caveat');
 assert.ok(next.includes('elections.fgov.be'));
});

test('territorial source filters reveal only the selected level and preserve expansion',()=>{
 const screen=mount('vie-publique');
 assert.ok(screen.html.includes('Tous les niveaux'));
 assert.ok(screen.html.includes('PUBLICATION À DÉCRYPTER'));
 assert.ok(screen.html.includes('Archives')||screen.html.includes('ARCHIVE'));
 const click=screen.handlers.get('click');
 const choose={dataset:{publicScope:'local'},closest(sel){return sel==='[data-public-scope]'?this:null;}};
 click({target:choose});
 const selected=screen.document.getElementById('main').innerHTML;
 assert.ok(selected.includes('Commune de Brugelette'));
 assert.ok(selected.includes('Ville de Mons'));
 assert.ok(!selected.includes('href="https://news.belgium.be/fr"'));
 assert.ok(selected.includes('class="calm-disclosure" open'));
 const country={dataset:{country:'FR'},closest(sel){return sel==='[data-country]'?this:null;}};
 click({target:country});
 const french=screen.document.getElementById('main').innerHTML;
 assert.ok(french.includes('Tous les niveaux'));
 assert.ok(french.includes('Ville de Paris'));
 assert.ok(!french.includes('Commune de Brugelette'));
});

test('essential learning reveals provenance before submitting any choice',()=>{
 const screen=mount('essentiels','light',true,'16-20');
 const html=screen.html;
 assert.ok(html.includes('Sources et approfondissement'));
 assert.ok(html.includes('simulation pédagogique'));
 assert.ok(html.includes('Relecture indépendante'));
 assert.ok(html.includes('non réalisée'));
 assert.ok(html.includes('civic-proof'));
 assert.ok(html.includes('Vérifier ma réponse'));
});
