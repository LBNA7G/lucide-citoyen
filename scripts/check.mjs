import { readFileSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
const must = ['index.html','styles.css','app.js','sw.js','manifest.webmanifest','icon.svg','vercel.json','README.md','package.json'];
for (const name of must) {if(!existsSync(name)) throw new Error(`Fichier manquant : ${name}`);}
for (const js of ['app.js','sw.js','api/coach.js','api/news.js']) execFileSync(process.execPath, ['--check',js]);
JSON.parse(readFileSync('manifest.webmanifest','utf8'));
JSON.parse(readFileSync('vercel.json','utf8'));
JSON.parse(readFileSync('package.json','utf8'));
const html=readFileSync('index.html','utf8');
const app=readFileSync('app.js','utf8');
const worker=readFileSync('sw.js','utf8');
for (const link of ['styles.css?v=7','app.js?v=7','manifest.webmanifest','icon.svg']) {if(!html.includes(link))throw new Error(`Référence manquante dans index.html : ${link}`);}
for (const feature of ['function onboarding()', 'function interestsScreen()', 'function recommendedLesson()', 'function explore()', 'function practice()', 'function cases()', 'function dictionary()', 'function analyze(text)','function vigie()', 'case \'declic\':', 'case \'dico\':']) {if(!app.includes(feature)) throw new Error(`Fonction manquante : ${feature}`);}
for (const resource of ['./styles.css?v=7','./app.js?v=7']) {if(!worker.includes(resource)) throw new Error(`Ressource du cache hors ligne manquante : ${resource}`);}
for (const domain of ['studentatwork.be','senate.be','service-public.fr']) {if(!app.includes(domain))throw new Error(`Source institutionnelle manquante : ${domain}`);}
for(const fragment of ['interestsDone:false','name="interests"','skip-interests','edit-interests','interests-form','interests-count']) if(!app.includes(fragment)) throw new Error('Personnalisation absente : '+fragment);
console.log('SAVRÉO · contrôles statiques, préférences locales et routes API validés.');

for(const route of ['api/coach.js','api/news.js']) if(!existsSync(route)) throw new Error('Route API manquante : '+route);