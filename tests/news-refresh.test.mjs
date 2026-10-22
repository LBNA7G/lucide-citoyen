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
