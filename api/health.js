// Indicateur technique : la disponibilité de cette route ne garantit pas celle des sources RSS externes.
export default function handler(req,res){
  res.setHeader('Cache-Control','no-store, max-age=0');
  res.setHeader('X-Content-Type-Options','nosniff');
  if(req.method!=='GET')return res.status(405).json({error:'Méthode non autorisée.'});
  return res.status(200).json({status:'ok',service:'SAVRÉO',release:'1.6.4-beta',checkedAt:new Date().toISOString()});
}
