import test from 'node:test';
import assert from 'node:assert/strict';
import {parseFeed,clean} from '../api/news.js';

const src={domain:'www.service-public.gouv.fr',name:'Service-Public'};
const item=(url,title,date)=>'<item><title>'+title+'</title><link>'+url+'</link><pubDate>'+date+'</pubDate><description>Une publication institutionnelle.</description></item>';

test('official RSS feed is newest-first, rejects foreign domains and removes duplicate links',()=>{
 const xml='<rss><channel>'+
   item('https://www.service-public.gouv.fr/particuliers/actualites/A222','Ancienne publication','Tue, 20 Oct 2026 09:00:00 GMT')+
   item('https://www.service-public.gouv.fr/particuliers/actualites/A222','Copie du même lien','Tue, 20 Oct 2026 09:00:00 GMT')+
   item('https://www.service-public.gouv.fr/particuliers/actualites/A333','Publication récente','Thu, 22 Oct 2026 08:00:00 GMT')+
   item('https://www.phishing.example/particuliers/actualites/A444','Faux domaine','Thu, 22 Oct 2026 08:00:00 GMT')+
   '</channel></rss>';
 const items=parseFeed(xml,src);
 assert.equal(items.length,2);
 assert.equal(items[0].title,'Publication récente');
 assert.equal(items[0].date,'2026-10-22');
 assert.equal(items[1].title,'Ancienne publication');
 assert.ok(items.every(x=>x.url.startsWith('https://www.service-public.gouv.fr/')));
});

test('RSS entities are decoded without leaking embedded tags',()=>{
 assert.equal(clean('<b>Argent &amp; emploi</b>'),'Argent & emploi');
});

test('Walloon Parliament feed accepts only official Walloon article URLs',async()=>{
 const {FEEDS}=await import('../api/news.js');
 const regional=FEEDS.BE.find(x=>x.scope==='regional');
 assert.ok(regional,'missing Wallonia source');
 assert.equal(regional.domain,'parlement-wallonie.be');
 assert.match(regional.url,/parlement-wallonie\.be\/actu\/rss_doc_generator/);
 const xml='<rss><channel>'+
   item('https://www.parlement-wallonie.be/pwpages?p=doc-decret','Décret adopté','Thu, 22 Oct 2026 07:00:00 GMT')+
   item('https://parlement-wallonie.be.evil.test/faux','Faux décret','Thu, 22 Oct 2026 07:00:00 GMT')+
   '</channel></rss>';
 const parsed=parseFeed(xml,regional);
 assert.equal(parsed.length,1);
 assert.equal(parsed[0].title,'Décret adopté');
});
test('a working institutional feed is shown even when the regional source fails',async()=>{
 const {default:handler}=await import('../api/news.js');
 const initial=globalThis.fetch;
 globalThis.fetch=async url=>{
   if(String(url).includes('news.belgium.be'))return {
     ok:true,headers:{get(){return 'application/rss+xml'}},
     text:async()=>'<rss><channel>'+item('https://news.belgium.be/fr/communique','Communiqué fédéral','Thu, 22 Oct 2026 11:00:00 GMT')+'</channel></rss>'
   };
   return {ok:false,status:503,headers:{get(){return 'text/plain'}}};
 };
 const res={statusCode:200,body:null,setHeader(){return this},status(v){this.statusCode=v;return this},json(data){this.body=data;return this}};
 try{
   await handler({method:'GET',query:{country:'BE'}},res);
   assert.equal(res.statusCode,200);
   assert.equal(res.body.items.length,1);
   assert.equal(res.body.items[0].scope,'federal');
   assert.ok(res.body.sources.some(s=>s.scope==='regional'&&!s.available));
 }finally{globalThis.fetch=initial;}
});
