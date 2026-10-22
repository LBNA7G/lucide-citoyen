// Actualités institutionnelles : RSS prédéfinis uniquement. Aucun classement idéologique.
const FEEDS = {
  BE: {url:'https://news.belgium.be/fr/feeds/all',domain:'news.belgium.be',name:'News.belgium — institutions fédérales et Conseil des ministres'},
  FR: {url:'https://www.service-public.gouv.fr/abonnements/rss/actu-actualites-particuliers.rss',domain:'www.service-public.gouv.fr',name:'Service-Public.fr — actualités particuliers (France)'}
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
  }).filter(Boolean).slice(0,MAX_ITEMS);
}
export default async function handler(req,res){res.setHeader('Cache-Control','no-store');res.setHeader('X-Content-Type-Options','nosniff');
  if(req.method!=='GET')return res.status(405).json({error:'Méthode non autorisée.'});
  const country=req.query?.country;
  if(typeof country!=='string'||!FEEDS[country])return res.status(400).json({error:'Choisis BE ou FR.'});
  const feed=FEEDS[country];const fresh=cache.get(country);if(fresh&&Date.now()-fresh.time<10*60*1000)return res.status(200).json(fresh.data);const controller=new AbortController();const timeout=setTimeout(()=>controller.abort(),8000);
  try{
    const response=await fetch(feed.url,{signal:controller.signal,headers:{'Accept':'application/rss+xml,application/xml,text/xml','User-Agent':'LUCIDE-Citoyen/0.4 (educational-app)'}});
    if(!response.ok)return res.status(503).json({error:'Source institutionnelle momentanément indisponible.',source:feed.name});
    const contentType=response.headers.get('content-type')||'';
    if(!/xml|rss|text\/plain/.test(contentType))return res.status(503).json({error:'La source ne renvoie pas de flux RSS lisible.'});
    const content=(await response.text()).slice(0,350000);
    const items=parseFeed(content,feed);
    if(!items.length)return res.status(503).json({error:'Aucun titre valide trouvé dans le flux officiel.',source:feed.name});
    const data={country,source:feed.name,sourceUrl:feed.url,checkedAt:new Date().toISOString(),notice:'Titres et résumés issus de la source, sans vérification de statut juridique.',items};cache.set(country,{time:Date.now(),data});return res.status(200).json(data);
  }catch(e){return res.status(503).json({error:e.name==='AbortError'?'La source n’a pas répondu dans le délai.':'Connexion au flux officiel indisponible.'});}
  finally{clearTimeout(timeout)}
}
export {parseFeed,clean};