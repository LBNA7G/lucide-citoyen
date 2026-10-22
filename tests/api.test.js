import test from 'node:test';
import assert from 'node:assert/strict';
import coach from '../api/coach.js';
import news,{parseFeed} from '../api/news.js';
function response(){return {statusCode:200,headers:{},data:null,setHeader(k,v){this.headers[k]=v;return this;},status(n){this.statusCode=n;return this;},json(x){this.data=x;return this;}}}
test('RSS institutionnel : source, date, caractères spéciaux et exclusion des domaines étrangers',()=>{
 const xml='<rss><item><title><![CDATA[Réforme &amp; droits]]></title><link>https://emploi.belgique.be/fr/annonce</link><description>Info &lt;test&gt;</description><pubDate>Thu, 22 Oct 2026 00:00:00 GMT</pubDate></item><item><title>Faux</title><link>https://evil-emploi.belgique.be/vol</link></item></rss>';
 const items=parseFeed(xml,{domain:'emploi.belgique.be'});assert.equal(items.length,1);assert.equal(items[0].title,'Réforme & droits');assert.equal(items[0].date,'2026-10-22');
});
test('API actualités : pays manquant rejeté',async()=>{const r=response();await news({method:'GET',query:{country:'ZZ'}},r);assert.equal(r.statusCode,400);});
test('API coach : aucune facture si non activé',async()=>{const r=response();delete process.env.AI_GATEWAY_ENABLED;await coach({method:'POST'},r);assert.equal(r.statusCode,503);assert.equal(r.data.code,'AI_NOT_ENABLED');});
test('API coach : méthode invalide rejetée',async()=>{const r=response();await coach({method:'GET'},r);assert.equal(r.statusCode,405);});