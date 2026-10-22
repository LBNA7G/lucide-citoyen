import { readFileSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
const must = ['index.html','styles.css','app.js','curriculum-beta.js','civic-pack-01.js','party-directory-01.js','essentials-pack-02.js','world-pack-03.js','life-pack-04.js','public-pack-05.js','sw.js','manifest.webmanifest','icon.svg','vercel.json','README.md','package.json'];
for (const name of must) {if(!existsSync(name)) throw new Error(`Fichier manquant : ${name}`);}
for (const js of ['app.js','curriculum-beta.js','civic-pack-01.js','party-directory-01.js','essentials-pack-02.js','world-pack-03.js','life-pack-04.js','public-pack-05.js','sw.js','api/coach.js','api/news.js']) execFileSync(process.execPath, ['--check',js]);
JSON.parse(readFileSync('manifest.webmanifest','utf8'));
JSON.parse(readFileSync('vercel.json','utf8'));
JSON.parse(readFileSync('package.json','utf8'));
const html=readFileSync('index.html','utf8');
const app=readFileSync('app.js','utf8');
const worker=readFileSync('sw.js','utf8');
for (const link of ['styles.css?v=15','curriculum-beta.js?v=15','civic-pack-01.js?v=15','party-directory-01.js?v=15','essentials-pack-02.js?v=15','world-pack-03.js?v=15','life-pack-04.js?v=15','public-pack-05.js?v=15','app.js?v=15','manifest.webmanifest','icon.svg']) {if(!html.includes(link))throw new Error(`Référence manquante dans index.html : ${link}`);}
for (const feature of ['function rights()', 'function renderRightsCards(items)', 'function applyTheme()', 'function updateTheme(choice)', 'function journeys()', 'function reviewPage()', 'function editorialPage()', 'function publicHub()', 'function civicSchool()', 'function politicalDossiers()', 'function essentialSchool()', 'function queueReview(id)', 'function onboarding()', 'function interestsScreen()', 'function recommendedLesson()', 'function explore()', 'function practice()', 'function cases()', 'function dictionary()', 'function analyze(text)','function vigie()', 'case \'declic\':', 'case \'dico\':']) {if(!app.includes(feature)) throw new Error(`Fonction manquante : ${feature}`);}
for (const resource of ['./styles.css?v=15','./curriculum-beta.js?v=15','./civic-pack-01.js?v=15','./party-directory-01.js?v=15','./essentials-pack-02.js?v=15','./world-pack-03.js?v=15','./life-pack-04.js?v=15','./public-pack-05.js?v=15','./app.js?v=15']) {if(!worker.includes(resource)) throw new Error(`Ressource du cache hors ligne manquante : ${resource}`);}
for (const domain of ['studentatwork.be','senate.be','service-public.fr']) {if(!app.includes(domain))throw new Error(`Source institutionnelle manquante : ${domain}`);}
for(const fragment of ['interestsDone:false','name="interests"','skip-interests','edit-interests','interests-form','interests-count']) if(!app.includes(fragment)) throw new Error('Personnalisation absente : '+fragment);
JSON.parse(readFileSync('content/editorial-registry.json','utf8'));
for(const entry of ['data-theme-option','data-theme','theme-quick','prefers-color-scheme']){const input=entry==='data-theme-option'?app:entry==='theme-quick'||entry==='prefers-color-scheme'?html:readFileSync('styles.css','utf8');if(!input.includes(entry))throw new Error('Thème manquant : '+entry);}
console.log('SAVRÉO 1.5 bêta · structure, thèmes et contenus contrôlés statiquement.');

for(const route of ['api/coach.js','api/news.js']) if(!existsSync(route)) throw new Error('Route API manquante : '+route);