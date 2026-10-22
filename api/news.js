// Actualités institutionnelles : RSS prédéfinis uniquement. Aucun classement idéologique.
const FEEDS = {
  BE: [
    {url:'https://news.belgium.be/fr/feeds/all',domain:'news.belgium.be',name:'News.belgium — publications fédérales',scope:'federal'},
    {url:'https://www.parlement-wallonie.be/actu/rss_doc_generator.php?type=parch',domain:'parlement-wallonie.be',name:'Parlement de Wallonie — décrets adoptés',scope:'regional'}
  ],
  FR: [
    {url:'https://www.service-public.gouv.fr/abonnements/rss/actu-actualites-particuliers.rss',domain:'www.service-public.gouv.fr',name:'Service-Public.fr — actualités particuliers',scope:'national'}
  ]
};
const MAX_ITEMS=8;
const cache=new Map();
function clean(text=''){
  return String(text).replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g,'$1').replace(/<[^>]+>/g,' ').replace(/&(#x[\da-f]+|#\d+|amp|lt|gt|quot|apos|nbsp);/gi,(_,name)=>{
    const map={amp:'&',lt:'<',gt:'>',quot:'"',apos:"'",nbsp:' '};
    if(name[0]==='#'){const value=name[1]?.toLowerCase()==='x'?parseInt(name.slice(2),16):parseInt(name.slice(1),10);return Number.isInteger(value)&&value>=32&&value<=0x10ffff?String.fromCodePoint(value):' ';}
    return map[name.toLowerCase()]||' ';
  }).replace(/\s+/g,' ').trim();
}
function tag(item,name){const m=item.match(new RegExp('<(?:[a-z]+:)?'+name+'(?:\\s[^>]*)?>([\\s\\S]*?)<\\/(?:[a-z]+:)?'+name+'>','i'));return m?m[1]:'';}
function date(value){const d=new Date(value);return Number.isNaN(d.valueOf())?'':d.toISOString().slice(0,10);}
function parseFeed(xml,origin){const items=(xml.match(/<item\b[^>]*>[\s\S]*?<\/item>/gi)||[]).slice(0,MAX_ITEMS*3);
  return items.map(item=>{
    const raw=tag(item,'link').replace(/<!\[CDATA\[|\]\]>/g,'').replace(/&amp;/g,'&').trim();
    let url;
    try{url=new URL(raw);if(url.protocol!=='https:'||!(url.hostname===origin.domain||url.hostname.endsWith('.'+origin.domain)))return null;}catch{return null;}
    const title=clean(tag(item,'title')).slice(0,240);
    if(!title)return null;
    const description=clean(clean(tag(item,'description'))).slice(0,260);
    return {title,summary:description,url:url.toString(),date:date(clean(tag(item,'pubDate')||tag(item,'date')))};
  }).filter(Boolean)
    .filter((entry,index,all)=>all.findIndex(other=>other.url===entry.url)===index)
    .sort((a,b)=>(b.date||'').localeCompare(a.date||''))
    .slice(0,MAX_ITEMS);
}
export default async function handler(req,res){
  res.setHeader('Cache-Control','no-store');
  res.setHeader('X-Content-Type-Options','nosniff');
  if(req.method!=='GET')return res.status(405).json({error:'Méthode non autorisée.'});
  const country=req.query?.country;
  if(typeof country!=='string'||!Object.hasOwn(FEEDS,country))return res.status(400).json({error:'Choisis BE ou FR.'});
  const fresh=cache.get(country);
  if(fresh&&Date.now()-fresh.time<10*60*1000)return res.status(200).json(fresh.data);
  // Les sources sont définies dans le serveur : le navigateur ne peut pas imposer un domaine RSS.
  const sources=await Promise.all(FEEDS[country].map(async feed=>{
    const controller=new AbortController();
    const timeout=setTimeout(()=>controller.abort(),8000);
    try{
      const response=await fetch(feed.url,{signal:controller.signal,headers:{'Accept':'application/rss+xml,application/xml,text/xml','User-Agent':'SAVREO/1.6 (educational-app; source-attributed)'}});
      if(!response.ok)return {feed,items:[],error:'Source momentanément indisponible.'};
      const kind=response.headers.get('content-type')||'';
      if(!/xml|rss|text\/plain/i.test(kind))return {feed,items:[],error:'Format RSS non lisible.'};
      const xml=(await response.text()).slice(0,350000);
      const items=parseFeed(xml,feed);
      if(!items.length)return {feed,items:[],error:'Aucun lien RSS conforme au domaine officiel.'};
      return {feed,items,error:''};
    }catch(error){
      return {feed,items:[],error:error?.name==='AbortError'?'Source trop lente.':'Connexion au flux indisponible.'};
    }finally{clearTimeout(timeout);}
  }));
  const items=sources.flatMap(entry=>entry.items.map(item=>({
    ...item,source:entry.feed.name,scope:entry.feed.scope,
    publicationType:entry.feed.scope==='regional'?'Décret adopté au Parlement — entrée en vigueur non vérifiée':'Publication officielle — statut juridique non vérifié'
  }))).filter((item,index,all)=>all.findIndex(other=>other.url===item.url)===index)
    .sort((a,b)=>(b.date||'').localeCompare(a.date||'')).slice(0,12);
  const sourceStatus=sources.map(entry=>({
    name:entry.feed.name,scope:entry.feed.scope,available:entry.items.length>0,
    error:entry.error||'',url:entry.feed.url
  }));
  if(!items.length)return res.status(503).json({
    error:'Aucun titre exploitable depuis les sources officielles à cette consultation.',
    sources:sourceStatus
  });
  const data={
    country,
    source:sources.filter(s=>s.items.length).map(s=>s.feed.name).join(' · '),
    sources:sourceStatus,
    checkedAt:new Date().toISOString(),
    notice:'Liste pilote partielle. Les communiqués et décrets adoptés ne démontrent pas une entrée en vigueur. Vérifier le Moniteur belge et les dates.',
    items
  };
  cache.set(country,{time:Date.now(),data});
  return res.status(200).json(data);
}
export {parseFeed,clean,FEEDS};
