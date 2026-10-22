/* SAVRÉO bêta — activation non disruptive : le précédent worker reste actif jusqu'à fermeture des onglets.
 * Deux générations de caches hors ligne sont conservées pour limiter les interruptions au changement de version.
 */
const CACHE='savreo-assets-v164-20261022';
const ASSETS=['./','./index.html','./styles.css?v=164','./curriculum-beta.js?v=164',
 './civic-pack-01.js?v=164','./party-directory-01.js?v=164','./essentials-pack-02.js?v=164',
 './world-pack-03.js?v=164','./life-pack-04.js?v=164','./public-pack-05.js?v=164',
 './app.js?v=164','./icon.svg','./manifest.webmanifest'];
const PREFIXES=['savreo-assets-','lucide-'];
self.addEventListener('install',event=>{
  // L'installation échoue si un actif critique manque : le worker précédent reste alors disponible.
  event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)));
  // Ne pas appeler skipWaiting() : ne pas basculer un onglet actif en cours de session.
});
self.addEventListener('activate',event=>{
  event.waitUntil((async()=>{
    const keys=await caches.keys();
    const ours=keys.filter(key=>PREFIXES.some(prefix=>key.startsWith(prefix)));
    // Conserver la nouvelle génération + les deux précédentes, si elles existent.
    const versions=ours.filter(key=>key.startsWith('savreo-assets-')).sort().reverse();
    const preserved=new Set([CACHE,...versions.filter(key=>key!==CACHE).slice(0,2)]);
    await Promise.all(ours.filter(key=>!preserved.has(key)).map(key=>caches.delete(key)));
  })());
});
async function fallback(req){
  const response=await caches.match(req);
  if(response)return response;
  if(req.mode==='navigate'){
    // En priorité la nouvelle page, mais une page antérieure vaut mieux qu'une panne blanche.
    const current=await caches.open(CACHE);
    const landing=await current.match('./index.html');
    if(landing)return landing;
    const archives=(await caches.keys()).filter(key=>key.startsWith('savreo-assets-')&&key!==CACHE).sort().reverse();
    for(const key of archives){const old=await (await caches.open(key)).match('./index.html');if(old)return old;}
  }
  return Response.error();
}
self.addEventListener('fetch',event=>{
  const req=event.request;
  if(req.method!=='GET')return;
  const url=new URL(req.url);
  if(url.origin!==self.location.origin||url.pathname.startsWith('/api/'))return;
  event.respondWith((async()=>{
    try{
      const response=await fetch(req);
      if(response.ok&&response.type==='basic'){
        const cache=await caches.open(CACHE);
        await cache.put(req,response.clone()).catch(()=>{});
      }
      return response;
    }catch{
      return fallback(req);
    }
  })());
});
