import { readFileSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
const must = ['index.html','styles.css','app.js','sw.js','manifest.webmanifest','icon.svg','vercel.json','README.md'];
for (const name of must) {if(!existsSync(name)) throw new Error(`Fichier manquant : ${name}`);}
for (const js of ['app.js','sw.js']) execFileSync(process.execPath, ['--check',js]);
JSON.parse(readFileSync('manifest.webmanifest','utf8'));
JSON.parse(readFileSync('vercel.json','utf8'));
const html=readFileSync('index.html','utf8');
const app=readFileSync('app.js','utf8');
const worker=readFileSync('sw.js','utf8');
for (const link of ['styles.css?v=3','app.js?v=3','manifest.webmanifest','icon.svg']) {if(!html.includes(link))throw new Error(`Référence manquante dans index.html : ${link}`);}
for (const feature of ['function cases()', 'function dictionary()', 'function analyze(text)','function vigie()', 'case \'declic\':', 'case \'dico\':']) {if(!app.includes(feature)) throw new Error(`Fonction manquante : ${feature}`);}
for (const resource of ['./styles.css?v=3','./app.js?v=3']) {if(!worker.includes(resource)) throw new Error(`Ressource du cache hors ligne manquante : ${resource}`);}
for (const domain of ['studentatwork.be','senate.be','service-public.fr']) {if(!app.includes(domain))throw new Error(`Source institutionnelle manquante : ${domain}`);}
console.log('LUCIDE · contrôles de base réussis : 8 fichiers, 2 scripts, 2 JSON, routes, liens et cache.');