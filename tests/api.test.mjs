import test from 'node:test';
import assert from 'node:assert/strict';
import news, {parseFeed,clean} from '../api/news.js';
import coach from '../api/coach.js';
function res(){return {statusCode:200,headers:{},jsonBody:null,setHeader(k,v){this.headers[k]=v;return this},status(v){this.statusCode=v;return this},json(data){this.jsonBody=data;return this}};}
test('RSS: accepte un titre de source officielle et nettoie les balises',()=>{
 const feed={domain:'www.service-public.gouv.fr'};
 const xml=`<rss><channel><item><title><![CDATA[Une &amp; bonne nouvelle]]></title><link>https://www.service-public.gouv.fr/particuliers/actualites/A123</link><description><![CDATA[<b>Annonce</b> datée]]></description><pubDate>Thu, 22 Oct 2026 09:00:00 GMT</pubDate></item></channel></rss>`;
 const items=parseFeed(xml,feed);assert.equal(items.length,1);assert.equal(items[0].title,'Une & bonne nouvelle');assert.equal(items[0].summary,'Annonce datée');assert.equal(items[0].date,'2026-10-22');
});
test('RSS belge : titre source fédérale accepté',()=>{
 const xml='<rss><channel><item><title>Conseil des ministres</title><link>https://news.belgium.be/fr/conseil</link><description>Communiqué</description></item></channel></rss>';
 assert.equal(parseFeed(xml,{domain:'news.belgium.be'}).length,1);
});
test('RSS: rejette les redirections vers des domaines usurpés',()=>{
 const fake=`<rss><item><title>Faux</title><link>https://www.service-public.gouv.fr.evil.test/bad</link><description>Test</description></item></rss>`;
 assert.equal(parseFeed(fake,{domain:'www.service-public.gouv.fr'}).length,0);
});
test('RSS: GET exige un pays autorisé',async()=>{let r=res();await news({method:'GET',query:{country:'ZZ'}},r);assert.equal(r.statusCode,400);});
test('Coach IA: sans activation, aucun appel au modèle',async()=>{const old=process.env.AI_GATEWAY_ENABLED;delete process.env.AI_GATEWAY_ENABLED;let r=res();await coach({method:'POST',body:{answer:'Texte suffisamment développé pour un essai.',topic:'Débat',country:'BE'},headers:{}},r);assert.equal(r.statusCode,503);assert.equal(r.jsonBody.code,'AI_NOT_ENABLED');if(old!==undefined)process.env.AI_GATEWAY_ENABLED=old;});
test('Coach IA: refuse les méthodes non autorisées',async()=>{let r=res();await coach({method:'GET',headers:{}},r);assert.equal(r.statusCode,405);});
test('Entités HTML: nettoyage lisible',()=>{assert.equal(clean('A &amp; B <b>ok</b>'),'A & B ok');});