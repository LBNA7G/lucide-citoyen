/* SAVRÉO — prototype citoyen et pédagogique.
   Fonctionne sans compte. Les analyses locales restent disponibles sans service tiers.
   Les fonctionnalités distantes sont clairement signalées et nécessitent une action de l’utilisateur.
*/
(() => {
  'use strict';
  const STORAGE = 'lucide-demo-v1';
  const DEFAULT = { country:'BE', xp:0, completed:[], history:[], lastActive:'', streak:0, viewedRights:[], savedNews:[], firstName:'', ageGroup:'', gender:'', onboardingDone:false, interests:[], interestsDone:false, reviews:{}, microReviews:{}, journeyDebates:[], theme:'auto' };
  function load(){try { const data = JSON.parse(localStorage.getItem(STORAGE) || '{}');return {...DEFAULT,...data}; }catch{return {...DEFAULT};}}
  let state = load();
  let profileEditing = false;
  let interestsEditing = false;
  // Les préférences restent locales et ne sont jamais envoyées au coach IA.
  const AGE_GROUPS = {'12-15':'12–15 ans','16-20':'16–20 ans','21-28':'21–28 ans'};
  const GENDERS = {feminin:'Féminin',masculin:'Masculin',autre:'Autre'};
  const INTERESTS = [
    {id:'argent',emoji:'◈',label:'Argent & travail',detail:'Salaires, contrats et budget',lessons:['economy','droits'],cases:{BE:['be-heures','be-contrat'],FR:['fr-salaire','fr-apprenti']}},
    {id:'droits',emoji:'⚖',label:'Mes droits',detail:'Connaître et défendre ses droits',lessons:['droits','lois'],cases:{BE:['be-manif','be-contrat'],FR:['fr-manif','fr-salaire']}},
    {id:'actualite',emoji:'◎',label:'Actualité & société',detail:'Comprendre ce qui change',lessons:['lois','penser'],cases:{BE:['be-9oct','be-manif'],FR:['fr-annonce','fr-manif']}},
    {id:'expression',emoji:'◉',label:'Parler & débattre',detail:'Argumenter et prendre la parole',lessons:['argument','debate'],cases:{BE:['be-manif'],FR:['fr-manif']}},
    {id:'reseaux',emoji:'✳',label:'Réseaux & info',detail:'Décrypter et éviter les pièges',lessons:['penser','debate'],cases:{BE:['both-video'],FR:['both-video']}},
    {id:'culture',emoji:'✦',label:'Culture & réflexion',detail:'Développer son esprit critique',lessons:['penser','economy','lois'],cases:{BE:['both-video','be-9oct'],FR:['both-video','fr-annonce']}}
  ];
  const chosenInterests = () => (Array.isArray(state.interests)?state.interests:[]).filter(id=>INTERESTS.some(t=>t.id===id)).slice(0,3);
  const safeName = name => String(name ?? '').trim().replace(/\s+/g,' ').slice(0,24);
  state.savedNews = Array.isArray(state.savedNews) ? state.savedNews.slice(0,40) : [];
  let page = 'accueil';
  let activeLesson = 'penser';
  let activeDebate = 0;
  let debateFeedback = null;
  let aiFeedback = null, aiBusy = false, aiError = '';
  let liveNews = {status:'idle',items:[],source:'',checkedAt:'',error:''};
  let newsRequest = null;
  let quizSelection = null;
  let quizDone = false;
  let reviewLessonId = '';
  let reviewChoice = null;
  let reviewResult = null;
  let journeyContext = '';
  let civicCurrent=null, civicChoice=null, civicReveal=false;
  let publicScope='all', publicSourcesOpen=false;
  let essentialCurrent=null, essentialChoice=null, essentialReveal=false;
  let essentialAgeView=null;
  let rightFilter = '';
  const el = id => document.getElementById(id);
  const escapeHTML = str => String(str ?? '').replace(/[&<>"']/g, ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const safeURL = url => /^https:\/\//.test(url)?url:'#';
  const setStore = () => {try{localStorage.setItem(STORAGE,JSON.stringify(state));}catch{}};

  const THEME_OPTIONS=['auto','light','dark'];
  const themePreference=()=>THEME_OPTIONS.includes(state.theme)?state.theme:'auto';
  const systemDark=window.matchMedia('(prefers-color-scheme: dark)');
  function applyTheme(){
    const selected=themePreference();
    const effective=selected==='auto'?(systemDark.matches?'dark':'light'):selected;
    document.documentElement.dataset.theme=effective;
    document.documentElement.style.colorScheme=effective;
    const meta=document.querySelector('meta[name="theme-color"]');
    if(meta)meta.setAttribute('content',effective==='light'?'#f6f8f5':'#0b0e18');
    document.querySelectorAll('[data-theme-option]').forEach(btn=>{
      const active=btn.dataset.themeOption===selected;
      btn.classList.toggle('active',active);
      btn.setAttribute('aria-pressed',String(active));
    });
    const quick=el('theme-quick');
    if(quick){quick.textContent=effective==='light'?'☾':'☀';quick.setAttribute('aria-label',effective==='light'?'Activer le mode sombre':'Activer le mode clair');quick.title=effective==='light'?'Activer le mode sombre':'Activer le mode clair';}
    document.querySelectorAll('.theme-entry').forEach(button=>{button.textContent=effective==='light'?'☾':'☀';button.setAttribute('aria-label',effective==='light'?'Activer le mode sombre':'Activer le mode clair');});
  }
  function updateTheme(choice){
    if(!THEME_OPTIONS.includes(choice))return;
    state.theme=choice;setStore();applyTheme();
  }
  systemDark.addEventListener?.('change',()=>{if(themePreference()==='auto')applyTheme();});

  const dayKey = () => new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Brussels',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
  function reward(tag, amount=15){if(state.completed.includes(tag))return false;state.completed.push(tag);state.xp+=amount; const today=dayKey(); if(state.lastActive!==today){const y=new Date();y.setDate(y.getDate()-1); const yesterday = new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Brussels',year:'numeric',month:'2-digit',day:'2-digit'}).format(y);state.streak=state.lastActive===yesterday?state.streak+1:1;state.lastActive=today;}setStore();renderHeader();return true;}
  function toast(msg){let t=el('toast');t.textContent=msg;t.classList.add('show');clearTimeout(window.__lucideToast);window.__lucideToast=setTimeout(()=>t.classList.remove('show'),2900)}
  const topLevel = p => ['declic','apprendre','dico','vigie','lecon','explorer','sources','vie-publique','civique','dossiers','essentiels'].includes(p) ? 'explorer' : ['debattre','pratiquer','parcours','reviser'].includes(p) ? 'pratiquer' : p;
  function renderHeader(){
    applyTheme();
    el('xp-top').textContent=state.xp;
    document.querySelectorAll('[data-country]').forEach(b=>{const active=b.dataset.country===state.country;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});
    document.querySelectorAll('[data-page]').forEach(b=>{
      const isActive=b.dataset.page===topLevel(page);
      b.classList.toggle('active',isActive);
      if(isActive)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current');
    });
  }
  const CIVIC_PACK=window.SAVREO_CIVIC&&typeof window.SAVREO_CIVIC==='object'?window.SAVREO_CIVIC:{cards:[],resources:{}};
  const civicAvailable=()=>Array.isArray(CIVIC_PACK.cards)?CIVIC_PACK.cards.filter(c=>c.country==='ALL'||c.country===state.country):[];
  const PARTY_DATA=window.SAVREO_PARTIES&&typeof window.SAVREO_PARTIES==='object'?window.SAVREO_PARTIES:{parties:[],countrySources:{}};
  const ESSENTIAL_DATA=window.SAVREO_ESSENTIALS&&typeof window.SAVREO_ESSENTIALS==='object'?window.SAVREO_ESSENTIALS:{items:[]};
  const WORLD_DATA=window.SAVREO_WORLD&&typeof window.SAVREO_WORLD==='object'?window.SAVREO_WORLD:{items:[]};
  const LIFE_DATA=window.SAVREO_LIFE&&typeof window.SAVREO_LIFE==='object'?window.SAVREO_LIFE:{items:[]};
  const PUBLIC_DATA=window.SAVREO_PUBLIC&&typeof window.SAVREO_PUBLIC==='object'?window.SAVREO_PUBLIC:{items:[]};
  const essentialAvailable=()=>[
    ...(Array.isArray(ESSENTIAL_DATA.items)?ESSENTIAL_DATA.items:[]),
    ...(Array.isArray(WORLD_DATA.items)?WORLD_DATA.items:[]),
    ...(Array.isArray(LIFE_DATA.items)?LIFE_DATA.items:[]),
    ...(Array.isArray(PUBLIC_DATA.items)?PUBLIC_DATA.items:[])
  ];
  const microReviewsData=()=>state.microReviews&&typeof state.microReviews==='object'&&!Array.isArray(state.microReviews)?state.microReviews:{};
  const dueMicroReviews=()=>essentialAvailable().filter(c=>microReviewsData()[c.id]&&microReviewsData()[c.id].due<=dayKey())
    .sort((a,b)=>microReviewsData()[a.id].due.localeCompare(microReviewsData()[b.id].due));
  function nextMicroCard(excludeId='',age=state.ageGroup){
    const cards=essentialAvailable().filter(c=>c.id!==excludeId),reviews=microReviewsData();
    return cards.find(c=>c.ageGroups.includes(age)&&reviews[c.id]?.due<=dayKey())
      || cards.find(c=>c.ageGroups.includes(age)&&!reviews[c.id])
      || cards.find(c=>reviews[c.id]?.due<=dayKey())
      || cards.find(c=>!reviews[c.id])
      || cards.find(c=>c.ageGroups.includes(age)&&!state.completed.includes('essential:'+c.id))
      || cards[0]||null;
  }
  function recordMicroReview(id,correct){
    const reviews=microReviewsData(),old=reviews[id];
    const stage=correct?(old?Math.min(old.stage+1,4):0):0;
    reviews[id]={stage,due:reviewDate(correct?[1,3,7,14,30][stage]:1),attempts:(old?.attempts||0)+1};
    state.microReviews=reviews;setStore();
  }
  const source=(name,url)=>`<a class="source-link" href="${safeURL(url)}" target="_blank" rel="noopener noreferrer">${escapeHTML(name)} ↗</a>`;
  // Expose la provenance sans présenter la présence d'un lien comme une certification.
  const sourceIsGeneral=url=>/^https:\/\/[^/?#]+\/(?:fr\/?)?(?:\?.*)?$/.test(String(url||''))||/^https:\/\/[^/?#]+\/?$/.test(String(url||''));
  function civicProvenance(card){
    const edition=card.edition||CIVIC_PACK.editorial?.edition||'date non renseignée';
    const generic=Array.isArray(card.sources)&&card.sources.some(x=>sourceIsGeneral(x.url));
    const precision=generic?'Au moins une référence générale : document exact à identifier':'Références identifiées : pertinence à confirmer';
    const proof=(card.sources||[]).map(x=>source(x.label,x.url)).join(' ');
    return '<details class="calm-disclosure civic-proof"><summary>Lire les sources et leur fiabilité <span aria-hidden="true">＋</span></summary>'+
      '<div class="calm-reading-extra"><p><b>Édition pédagogique :</b> '+escapeHTML(edition)+'</p>'+
      '<p><b>Territoire :</b> '+escapeHTML(card.country==='ALL'?'Belgique et France':card.country==='BE'?'Belgique':'France')+'</p>'+
      '<p><b>Relecture indépendante :</b> non réalisée</p>'+
      '<p><b>Précision de la référence :</b> '+escapeHTML(precision)+'</p>'+
      (card.freshnessWarning?'<p class="civic-freshness">'+escapeHTML(card.freshnessWarning)+'</p>':'')+
      '<div class="civic-proof-links">'+proof+'</div><p>Les liens externes nécessitent internet. Une source citée ne valide pas automatiquement l’explication.</p></div></details>';
  }

  function essentialEvidence(card){
    const refs=Array.isArray(card.sources)?card.sources:[];
    const generic=refs.some(x=>sourceIsGeneral(x.url));
    return '<details class="calm-disclosure civic-proof"><summary>Sources et approfondissement <span aria-hidden="true">＋</span></summary>'+
      '<div class="calm-reading-extra"><p><b>Type :</b> simulation pédagogique, pas un témoignage réel</p>'+
      '<p><b>Édition :</b> 22 octobre 2026 · <b>Relecture indépendante :</b> non réalisée</p>'+
      '<p><b>Précision :</b> '+(generic?'source générale — document spécifique encore à identifier':'liens identifiés — exactitude à confirmer')+'</p>'+
      '<div class="civic-proof-links">'+refs.map(x=>source(x.label,x.url)).join(' ')+'</div>'+
      '<p>Les pages externes nécessitent internet. Leur présence ne certifie pas le contenu.</p></div></details>';
  }
  const action=(label,target,extra='')=>`<button class="btn ${extra}" data-route="${target}">${escapeHTML(label)} →</button>`;
  const intro=(tag,title,subtitle)=>`<div class="page-intro"><div class="eyebrow">${tag}</div><h1>${title}</h1><p class="subtitle">${subtitle}</p></div>`;
  const lessons = [
   {id:'penser',icon:'◎',tag:'Esprit critique',level:'Débutant',mins:6,title:'Une opinion n’est pas un fait',summary:'Apprends à identifier les faits, les opinions et les affirmations qui exigent des preuves.',text:[['Définir les mots','Un fait est une affirmation qui peut être confrontée à des preuves. Une opinion exprime une appréciation ou un jugement personnel. Une opinion peut s’appuyer sur des faits, mais elle ne devient pas un fait pour autant.'],['La technique des trois questions','Quand tu entends une affirmation, demande-toi : qu’est-ce qui est exactement affirmé ? Quelles preuves la soutiennent ? Existe-t-il une interprétation alternative ?'],['Exemple concret','« Cette politique est injuste » est un jugement. « La mesure concerne les personnes de moins de 26 ans » est une affirmation factuelle que l’on doit pouvoir vérifier dans un texte.']],q:'Quelle phrase est un jugement de valeur ?',choices:['Le Parlement examine un texte.','Cette réforme est injuste.','Une constitution organise les pouvoirs.'],answer:1,why:'« Injuste » est une appréciation. Elle doit être argumentée, mais ne peut pas être vérifiée comme une date ou une disposition.'},
   {id:'argument',icon:'◇',tag:'Expression',level:'Débutant',mins:7,title:'Argumenter sans se perdre',summary:'Une méthode simple pour défendre une idée sans parler plus fort que les autres.',text:[['Construire une réponse','Commence par ta position, donne un argument, illustre-le par un exemple pertinent, puis formule une conclusion qui découle de ce que tu as démontré.'],['L’erreur fréquente','Un exemple de personne riche malheureuse montre que l’argent ne garantit pas le bonheur. Il ne montre pas à lui seul qu’il n’est pas nécessaire. Distingue condition nécessaire et condition suffisante.'],['Une tournure utile','« Je partage une partie de ton analyse. Toutefois, il convient de distinguer… » permet de reconnaître une nuance sans abandonner ton point de vue.']],q:'Quel argument réfute le mieux « toutes les réussites exigent des études supérieures » ?',choices:['Les études ne servent jamais.','Il existe des parcours de réussite sans diplôme supérieur.','Chacun devrait choisir ses études.'],answer:1,why:'Un seul contre-exemple réel et pertinent suffit à invalider une affirmation universelle, même s’il ne prouve pas que les études sont inutiles.'},
   {id:'lois',icon:'⚖',tag:'Citoyenneté',level:'Essentiel',mins:8,title:'Une annonce politique n’est pas une loi',summary:'Comprends les étapes avant qu’une réforme puisse vraiment s’appliquer.',text:[['Annonce','Un ministre, un parti ou un gouvernement peut présenter une intention. Cela ne crée pas automatiquement une nouvelle règle de droit.'],['Examen et adoption','Les assemblées compétentes examinent, modifient ou votent des textes selon les procédures applicables. En Belgique, la compétence peut relever d’un niveau fédéral, régional ou communautaire.'],['Publication et application','Une règle adoptée doit être vérifiée dans la publication officielle et quant à sa date d’entrée en vigueur. Les étapes et exceptions diffèrent entre la Belgique et la France.']],q:'Quel élément faut-il vérifier avant d’affirmer qu’une nouvelle obligation s’applique ?',choices:['Le nombre de réactions sur les réseaux.','Le communiqué d’un parti politique.','Le texte officiel et sa date d’entrée en vigueur.'],answer:2,why:'La source officielle et la date d’application priment sur les annonces et les commentaires.'},
   {id:'droits',icon:'▤',tag:'Droits fondamentaux',level:'Essentiel',mins:6,title:'Un droit n’est pas illimité',summary:'Pourquoi une liberté protégée peut aussi comporter des limites légales.',text:[['Principe','Les libertés fondamentales protègent les personnes contre certaines atteintes, notamment arbitraires.'],['Limites et garanties','Les conditions de limitation varient selon le droit en cause et la législation applicable. Il est nécessaire de distinguer les garanties constitutionnelles, les lois et les décisions des tribunaux.'],['Réflexe pratique','Pour une situation personnelle, vérifie le pays, la région compétente, la date et la source officielle ; ne te contente pas d’un résumé simplifié.']],q:'Quelle réaction est la plus prudente face à un conseil juridique trouvé sur une vidéo ?',choices:['L’appliquer dans tous les pays.','Vérifier la juridiction et le texte actuel.','Le partager si la vidéo est populaire.'],answer:1,why:'Le droit dépend notamment du pays, du contexte et de la version du texte applicable.'},
   {id:'economy',icon:'◈',tag:'Économie',level:'Débutant',mins:7,title:'Inflation : comprendre la hausse des prix',summary:'Pourquoi une hausse des salaires ne signifie pas toujours plus de pouvoir d’achat.',text:[['Prix et inflation','L’inflation correspond à une augmentation générale du niveau des prix sur une période, mesurée à l’aide d’un indice. Ce n’est pas nécessairement une hausse de chaque prix.'],['Revenu nominal / réel','Si tes revenus progressent moins vite que le prix des biens et services que tu consommes, ton pouvoir d’achat peut diminuer.'],['Questions à poser','De quel indice parle-t-on ? Quelle période ? Par rapport à quel revenu ? Les moyennes cachent-elles des différences entre ménages ?']],q:'Que peut-il arriver si les prix augmentent plus vite que ton salaire ?',choices:['Ton pouvoir d’achat diminue.','Ton pouvoir d’achat augmente toujours.','Cela n’a aucun effet possible.'],answer:0,why:'À consommation comparable, un salaire qui progresse moins vite que les prix permet d’acheter moins.'},
   {id:'debate',icon:'✦',tag:'Débat',level:'Pratique',mins:5,title:'Concéder sans capituler',summary:'Apprends à reconnaître une part de vérité tout en conservant ta thèse.',text:[['Concession','Une concession consiste à admettre qu’un argument adverse a une part de validité : « Il est vrai que… ».'],['Distinction','Détermine précisément ce sur quoi tu es d’accord et ce que tu contestes : « Cela ne signifie pas pour autant que… ».'],['Réfutation','Présente un raisonnement ou un contre-exemple qui répond au point contesté, sans caricaturer la position de l’autre.']],q:'Quelle phrase correspond à une concession suivie d’une nuance ?',choices:['Tu as totalement tort.','D’accord, donc je retire tout.','Tu soulèves un point valable, mais la conclusion mérite d’être nuancée.'],answer:2,why:'La phrase accepte un élément de l’objection sans admettre automatiquement toute sa conclusion.'}
  ];
  const debates=[
    {label:'Société',title:'Faut-il des études pour réussir ?',opp:'« Sans diplôme, impossible d’avoir une carrière solide. »',help:'Distingue les diplômes utiles dans certaines professions de la réussite dans tous les domaines.'},
    {label:'Philosophie',title:'L’argent rend-il heureux ?',opp:'« Aujourd’hui, l’argent est indispensable au bonheur. »',help:'Attention à la différence entre une condition nécessaire et une garantie suffisante.'},
    {label:'Citoyenneté',title:'Faut-il rendre le vote facultatif ?',opp:'« Si l’on n’a aucune connaissance politique, on ne devrait pas être tenu de voter. »',help:'Distingue participation démocratique, liberté individuelle et qualité de l’information.'},
    {label:'Technologie',title:'Les réseaux sociaux nous informent-ils ?',opp:'« Être sur les réseaux toute la journée suffit à comprendre l’actualité. »',help:'Compare rapidité, fiabilité, sources primaires et esprit critique.'},
    {label:'Éducation',title:'L’IA aide-t-elle vraiment à apprendre ?',opp:'« Puisque l’IA sait répondre, il est inutile de mémoriser. »',help:'Interroge la distinction entre obtenir une réponse et comprendre un raisonnement.'}
  ];

  // Ateliers de prise de parole : les réponses personnelles ne sont jamais notées
  // sur leur opinion ; seul le raisonnement et la nuance sont observés.
  debates.push(
    {label:'Réseaux',title:'Peut-on publier une photo sans demander ?',opp:'« Si quelqu’un apparaît dans ma vidéo, c’est mon compte, je poste ce que je veux. »',help:'Distingue création, respect de l’autre, consentement et conséquences de la diffusion.'},
    {label:'Sécurité',title:'Faut-il faire confiance à une offre trop urgente ?',opp:'« Si je ne réponds pas immédiatement à un recruteur, je vais perdre ma chance. »',help:'Tu peux montrer ton intérêt sans fournir des codes ou des documents sensibles à un inconnu.'},
    {label:'Logement',title:'Payer pour réserver un appartement ?',opp:'« Tout le monde verse de l’argent à l’avance, sinon le propriétaire loue à quelqu’un d’autre. »',help:'Distinguons une procédure de location encadrée d’une pression à payer sans vérification préalable.'}
  );
  const SOURCES={
    BE:[
      {name:'Moniteur belge / Justel',topic:'Textes en vigueur',description:'Publications officielles et recherche dans les textes consolidés.',url:'https://www.justice.belgium.be/fr/moniteur_belge'},
      {name:'La Chambre',topic:'Travaux parlementaires',description:'Projets, propositions, questions, séances et historique des dossiers.',url:'https://www.lachambre.be/kvvcr/index.cfm?language=fr'},
      {name:'Belgium.be',topic:'Droits et démarches',description:'Informations administratives et répartition des compétences.',url:'https://www.belgium.be/fr'},
      {name:'Parlement de Wallonie',topic:'Région',description:'Travaux parlementaires et compétences régionales wallonnes.',url:'https://www.parlement-wallonie.be'},
      {name:'Parlement européen',topic:'Europe',description:'Travaux et actualités des institutions européennes.',url:'https://www.europarl.europa.eu/news/fr'}
    ],
    FR:[
      {name:'Vie publique',topic:'Suivi législatif',description:'Panorama des lois, débats publics et dossiers explicatifs.',url:'https://www.vie-publique.fr'},
      {name:'Assemblée nationale',topic:'Travaux parlementaires',description:'Projets, propositions, amendements, séances et votes.',url:'https://www.assemblee-nationale.fr'},
      {name:'Légifrance',topic:'Textes officiels',description:'Journal officiel et versions des textes juridiques.',url:'https://www.legifrance.gouv.fr'},
      {name:'Service Public',topic:'Droits et démarches',description:'Fiches pratiques sur la vie quotidienne et les obligations.',url:'https://www.service-public.fr'},
      {name:'Données Assemblée nationale',topic:'Données ouvertes',description:'Dossiers législatifs structurés en XML et JSON.',url:'https://data.assemblee-nationale.fr/travaux-parlementaires/dossiers-legislatifs'}
    ]
  };
  const RIGHTS={
    BE:[
      {icon:'⚖',tag:'Constitution',title:'Égalité et non-discrimination',body:'Les articles 10 et 11 de la Constitution belge consacrent l’égalité et la non-discrimination. L’analyse dépend du domaine et de la situation.',practical:'Face à une décision qui te semble discriminatoire, note les faits, conserve les preuves et vérifie les recours applicables.',url:'https://www.belgium.be/fr/la_belgique/pouvoirs_publics/democratie/legislation'},
      {icon:'✦',tag:'Libertés',title:'Liberté d’expression',body:'La liberté d’expression est protégée, notamment par la Constitution et la Convention européenne des droits de l’homme. Elle connaît des limites légales.',practical:'Avant de partager une accusation, distingue opinion, affirmation de fait et preuve.',url:'https://diplomatie.belgium.be/fr/politique/themes-politiques/droits-humains/thematiques-specifiques/liberte-dexpression-y-compris-la-liberte-de-la-presse'},
      {icon:'▣',tag:'Vie quotidienne',title:'Vie privée et données',body:'La vie privée et familiale est protégée. Des règles spécifiques encadrent le traitement des données personnelles.',practical:'Demande pourquoi une organisation réclame tes données et comment elles sont utilisées.',url:'https://www.belgium.be/fr/justice/respect_de_la_vie_privee'},
      {icon:'◷',tag:'Travail',title:'Contrat de travail',body:'Un contrat de travail implique une prestation sous autorité contre rémunération. Les règles précises dépendent du statut et du contrat.',practical:'Garde ton contrat, tes horaires, tes fiches de paie et les échanges importants.',url:'https://www.belgium.be/fr/emploi/contrats_de_travail'},
      {icon:'⚑',tag:'Justice',title:'Droits des victimes',body:'Une victime d’infraction dispose de droits à l’information, à l’accompagnement et, selon les cas, à la réparation.',practical:'Cherche une assistance qualifiée en précisant la nature de la situation et le service compétent.',url:'https://www.belgium.be/fr/justice/victime/plaintes_et_declarations/droits_de_base/droits_fondamentaux'}
    ],
    FR:[
      {icon:'⚖',tag:'Constitution',title:'Droits et libertés fondamentaux',body:'Les droits protégés s’appuient notamment sur la Constitution, la Déclaration de 1789 et le Préambule de 1946.',practical:'Vérifie la norme invoquée et le contexte : droit constitutionnel, loi ou réglementation.',url:'https://www.service-public.fr/particuliers/vosdroits/F21088'},
      {icon:'▣',tag:'Quotidien',title:'Démarches administratives',body:'Service-Public.fr rassemble des fiches pour comprendre ses démarches et les conditions applicables.',practical:'Privilégie une fiche officielle à une vidéo dont tu ignores la date.',url:'https://www.service-public.fr'},
      {icon:'◷',tag:'Travail',title:'Paiement du salaire',body:'Un salarié doit recevoir sa rémunération selon les règles applicables. Des recours existent en cas de retard ou de non-paiement.',practical:'Conserve bulletins de paie, relevés et échanges datés avant de te renseigner sur les recours.',url:'https://www.service-public.fr/particuliers/vosdroits/F2308'},
      {icon:'✦',tag:'Lois',title:'Comprendre une réforme',body:'Un projet de loi doit franchir les étapes institutionnelles prévues avant sa promulgation et sa publication.',practical:'Ne confonds pas annonce, adoption parlementaire, publication et entrée en vigueur.',url:'https://www.assemblee-nationale.fr/dyn/synthese/fonctionnement-assemblee-nationale/travail-legislatif/la-procedure-legislative'},
      {icon:'⚑',tag:'Citoyenneté',title:'Participer au débat',body:'La vie démocratique ne se résume pas aux élections. Les travaux parlementaires et consultations publiques peuvent être suivis.',practical:'Lis une proposition et ses arguments contradictoires avant de partager un avis.',url:'https://www.vie-publique.fr'}
    ]
  };

  /* DÉCLIC — exemples sourcés, réponses locales, jamais de pseudo-vérification en direct */
  const checkedDate = '22 octobre 2026';
  const scenarios = [
    {id:'be-heures',country:'BE',category:'Travail',kind:'Mise en situation',mins:2,
      punch:'Tu dépasses 650 h de job étudiant. Tu dois arrêter de travailler ?',
      setup:'Ton compteur Student@work annonce 649 heures déjà utilisées cette année. Un collègue t’affirme : « À 650 heures, travailler devient interdit ».',
      question:'Quel réflexe est exact ?',choices:['Je ne peux plus travailler du tout.','Je peux travailler davantage, mais les cotisations sociales changent au-delà du quota.','Le compteur repart à zéro chaque mois.'],answer:1,
      why:'En Belgique, le quota annuel de 650 heures permet des cotisations sociales réduites. Dépasser ce quota n’interdit pas automatiquement le travail : les heures supplémentaires sont soumises aux cotisations ordinaires.',
      next:'Consulte ton solde réel et ton contrat sur le service officiel. Les autres limites éventuelles dépendent de ta situation.',
      tags:['quota','cotisations'],source:[['Student@work — quota et impact','https://www.studentatwork.be/fr/quota-heures-et-impact.html']]},
    {id:'be-manif',country:'BE',category:'Citoyenneté',kind:'Mise en situation',mins:2,
      punch:'« Manifester, c’est interdit sans autorisation. » Vrai ou faux ?',
      setup:'Une personne t’assure que la liberté de manifester n’existe plus en Belgique. Elle confond réunion pacifique et rassemblement en plein air.',
      question:'Quel résumé est le plus juste ?',choices:['Toute manifestation est libre de toute réglementation.','La Constitution protège la réunion pacifique, mais les rassemblements en plein air restent soumis aux lois de police.','Seules les personnes élues peuvent manifester.'],answer:1,
      why:'L’article 26 de la Constitution protège le droit de réunion pacifique et sans armes, tout en précisant le régime particulier des rassemblements en plein air, soumis aux lois de police. Des règles locales peuvent s’appliquer.',
      next:'Avant un rassemblement, consulte les règles applicables dans la commune concernée et les consignes officielles.',
      tags:['constitution','liberté de réunion'],source:[['Constitution belge, article 26 — Sénat','https://www.senate.be/doc/const_fr.html']]},
    {id:'be-9oct',country:'BE',category:'Actualité expliquée',kind:'Fait documenté · octobre 2026',mins:3,
      punch:'9 octobre 2026 : pourquoi une journée d’action syndicale ?',
      setup:'En septembre et octobre 2026, la FGTB et la CSC ont annoncé une journée d’action nationale le 9 octobre en réaction à des mesures et orientations budgétaires fédérales. Des organisations d’employeurs ont ensuite expliqué les conséquences possibles sur le travail. Une revendication syndicale n’est pas à elle seule une décision légale.',
      question:'Qu’est-ce qui est démontré par ces sources ?',choices:['Que toutes les mesures contestées sont entrées en vigueur.','Qu’une action a été annoncée pour le 9 octobre et que ses organisateurs contestaient des orientations du gouvernement.','Que tous les citoyens partagent la même opinion.'],answer:1,
      why:'Les communications syndicales établissent les motifs revendiqués et l’appel à mobilisation ; la communication de Liantis confirme le calendrier annoncé et fournit des informations pour les employeurs. Pour connaître une loi applicable, il faut consulter le texte officiel et sa date d’entrée en vigueur.',
      next:'Compare la position des syndicats, celle du gouvernement concerné et les textes publiés. Ne transforme pas une revendication en fait juridique.',
      tags:['revendication','entrée en vigueur'],source:[['FGTB — communiqué du 11 septembre 2026','https://fgtb.be/presse/la-fgtb-met-en-garde-le-gouvernement-et-annonce-son-plan-daction'],['Liantis — journées d’action d’octobre 2026','https://www.liantis.be/fr/nouvelles/journ%C3%A9es-d%E2%80%99action-en-octobre-2026?switch=fr']]},
    {id:'fr-manif',country:'FR',category:'Citoyenneté',kind:'Mise en situation',mins:2,
      punch:'Tu organises une manifestation en France : quelle démarche ?',
      setup:'Un groupe souhaite organiser un cortège sur la voie publique. Quelqu’un affirme : « La liberté de manifester signifie qu’aucune déclaration n’est nécessaire ».',
      question:'Quelle information est exacte ?',choices:['L’organisateur doit en principe effectuer une déclaration préalable auprès de l’autorité compétente.','Toute manifestation exige un vote du Parlement.','Une publication sur les réseaux remplace toute démarche.'],answer:0,
      why:'En France, l’organisation d’une manifestation sur la voie publique est soumise à une déclaration préalable, selon les conditions et autorités compétentes indiquées par Service Public. La déclaration ne doit pas être confondue avec une permission générale de penser ou de s’exprimer.',
      next:'Avant d’organiser, vérifie les règles et délais du lieu précis : ils peuvent varier, notamment à Paris.',
      tags:['déclaration préalable','ordre public'],source:[['Service Public — organisation d’une manifestation','https://www.service-public.fr/particuliers/vosdroits/F21899']]},
    {id:'fr-apprenti',country:'FR',category:'Travail',kind:'Mise en situation',mins:2,
      punch:'En apprentissage, tu es « juste un élève » ?',
      setup:'Un jeune en alternance entend : « Tu es en formation, tu n’as donc aucun vrai droit de salarié ».',
      question:'Quelle réponse est la mieux fondée ?',choices:['Un apprenti n’a jamais de contrat de travail.','Un apprenti est salarié avec un contrat écrit et des droits liés à son statut.','Un apprenti doit toujours accepter un travail non rémunéré.'],answer:1,
      why:'En France, l’apprentissage repose sur un contrat de travail écrit qui organise alternance, formation et rémunération. L’apprenti bénéficie de droits de salarié, avec des règles propres au contrat et à l’âge.',
      next:'Vérifie les mentions de ton contrat et la fiche officielle à jour, notamment les règles de rémunération qui évoluent.',
      tags:['contrat','alternance'],source:[['Service Public — contrat d’apprentissage (mise à jour 2026)','https://www.service-public.fr/particuliers/vosdroits/F2918']]},
    {id:'fr-annonce',country:'FR',category:'Vérification',kind:'Mise en situation',mins:2,
      punch:'« Le ministre l’a annoncé : c’est déjà la loi ! »',
      setup:'Une vidéo virale cite une nouvelle mesure, sans numéro de texte ni date. Les commentaires présentent la mesure comme applicable dès aujourd’hui.',
      question:'Quelle action fait vraiment progresser ta vérification ?',choices:['Chercher le texte au Journal officiel et la date d’entrée en vigueur.','Faire confiance au nombre de vues.','Considérer toutes les annonces officielles comme automatiquement applicables.'],answer:0,
      why:'Une annonce, un texte adopté, une promulgation, une publication et une entrée en vigueur sont des étapes distinctes. Le processus français est expliqué par Vie publique et les textes officiels sont consultables sur Légifrance.',
      next:'Demande le numéro du texte et vérifie sa version, son champ d’application et sa date.',
      tags:['promulgation','entrée en vigueur'],source:[['Vie publique — comment les lois sont-elles exécutées ?','https://www.vie-publique.fr/fiches/19534-comment-les-lois-sont-elles-executees'],['Légifrance — textes officiels','https://www.legifrance.gouv.fr']]},
    {id:'be-contrat',country:'BE',category:'Travail',kind:'Mise en situation',mins:2,
      punch:'Tu commences ton job demain, sans contrat écrit. Normal ?',
      setup:'Un employeur te dit : « On fera les papiers à la fin du mois, viens travailler d’abord. » Tu es engagé comme étudiant.',
      question:'Quelle démarche est la plus prudente ?',choices:['Travailler plusieurs semaines puis demander le contrat.','Demander un contrat d’occupation d’étudiant écrit avant le début du travail.','Accepter uniquement une promesse par message vocal.'],answer:1,
      why:'Le contrat d’occupation d’étudiant en Belgique doit être établi par écrit et signé au plus tard lorsque l’étudiant commence le travail.',
      next:'Demande le contrat, vérifie les horaires et garde une copie signée. Renseigne-toi si l’employeur refuse.',
      tags:['contrat écrit','étudiant'],source:[['Student@work — contrat étudiant','https://www.studentatwork.be/fr/'] ]},
    {id:'fr-salaire',country:'FR',category:'Travail',kind:'Mise en situation',mins:2,
      punch:'Ton salaire est en retard, et le patron te demande de patienter.',
      setup:'Tu as travaillé le mois dernier. Ton employeur dit « je paierai quand je pourrai », sans te donner de date.',
      question:'Quelle réaction est la mieux fondée ?',choices:['Conserver les preuves et demander formellement le versement dû.','Accepter que le salaire soit facultatif.','Publier ses données personnelles pour le forcer.'],answer:0,
      why:'La rémunération du travail salarié est une obligation de l’employeur. En cas de retard ou de non-paiement, des démarches et recours existent.',
      next:'Rassemble contrat, bulletins et relevés. Consulte les démarches actualisées sur Service-Public.fr.',
      tags:['salaire','recours'],source:[['Service Public — paiement du salaire','https://www.service-public.fr/particuliers/vosdroits/F2308']]},
    {id:'both-video',country:'ALL',category:'Réseaux',kind:'Simulation fictive',mins:2,
      punch:'La vidéo fait 2 millions de vues. Elle dit forcément vrai ?',
      setup:'SIMULATION : une vidéo montre une capture d’écran coupée et dit « le gouvernement a tout changé hier ». Aucune source, aucun lien, aucun texte exact.',
      question:'Quel réflexe est le plus fiable ?',choices:['Partager rapidement pour avertir tout le monde.','Identifier l’affirmation exacte puis retrouver une source primaire datée.','Refuser systématiquement toute information venant d’une vidéo.'],answer:1,
      why:'Une forte audience ne prouve pas une affirmation. Il faut pouvoir retrouver la source, la date, le contexte et, pour une règle juridique, la version applicable du texte.',
      next:'Apprends à distinguer un document, son commentaire, une interprétation et une preuve.',
      tags:['source primaire','désinformation'],source:[['Eurobaromètre — réseaux sociaux et désinformation (2025)','https://europa.eu/eurobarometer/surveys/detail/3592']]}
  ];

  /* Catalogue optionnel : les anciennes données et les contenus précédents restent lisibles. */
  const BETA_CATALOG=window.SAVREO_BETA&&typeof window.SAVREO_BETA==='object'?window.SAVREO_BETA:{scenarios:[],lessons:[]};
  const BETA_SCENARIOS=Array.isArray(BETA_CATALOG.scenarios)?BETA_CATALOG.scenarios.filter(c=>c&&c.kind==='Simulation fictive'&&Array.isArray(c.choices)&&Array.isArray(c.source)):[];
  const BETA_LESSONS=Array.isArray(BETA_CATALOG.lessons)?BETA_CATALOG.lessons.filter(l=>l&&Array.isArray(l.text)&&Array.isArray(l.sources)):[];
  const existingCaseIds=new Set(scenarios.map(c=>c.id)),existingLessonIds=new Set(lessons.map(l=>l.id));
  scenarios.push(...BETA_SCENARIOS.filter(c=>!existingCaseIds.has(c.id)));
  lessons.push(...BETA_LESSONS.filter(l=>!existingLessonIds.has(l.id)));
  const ageMatch=item=>Array.isArray(item.ageGroups)&&item.ageGroups.includes(state.ageGroup);
  const interestsMatch=item=>Array.isArray(item.interestIds)&&item.interestIds.some(id=>chosenInterests().includes(id));
  const contentPriority=item=>(ageMatch(item)?3:0)+(interestsMatch(item)?5:0);
  const ageSuggestion=l=>ageMatch(l)?'· Pour ton âge':'';
  const ageHint=item=>Array.isArray(item.ageGroups)&&item.ageGroups.length?' · '+item.ageGroups.join(', ').replaceAll('12-15','12–15').replaceAll('16-20','16–20').replaceAll('21-28','21–28')+' ans':'';
  const suggestedCases=()=>byCountry().filter(c=>ageMatch(c)).sort((a,b)=>contentPriority(b)-contentPriority(a));
  const selectedCaseList=()=>byCountry().slice().sort((a,b)=>contentPriority(b)-contentPriority(a));

  const words = [
    {id:'amendement',term:'Amendement',level:'Institutions',easy:'Une modification proposée à un texte en discussion.',use:'« Un amendement a changé le projet avant le vote. »',q:'À quoi sert principalement un amendement ?',opts:['Modifier un texte en cours d’examen.','Publier une loi déjà en vigueur.','Dissoudre automatiquement un Parlement.'],answer:0},
    {id:'promulgation',term:'Promulgation',level:'Institutions',easy:'Une étape juridique par laquelle l’autorité compétente authentifie une loi après son adoption, selon les règles du pays.',use:'« La promulgation ne remplace pas la vérification de l’entrée en vigueur. »',q:'La promulgation signifie-t-elle que toutes les dispositions s’appliquent toujours immédiatement ?',opts:['Oui, sans aucune exception.','Non, il faut aussi vérifier la publication et les dates applicables.','Seulement si la loi est très populaire.'],answer:1},
    {id:'cotisations',term:'Cotisations sociales',level:'Argent & travail',easy:'Des sommes versées pour financer des protections sociales, selon le régime applicable.',use:'« Mon salaire net dépend notamment de mes cotisations. »',q:'À quoi sont liées les cotisations sociales ?',opts:['Au financement de la protection sociale.','Au nombre de likes d’une entreprise.','À une amende systématique.'],answer:0},
    {id:'revendication',term:'Revendication',level:'Société',easy:'Une demande formulée pour obtenir un changement ou défendre un intérêt.',use:'« Les revendications d’un syndicat ne sont pas automatiquement des décisions publiques. »',q:'Une revendication est avant tout…',opts:['Une demande ou une exigence défendue.','Une loi appliquée partout.','Un jugement définitif.'],answer:0},
    {id:'contreexemple',term:'Contre-exemple',level:'Débat',easy:'Un exemple concret qui montre qu’une affirmation générale n’est pas toujours vraie.',use:'« Un parcours réussi sans diplôme supérieur est un contre-exemple à “tous les parcours exigent un diplôme”. »',q:'Que peut démontrer un contre-exemple pertinent ?',opts:['Que toute opinion est fausse.','Qu’une affirmation universelle est fausse.','Que les exceptions sont impossibles.'],answer:1},
    {id:'refutation',term:'Réfutation',level:'Débat',easy:'Une réponse argumentée montrant pourquoi une affirmation ne tient pas, entièrement ou en partie.',use:'« Je réfute la conclusion, pas la personne. »',q:'Une réfutation solide consiste à…',opts:['Attaquer la personne.','Répondre au raisonnement avec des arguments.','Parler plus fort.'],answer:1},
    {id:'nuance',term:'Nuancer',level:'Débat',easy:'Ajouter des distinctions pour ne pas tout réduire à “oui” ou “non”.',use:'« L’argent aide à vivre, mais ne garantit pas l’épanouissement. »',q:'Que signifie « nuancer » ?',opts:['Changer d’avis sans raison.','Admettre des distinctions pertinentes.','Supprimer toute conclusion.'],answer:1},
    {id:'vigueur',term:'Entrée en vigueur',level:'Droit',easy:'Moment où une règle de droit commence à s’appliquer, dans les conditions prévues.',use:'« Ce texte a été publié, mais quelle est sa date d’entrée en vigueur ? »',q:'Qu’est-ce qui indique quand une disposition devient applicable ?',opts:['Sa date d’entrée en vigueur.','Le score de popularité du ministre.','Le nombre de partages du texte.'],answer:0},
    {id:'competence',term:'Compétence',level:'Institutions',easy:'Dans les institutions, domaine dans lequel une autorité est habilitée à décider.',use:'« L’enseignement relève de compétences différentes selon le pays et le niveau de pouvoir. »',q:'Dans le langage institutionnel, une compétence désigne…',opts:['Un domaine de décision attribué à une autorité.','Une opinion personnelle.','Un sondage électoral.'],answer:0},
    {id:'source',term:'Source primaire',level:'Esprit critique',easy:'Le document ou témoignage initial à partir duquel on peut vérifier une information.',use:'« Pour une loi, je cherche le texte officiel plutôt qu’une capture recadrée. »',q:'Pour vérifier le contenu exact d’une loi, quelle source privilégier ?',opts:['Un commentaire sans lien.','Le texte publié sur le portail officiel.','Une phrase virale isolée.'],answer:1},
    {id:'sophisme',term:'Sophisme',level:'Esprit critique',easy:'Un raisonnement qui paraît convaincant mais comporte un défaut logique.',use:'« Deux événements successifs ne prouvent pas que le premier cause le second. »',q:'Un sophisme concerne surtout…',opts:['Une erreur dans le raisonnement.','Une faute dans une date de naissance.','Un terme juridique en vigueur.'],answer:0},
    {id:'jurisprudence',term:'Jurisprudence',level:'Droit',easy:'Ensemble de décisions rendues par les tribunaux ; elles éclairent la manière dont le droit est interprété.',use:'« La jurisprudence peut aider à comprendre comment une règle est appliquée. »',q:'La jurisprudence rassemble principalement…',opts:['Des décisions de justice.','Des promesses électorales.','Des sondages.'],answer:0},
    {id:'deliberation',term:'Délibération',level:'Institutions',easy:'Discussion et examen d’une question avant qu’un organe collectif prenne une décision.',use:'« Le conseil délibère avant le vote. »',q:'Une délibération implique surtout…',opts:['Une décision prise sans discussion.','Un examen collectif avant une décision.','Une sanction automatique.'],answer:1},
    {id:'preavis',term:'Préavis',level:'Travail',easy:'Délai à respecter ou période de notification dans certaines situations, notamment avant la fin d’un contrat.',use:'« La durée du préavis dépend du statut, du contrat et de la loi applicable. »',q:'Un préavis correspond souvent à…',opts:['Un délai à observer avant un changement prévu.','Une augmentation obligatoire.','Un vote populaire.'],answer:0},
    {id:'proportionnalite',term:'Proportionnalité',level:'Esprit critique',easy:'Principe selon lequel une mesure doit garder un rapport raisonnable avec le but poursuivi.',use:'« Une restriction doit être examinée au regard de son objectif et de sa proportionnalité. »',q:'Quel élément se vérifie dans l’idée de proportionnalité ?',opts:['Le rapport entre une mesure et son objectif.','La popularité d’une vidéo.','La vitesse d’une annonce.'],answer:0},
    {id:'hierarchie',term:'Hiérarchie des normes',level:'Droit',easy:'Organisation des règles juridiques selon leur niveau et leurs rapports de validité.',use:'« Un règlement ne peut pas contredire une norme supérieure qui lui est applicable. »',q:'La hiérarchie des normes sert notamment à…',opts:['Classer les citoyens selon leur revenu.','Vérifier la cohérence des règles juridiques.','Compter les amendements.'],answer:1},
    {id:'biais',term:'Biais de confirmation',level:'Esprit critique',easy:'Tendance à rechercher surtout les informations qui confirment ce que l’on croit déjà.',use:'« Pour éviter mon biais de confirmation, je cherche aussi des arguments contraires. »',q:'Pour limiter le biais de confirmation, il est utile de…',opts:['Éviter tous les désaccords.','Consulter des preuves qui pourraient contredire son idée.','Lire uniquement les avis identiques au sien.'],answer:1},
    {id:'presomption',term:'Présomption',level:'Droit',easy:'Conséquence qu’une règle de droit tire provisoirement d’un fait ou d’une situation ; certaines présomptions peuvent être contestées.',use:'« La présomption d’innocence protège une personne avant qu’une culpabilité soit établie légalement. »',q:'La présomption d’innocence signifie que…',opts:['Toute accusation suffit à établir la culpabilité.','Une personne est présumée innocente jusqu’à établissement légal de sa culpabilité.','Les enquêtes sont interdites.'],answer:1}
  ];
  let activeScenario = null;
  let caseChoice = null;
  let caseReveal = false;
  let activeWord = null;
  let wordReveal = false;
  let wordChoice = null;
  let wordCheck = false;
  const byCountry = () => scenarios.filter(x=>x.country===state.country || x.country==='ALL');
  const todayCase = () => {
    const all=byCountry();
    const age=suggestedCases();
    const personalized=age.filter(c=>interestsMatch(c));
    const pool=personalized.length?personalized:age.length?age:all;
    const day=Number(dayKey().replace(/\D/g,''));
    return pool[day%pool.length];
  };
  const shortSource = s => s.map(([label,url])=>source(label,url)).join(' ');
  function cases(){const entries=byCountry();const selected=entries.find(x=>x.id===activeScenario)||todayCase();const ordered=entries.filter(x=>x.id!==selected.id).sort((a,b)=>contentPriority(b)-contentPriority(a));
    const options=selected.choices.map((txt,i)=>`<button class="case-option ${caseChoice===i?'selected':''}" data-case-choice="${i}" ${caseReveal?'disabled':''}><span class="option-letter">${String.fromCharCode(65+i)}</span><span>${escapeHTML(txt)}</span></button>`).join('');
    const result=caseReveal?`<div class="case-reveal ${caseChoice===selected.answer?'right':'wrong'}"><b>${caseChoice===selected.answer?'Bien vu. Tu as déjoué le piège.':'À revoir. Voici ce que disent les sources.'}</b><p>${escapeHTML(selected.why)}</p><div class="step-note">Ton réflexe : ${escapeHTML(selected.next)}</div><div class="source-block"><div class="topic-label">SOURCES DATÉES OU OFFICIELLES</div>${shortSource(selected.source)}</div></div>`:'';
    return `${intro('DÉCLIC · DES SITUATIONS QUI TE CONCERNENT','Et toi, tu ferais quoi ?','Des cas courts, réels ou simulés et clairement étiquetés. Tu réponds d’abord, tu découvres les preuves ensuite.')}<details class="calm-disclosure calm-before-question"><summary>Changer de situation <span aria-hidden="true">＋</span></summary><div class="chips scenario-picker">${entries.map(x=>`<button class="chip ${selected.id===x.id?'active':''}" data-case="${x.id}">${escapeHTML(x.punch)}</button>`).join('')}</div></details><section class="case-story"><div class="story-meta"><span class="pill purple">${escapeHTML(selected.kind)}</span><span>${selected.mins} MIN · ${state.country==='BE'?'BELGIQUE':'FRANCE'}</span></div><div class="story-number">SAVRÉO / ${String(entries.indexOf(selected)+1).padStart(2,'0')}</div><h2>${escapeHTML(selected.punch)}</h2><p class="story-copy">${escapeHTML(selected.setup)}</p><div class="story-question">${escapeHTML(selected.question)}</div><div class="case-options">${options}</div><button class="btn primary" id="case-submit" ${caseChoice===null||caseReveal?'disabled':''}>Vérifier mon réflexe →</button>${result}${caseReveal && caseChoice!==selected.answer?'<button class="btn ghost small" id="case-retry">Réessayer ce cas →</button>':''}</section><details class="calm-disclosure"><summary>Explorer d’autres situations <span aria-hidden="true">＋</span></summary><div class="calm-lesson-list">${ordered.map(x=>`<button class="case-teaser" data-case="${x.id}"><span class="topic-label">${escapeHTML(x.category)} · ${x.mins} MIN</span><strong>${escapeHTML(x.punch)}</strong><span class="card-action">Voir le cas →</span></button>`).join('')}</div></details><details class="calm-disclosure"><summary>Précautions et vérifications <span aria-hidden="true">＋</span></summary><p class="tool-footer">Scénarios de démonstration : vérification spécialisée en attente. Sources documentées le ${checkedDate}. Les simulations ne sont pas des actualités et une annonce n’est pas une loi.</p></details>`;
  }
  function dictionary(){const w=words.find(x=>x.id===activeWord)||words[0];return `${intro('LE DICO · SANS COMPLEXE','Parle avec précision.','Un mot compliqué, une définition claire, une phrase utile, une question pour le retenir.')}<div class="word-spot"><div><span class="eyebrow">MOT À DÉBLOQUER</span><h2>${escapeHTML(w.term)}</h2><p class="muted">${escapeHTML(w.level)}</p></div><button class="btn ${wordReveal?'ghost':'primary'}" id="word-flip">${wordReveal?'Masquer':'Voir en clair'} →</button></div>${wordReveal?`<div class="card" style="margin-top:12px"><h3>En clair</h3><p class="word-definition">${escapeHTML(w.easy)}</p><div class="quote">${escapeHTML(w.use)}</div><div class="inner-separator"></div><h3>Tu as vraiment compris ?</h3><p>${escapeHTML(w.q)}</p><div class="case-options">${w.opts.map((o,i)=>`<button class="case-option ${wordChoice===i?'selected':''}" data-word-choice="${i}" ${wordCheck?'disabled':''}><span class="option-letter">${String.fromCharCode(65+i)}</span>${escapeHTML(o)}</button>`).join('')}</div><button class="btn primary" id="word-submit" ${wordChoice===null||wordCheck?'disabled':''}>Valider →</button>${wordCheck && wordChoice!==w.answer?'<button class="btn ghost small" id="word-retry">Réessayer →</button>':''}${wordCheck?`<div class="feedback ${wordChoice===w.answer?'good':'attn'}">${wordChoice===w.answer?'Bien joué. Tu sais employer ce terme.':'Ce n’est pas encore ça. Relis la définition et essaie un autre mot.'}</div>`:''}</div>`:''}<details class="calm-disclosure"><summary>Tous les mots · ${state.completed.filter(x=>x.startsWith('word:')).length}/${words.length} appris <span aria-hidden="true">＋</span></summary><div class="calm-lesson-list">${words.map(x=>`<button class="word-tile ${w.id===x.id?'selected':''}" data-word="${x.id}"><small>${escapeHTML(x.level)}</small><b>${escapeHTML(x.term)}</b>${state.completed.includes('word:'+x.id)?'<span class="word-check">✓ acquis</span>':'<span>Découvrir →</span>'}</button>`).join('')}</div></details>`;}

  function onboarding(){
    const editing=profileEditing;
    const selectedAge=AGE_GROUPS[state.ageGroup]?state.ageGroup:'';
    const checked = (actual, expected) => actual===expected ? ' checked' : '';
    return `<section class="onboarding-shell" aria-labelledby="onboarding-title">
      <div class="onboarding-brand"><span class="onboarding-symbol" aria-hidden="true">S</span><span>SAVRÉO<span class="brand-dot">.</span></span><button type="button" id="theme-entry" class="theme-entry" aria-label="Changer de mode clair ou sombre">${document.documentElement.dataset.theme==='light'?'☾':'☀'}</button></div>
      <div class="onboarding-head"><span class="eyebrow">TON ESPACE, TON RYTHME</span><h1 id="onboarding-title">${editing?'Personnalise ton parcours.':'Bienvenue dans un monde à comprendre.'}</h1><p>${editing?'Modifie tes préférences quand tu veux. Ta progression restera intacte.':'Trois petites informations pour commencer avec des sujets qui te parlent.'}</p></div>
      <form id="onboarding-form" class="onboarding-form">
        <div class="onboarding-field">
          <label class="onboarding-label" for="onboarding-name">Comment on t’appelle ?</label>
          <input id="onboarding-name" name="firstName" type="text" maxlength="24" autocomplete="given-name" placeholder="Ton prénom ou un pseudo" value="${escapeHTML(state.firstName||'')}" required />
          <small>Un prénom ou un pseudo suffit. Pas besoin de nom de famille.</small>
        </div>
        <fieldset class="onboarding-field"><legend class="onboarding-label">Quelle est ta tranche d’âge ?</legend>
          <div class="age-options">
          ${Object.entries(AGE_GROUPS).map(([value,label])=>`<label class="age-choice"><input type="radio" name="ageGroup" value="${value}" ${checked(selectedAge,value)} required><span>${label}</span></label>`).join('')}
          </div><small>Pour te recommander les situations les plus pertinentes. Tous les thèmes restent accessibles.</small>
        </fieldset>
        <fieldset class="onboarding-field"><legend class="onboarding-label">Ton genre <span class="field-optional">· facultatif</span></legend>
          <div class="gender-options">
          ${[['feminin','Féminin'],['masculin','Masculin'],['autre','Autre'],['','Ne pas préciser']].map(([value,label])=>`<label class="gender-choice"><input type="radio" name="gender" value="${value}" ${checked(state.gender||'',value)}><span>${label}</span></label>`).join('')}
          </div><small>Ce choix personnalise uniquement certaines formulations, jamais les sujets accessibles.</small>
        </fieldset>
        <button class="btn primary onboarding-submit" type="submit">${editing?'Enregistrer mes préférences':'Commencer à apprendre'} <span aria-hidden="true">→</span></button>
        ${editing?'<button type="button" class="onboarding-cancel" id="cancel-onboarding">Revenir à mon parcours</button>':''}
      </form>
      <p class="onboarding-privacy"><span aria-hidden="true">⌁</span> Aucune création de compte. Ces informations restent dans ton navigateur et sont modifiables ou effaçables à tout moment.</p>
    </section>`;
  }
  function interestsScreen(){
    const selected=chosenInterests();
    return `<section class="onboarding-shell interests-shell" aria-labelledby="interests-title">
      <div class="onboarding-brand"><span class="onboarding-symbol" aria-hidden="true">S</span><span>SAVRÉO<span class="brand-dot">.</span></span><button type="button" id="theme-entry" class="theme-entry" aria-label="Changer de mode clair ou sombre">${document.documentElement.dataset.theme==='light'?'☾':'☀'}</button></div>
      <div class="onboarding-head"><span class="eyebrow">${interestsEditing?'PERSONNALISER TON PARCOURS':'ÉTAPE 2 SUR 2 · À TON RYTHME'}</span><h1 id="interests-title">Qu’est-ce qui t’intéresse ?</h1><p>Choisis jusqu’à 3 sujets. On te proposera des situations qui te parlent, sans cacher le reste de SAVRÉO.</p></div>
      <form id="interests-form" class="onboarding-form">
        <fieldset class="onboarding-field"><legend class="onboarding-label">Tes centres d’intérêt <span class="field-optional">· facultatif</span></legend>
        <div class="interest-grid">${INTERESTS.map(t=>`<label class="interest-choice"><input type="checkbox" name="interests" value="${t.id}" ${selected.includes(t.id)?'checked':''}><span class="interest-tile"><span class="interest-emoji" aria-hidden="true">${t.emoji}</span><b>${escapeHTML(t.label)}</b><small>${escapeHTML(t.detail)}</small><span class="interest-check" aria-hidden="true">✓</span></span></label>`).join('')}</div>
        <p class="interest-counter" id="interests-count" role="status" aria-live="polite">${selected.length}/3 sujets choisis</p></fieldset>
        <button type="submit" class="btn primary onboarding-submit">${interestsEditing?'Enregistrer mes choix':'Accéder à mon espace'} <span aria-hidden="true">→</span></button>
        ${interestsEditing?'<button type="button" class="onboarding-cancel" id="cancel-interests">Retour à mon parcours</button>':'<button type="button" class="onboarding-cancel" id="skip-interests">Passer pour le moment</button>'}
      </form>
      <p class="onboarding-privacy">Tu peux changer d’avis dans « Mon parcours ». Aucun centre d’intérêt ne bloque les autres contenus. Tes choix restent sur cet appareil.</p>
    </section>`;
  }
  function recommendedLesson(){
    const byAge={'12-15':['penser','debate','argument'],'16-20':['economy','argument','droits'],'21-28':['lois','droits','economy']};
    const fromInterests=chosenInterests().flatMap(id=>INTERESTS.find(t=>t.id===id)?.lessons||[]);
    const beta=lessons.filter(l=>ageMatch(l)).sort((a,b)=>contentPriority(b)-contentPriority(a));
    const preferred=[...beta,...[...new Set([...fromInterests,...(byAge[state.ageGroup]||[])])].map(id=>lessons.find(l=>l.id===id)).filter(Boolean)];
    return preferred.find(l=>!state.completed.includes('lesson:'+l.id))
      || lessons.find(l=>!state.completed.includes('lesson:'+l.id)) || lessons[0];
  }

  const LESSON_REFERENCES={
    penser:[['CLEMI — esprit critique et informations','https://www.clemi.fr/familles/publications/grandir-dans-un-monde-connecte-ca-sapprend/apprendre-sinformer-et-developper-son-esprit-critique/ou-les-enfants-et-les-adolescents-sinforment-ils-aujourdhui']],
    argument:[['Édubase — organiser un débat citoyen','https://edubase.eduscol.education.fr/fiche/16392']],
    lois:[['Belgique — La Chambre','https://www.lachambre.be/kvvcr/index.cfm?language=fr'],['France — Vie publique','https://www.vie-publique.fr']],
    droits:[['Conseil de l’Europe — droits fondamentaux','https://www.coe.int/fr/web/compass/european-convention-on-human-rights']],
    economy:[['BCE — qu’est-ce que l’inflation ?','https://www.ecb.europa.eu/ecb-and-you/explainers/tell-me-more/html/what_is_inflation.fr.html']],
    debate:[['Édubase — le débat citoyen','https://edubase.eduscol.education.fr/fiche/16392']]
  };
  const JOURNEYS=[
    {id:'medias',icon:'◈',title:'Décrypter une info',desc:'Une vidéo virale, une méthode de vérification, un argument.',case:{BE:'both-video',FR:'both-video'},lesson:'penser',debate:3},
    {id:'travail',icon:'▤',title:'Comprendre l’argent et le travail',desc:'Un cas concret, une notion économique, une mise en pratique.',case:{BE:'be-heures',FR:'fr-apprenti'},lesson:'economy',debate:0},
    {id:'droits',icon:'⚖',title:'Connaître ses droits',desc:'Une situation de société, la règle, puis un débat argumenté.',case:{BE:'be-manif',FR:'fr-manif'},lesson:'lois',debate:2}
  ];
  JOURNEYS.push(
    {id:'reflexe-info',icon:'◎',title:'Garder le contrôle de ce que tu partages',desc:'Apprendre à vérifier une capture avant de la relayer.',ageGroups:['12-15'],interestIds:['reseaux','culture'],case:{BE:'beta-capture',FR:'beta-capture'},lesson:'info-context',debate:5},
    {id:'reflexe-securite',icon:'✳',title:'Déjouer une arnaque en ligne',desc:'Identifier une fausse offre et répondre avec méthode.',ageGroups:['16-20'],interestIds:['reseaux','argent'],case:{BE:'beta-recrutement',FR:'beta-recrutement'},lesson:'online-scams',debate:6},
    {id:'reflexe-logement',icon:'⌂',title:'Éviter une fausse location',desc:'Vérifier un logement, son annonce et les bons réflexes.',ageGroups:['21-28'],interestIds:['argent','droits'],case:{BE:'beta-appart',FR:'beta-appart'},lesson:'rent-smart',debate:7}
  );
  const reviewsData=()=>state.reviews && typeof state.reviews==='object' && !Array.isArray(state.reviews)?state.reviews:{};
  const reviewIntervals=[1,3,7,14,30];
  const reviewDate=days=>{const d=new Date(dayKey()+'T12:00:00Z');d.setUTCDate(d.getUTCDate()+days);return d.toISOString().slice(0,10);};
  function queueReview(id){const data=reviewsData();if(!data[id]){data[id]={stage:0,due:reviewDate(1),attempts:0};state.reviews=data;setStore();}}
  function dueReviews(){return lessons.filter(l=>reviewsData()[l.id] && reviewsData()[l.id].due<=dayKey());}
  function recordReview(id,correct){const data=reviewsData(),old=data[id];if(!old)return;const stage=correct?Math.min(old.stage+1,4):0;data[id]={stage,due:reviewDate(reviewIntervals[stage]),attempts:(old.attempts||0)+1};state.reviews=data;setStore();}
  function journeyChecks(j){return [state.completed.includes('case:'+j.case[state.country]),state.completed.includes('lesson:'+j.lesson),(Array.isArray(state.journeyDebates)?state.journeyDebates:[]).includes(j.id)];}


  function journeys(){
    const journeyCard=j=>{
      const checks=journeyChecks(j),count=checks.filter(Boolean).length;
      const steps=[['01','Réagir à une situation','case'],['02','Comprendre et se tester','lesson'],['03','Défendre sa conclusion','debate']];
      const controls=steps.map(([n,label,kind],i)=>{
        const available=i===0 || checks[i-1];
        return '<button type="button" class="journey-step" data-journey="'+j.id+'" data-stage="'+kind+'" '+(available?'':'disabled')+' aria-label="'+escapeHTML(label)+(checks[i]?', terminé':available?', à faire':', verrouillé')+'"><span class="journey-number">'+(checks[i]?'✓':n)+'</span><span>'+escapeHTML(label)+'</span><span aria-hidden="true">'+(available?'↗':'•')+'</span></button>';
      }).join('');
      return '<article class="card learning-card calm-journey-card"><div class="learning-card-top"><span class="learning-icon" aria-hidden="true">'+j.icon+'</span><span class="pill grey">'+count+'/3 étapes</span></div><h3>'+escapeHTML(j.title)+'</h3><p>'+escapeHTML(j.desc)+'</p><div class="progressbar" role="progressbar" aria-label="Progression du parcours" aria-valuenow="'+count+'" aria-valuemin="0" aria-valuemax="3"><i style="width:'+(count/3*100)+'%"></i></div><div class="journey-steps">'+controls+'</div></article>';
    };
    const first=JOURNEYS.find(j=>journeyChecks(j).some(Boolean)&&!journeyChecks(j).every(Boolean))||JOURNEYS.slice().sort((a,b)=>contentPriority(b)-contentPriority(a))[0];
    return intro('MES PARCOURS','Un objectif, trois étapes.','Une situation, une explication, puis un exercice pour appliquer ce que tu as appris.')+
      '<div class="calm-feature-lesson">'+journeyCard(first)+'</div>'+
      '<details class="calm-disclosure"><summary>Découvrir les autres parcours <span aria-hidden="true">＋</span></summary><div class="calm-lesson-list">'+JOURNEYS.filter(j=>j.id!==first.id).sort((a,b)=>contentPriority(b)-contentPriority(a)).map(journeyCard).join('')+'</div></details>'+
      '<button class="calm-footer-link" data-route="reviser">Revoir ce que j’ai appris <span aria-hidden="true">→</span></button>'+
      '<details class="calm-disclosure"><summary>À propos des situations proposées <span aria-hidden="true">＋</span></summary><p class="muted small">Ces exercices sont pédagogiques, pas des certifications. Les règles juridiques dépendent du pays et de la situation. Consulte toujours les sources officielles.</p></details>';
  }

  function reviewPage(){
    const due=dueReviews();
    const microDue=dueMicroReviews();
    const selected=lessons.find(l=>l.id===reviewLessonId && (reviewResult!==null || due.includes(l)));
    let testing='';
    if(selected){
      const opts=selected.choices.map((v,i)=>'<label class="option"><input type="radio" name="answer" value="'+i+'" '+(reviewChoice===i?'checked':'')+' '+(reviewResult!==null?'disabled':'')+'><span>'+escapeHTML(v)+'</span></label>').join('');
      const feedback=reviewResult===null?'':'<div class="feedback '+(reviewResult?'good':'attn')+'"><b>'+(reviewResult?'Bien retenu.':'À revoir.')+'</b> '+escapeHTML(selected.why)+'<p class="small">Prochain rappel : '+escapeHTML(reviewsData()[selected.id]?.due||'à programmer')+'</p></div><button class="btn ghost" data-route="reviser">Retour aux révisions →</button>';
      testing='<section class="card review-test"><span class="pill purple">RAPPEL DE MÉMOIRE</span><h2>'+escapeHTML(selected.q)+'</h2><form id="review-quiz">'+opts+'<button class="btn primary" type="submit" '+(reviewResult!==null?'disabled':'')+'>Vérifier mon souvenir</button></form>'+feedback+'</section>';
    }
    const pending=due.filter(l=>l.id!==reviewLessonId);
    const waiting=pending.map(l=>'<button class="card review-choice" data-review="'+l.id+'"><span class="pill grey">'+escapeHTML(l.tag)+'</span><b>'+escapeHTML(l.title)+'</b><span class="card-action">Me tester →</span></button>').join('');
    const scheduled=lessons.filter(l=>reviewsData()[l.id]);
    const list=scheduled.map(l=>'<div><span>'+escapeHTML(l.title)+'</span><small>Prochain rappel : '+escapeHTML(reviewsData()[l.id].due)+'</small></div>').join('');
    const microButton=c=>'<button class="card review-choice" type="button" data-micro-review="'+escapeHTML(c.id)+'"><span class="pill grey">'+escapeHTML(c.topic)+'</span><b>'+escapeHTML(c.title)+'</b><span class="card-action">Me tester →</span></button>';
    const microWaiting=microDue.slice(0,3).map(microButton).join('');
    const microLater=microDue.slice(3).map(microButton).join('');
    const moreReviews=microLater?'<details class="calm-disclosure"><summary>Voir '+(microDue.length-3)+' autres révisions <span aria-hidden="true">＋</span></summary><div class="learning-grid">'+microLater+'</div></details>':'';
    return intro('RÉVISIONS · MÉMORISATION','Retenir ce qui compte.','Réponds de mémoire le lendemain, puis après 3, 7, 14 et 30 jours si tu réussis. Un oubli n’est pas un échec.')+
      '<div class="review-summary"><strong>'+(due.length+microDue.length)+'</strong><span>révision(s) disponible(s)</span></div>'+testing+
      ((waiting||microWaiting)?'<div class="learning-grid">'+waiting+microWaiting+'</div>':selected?'':'<div class="blank-state">Aucune révision à faire aujourd’hui. Valide une leçon ou un savoir essentiel pour planifier ton premier rappel.</div>')+
      moreReviews+
      (list?'<details class="calm-disclosure"><summary>Voir le calendrier des prochains rappels <span aria-hidden="true">＋</span></summary><div class="review-schedule">'+list+'</div></details>':'');
  }

  function editorialPage(){
    const info=[
      ['Sources officielles','Un contenu juridique doit renvoyer vers une institution ou un texte vérifiable.'],
      ['Fait, opinion, annonce','Un communiqué n’est pas une loi applicable ; une situation inventée doit être identifiée comme telle.'],
      ['Vérification indépendante','Les fiches du pilote n’ont pas encore été relues par un spécialiste externe.']
    ];
    const cards=info.map(([title,body])=>'<div class="calm-source-point"><h3>'+title+'</h3><p>'+body+'</p></div>').join('');
    const links=SOURCES[state.country].slice(0,5).map(x=>'<a class="hub-item" target="_blank" rel="noopener noreferrer" href="'+safeURL(x.url)+'"><span class="hub-mark" aria-hidden="true">↗</span><span><b>'+escapeHTML(x.name)+'</b><small>'+escapeHTML(x.description)+'</small></span><span aria-hidden="true">↗</span></a>').join('');
    return intro('NOS SOURCES','Tu peux vérifier.','La transparence est aussi importante que la réponse.')+
      '<div class="calm-reading calm-source-content">'+cards+'</div>'+
      '<details class="calm-disclosure"><summary>Consulter les institutions <span aria-hidden="true">＋</span></summary><div class="calm-submenu">'+links+'</div></details>';
  }

  function welcome(){
    const focus=todayCase(),next=recommendedLesson(),due=dueReviews().length,done=state.completed.filter(x=>x.startsWith('lesson:')).length;
    return `<section class="calm-greeting"><span class="eyebrow">BONJOUR ${escapeHTML(state.firstName)}</span><h1>Une chose à la fois.</h1><p>Un petit déclic, de grandes idées.</p></section>
      <section class="daily-feature calm-feature" aria-label="Déclic du jour">
        <div class="calm-feature-meta"><span class="eyebrow">DÉCLIC DU JOUR</span><span class="pill grey">${focus.mins} min</span></div>
        <h2>${escapeHTML(focus.punch)}</h2>
        <button class="btn primary" type="button" data-route="declic">Découvrir la réponse →</button>
      </section>
      <section class="calm-next" aria-label="Continuer mon parcours">
        <div class="section-heading calm-section"><h2>Continuer</h2></div>
        <button class="resume-card" data-lesson="${next.id}"><span class="resume-icon" aria-hidden="true">▤</span><span class="resume-content"><b>${escapeHTML(next.title)}</b><small>${next.mins} min · ${done}/${lessons.length} leçons terminées</small></span><span aria-hidden="true">↗</span></button>
        ${due? `<button class="calm-inline" data-route="reviser"><span aria-hidden="true">↺</span> ${due} révision${due>1?'s':''} à faire <span aria-hidden="true">→</span></button>`:''}
      </section>
      <button class="calm-footer-link" data-route="explorer">Explorer tous les sujets <span aria-hidden="true">→</span></button>`;
  }



  function publicHub(){
    const snapshot=Array.isArray(CIVIC_PACK.snapshots)?CIVIC_PACK.snapshots.find(x=>x.country===state.country):null;
    const sources=Array.isArray(CIVIC_PACK.localSources?.[state.country])?CIVIC_PACK.localSources[state.country]:[];
    const categories=[
      ['all','Tous les niveaux'],['national',state.country==='BE'?'Fédéral':'National'],
      ['regional','Région'],['local','Ville / commune']
    ].filter(([id])=>id==='all'||sources.some(x=>x.level===id));
    if(!categories.some(([id])=>id===publicScope))publicScope='all';
    const chosen=sources.filter(x=>publicScope==='all'||x.level===publicScope);
    const filters=categories.map(([id,label])=>'<button type="button" class="public-scope-choice '+(id===publicScope?'selected':'')+'" data-public-scope="'+id+'" aria-pressed="'+(id===publicScope)+'">'+escapeHTML(label)+'</button>').join('');
    const more=chosen.map(x=>'<a class="hub-item" href="'+safeURL(x.url)+'" target="_blank" rel="noopener noreferrer"><span class="hub-mark" aria-hidden="true">↗</span><span><b>'+escapeHTML(x.label)+'</b><small>'+escapeHTML(x.scope)+' · '+(x.isArchive?'archive du '+escapeHTML(x.documentDate):'publication institutionnelle · actualité à vérifier en ligne')+'</small></span><span aria-hidden="true">↗</span></a>').join('');
    const spotlight=snapshot?'<section class="civic-spotlight"><span class="eyebrow">PUBLICATION À DÉCRYPTER · ARCHIVE</span><span class="civic-date">'+escapeHTML(snapshot.date)+' · '+escapeHTML(snapshot.scope)+'</span><h2>'+escapeHTML(snapshot.title)+'</h2><p>'+escapeHTML(snapshot.summary)+'</p>'+
      '<div class="civic-stage">Nature du document : '+escapeHTML(snapshot.statusLabel||snapshot.type)+'</div>'+
      '<p class="civic-source-note">Archive pédagogique · aucune vérification indépendante enregistrée · ne représente pas l’actualité en direct</p>'+
      '<details class="calm-disclosure"><summary>Ce que le document établit — et ses limites <span aria-hidden="true">＋</span></summary><div class="calm-reading-extra"><p>'+escapeHTML(snapshot.impact)+'</p><p>'+escapeHTML(snapshot.verification)+'</p>'+source(snapshot.source.label,snapshot.source.url)+'</div></details></section>':'';
    return intro('VIE PUBLIQUE','Comprendre ce qui se décide.','Apprends à distinguer les annonces, les délibérations, les textes adoptés et les règles en vigueur.')+
      spotlight+
      '<div class="calm-menu civic-menu">'+
      '<button class="hub-item" data-route="vigie"><span class="hub-mark" aria-hidden="true">◎</span><span><b>Publications institutionnelles</b><small>Informations en ligne, avec date et source</small></span><span aria-hidden="true">↗</span></button>'+
      '<button class="hub-item" data-route="civique"><span class="hub-mark" aria-hidden="true">◇</span><span><b>Apprendre à voter</b><small>'+civicAvailable().length+' notions disponibles hors connexion</small></span><span aria-hidden="true">↗</span></button>'+
      '<button class="hub-item" data-route="dossiers"><span class="hub-mark" aria-hidden="true">▤</span><span><b>Programmes, résultats et budgets</b><small>Des documents pour comparer par toi-même</small></span><span aria-hidden="true">↗</span></button>'+
      '</div><details class="calm-disclosure" '+(publicSourcesOpen?'open':'')+'><summary>Voir les sources de mon pays et de ses villes <span aria-hidden="true">＋</span></summary>'+
      '<div class="calm-reading-extra"><p>Sélectionne un niveau de pouvoir. Les liens ouvrent les publications des institutions : cette liste n’est pas un fil municipal en direct et ne prouve pas l’adoption d’une mesure.</p>'+
      '<div class="public-scope-picker" role="group" aria-label="Niveau de pouvoir">'+filters+'</div><div class="calm-submenu">'+more+'</div></div></details>'+
      '<details class="calm-disclosure"><summary>Notre méthode de neutralité <span aria-hidden="true">＋</span></summary>'+
      '<div class="calm-reading-extra"><p>SAVRÉO ne recommande aucun parti et ne classe pas les candidats. Les informations politiques ne sont pas ciblées selon une orientation présumée.</p><p>Une promesse n’est pas une loi ; une plainte n’est pas une condamnation ; une prévision n’est pas un résultat définitif.</p></div></details>';
  }
  function civicSchool(){
    const cards=civicAvailable();
    if(!cards.length)return intro('APPRENDRE À VOTER','Premiers repères en préparation.','Les fiches seront accessibles même hors connexion.');
    const chosen=cards.find(c=>c.id===civicCurrent)||cards.find(c=>!state.completed.includes('civic:'+c.id))||cards[0];
    const known=cards.filter(c=>state.completed.includes('civic:'+c.id)).length;
    const choices=chosen.choices.map((answer,i)=>'<button type="button" class="case-option '+(civicChoice===i?'selected':'')+'" data-civic-choice="'+i+'" '+(civicReveal?'disabled':'')+'><span class="option-letter">'+String.fromCharCode(65+i)+'</span><span>'+escapeHTML(answer)+'</span></button>').join('');
    const feedback=civicReveal?'<div class="feedback '+(civicChoice===chosen.answer?'good':'attn')+'" role="status"><b>'+(civicChoice===chosen.answer?'Bien compris.':'Bonne réponse : '+escapeHTML(chosen.choices[chosen.answer])+'.')+'</b><p>'+escapeHTML(chosen.why)+'</p></div>':'';
    const sources=chosen.sources.map(x=>source(x.label,x.url)).join(' ');
    return intro('APPRENDRE À VOTER','Une notion à la fois.','Une question, une réponse expliquée et une source. À toi de te faire ton idée.')+
      '<div class="civic-progress"><span>'+known+' / '+cards.length+' questions réussies au moins une fois</span><span>Fiches pédagogiques datées du 22/10/2026</span></div>'+
      '<section class="calm-reading-step civic-question"><span class="eyebrow">'+escapeHTML(chosen.topic)+' · '+(chosen.country==='ALL'?'Belgique et France':chosen.country==='BE'?'Belgique':'France')+'</span>'+
      '<h2>'+escapeHTML(chosen.title)+'</h2><p>'+escapeHTML(chosen.body)+'</p>'+
      '<p class="civic-source-note">Édition '+escapeHTML(chosen.edition||'non datée')+' · relecture spécialisée en attente</p>'+civicProvenance(chosen)+
      '<div class="story-question">'+escapeHTML(chosen.question)+'</div>'+
      '<div class="case-options">'+choices+'</div><button class="btn primary" type="button" id="civic-check" '+(civicChoice===null||civicReveal?'disabled':'')+'>Vérifier ma réponse →</button>'+
      feedback+(civicReveal?'<button class="calm-card-action" type="button" id="civic-next">Notion suivante →</button>':'')+
      '</section><details class="calm-disclosure"><summary>Parcourir les '+cards.length+' notions <span aria-hidden="true">＋</span></summary><div class="civic-topic-list">'+
      cards.map(c=>'<button type="button" class="civic-topic" data-civic-id="'+escapeHTML(c.id)+'"><span>'+escapeHTML(c.title)+'</span><small>'+(state.completed.includes('civic:'+c.id)?'✓ Réussi une fois':escapeHTML(c.topic))+'</small></button>').join('')+'</div></details>'+
      '<button class="calm-footer-link" data-route="vie-publique">← Retour à Vie publique</button>';
  }

  function essentialSchool(){
    const cards=essentialAvailable();
    if(!cards.length)return intro('SAVOIRS ESSENTIELS','Une bibliothèque en construction.','Les repères seront accessibles hors connexion.');
    const preferred=cards.filter(x=>x.ageGroups.includes(state.ageGroup));
    const catalogAge=essentialAgeView||state.ageGroup;
    const shown=cards.filter(x=>x.ageGroups.includes(catalogAge));
    const selected=cards.find(x=>x.id===essentialCurrent)||nextMicroCard('',state.ageGroup)||cards[0];
    const count=cards.filter(x=>state.completed.includes('essential:'+x.id)).length;
    const choices=selected.choices.map((answer,i)=>'<button type="button" data-essential-choice="'+i+'" class="case-option '+(essentialChoice===i?'selected':'')+'" '+(essentialReveal?'disabled':'')+'><span class="option-letter">'+String.fromCharCode(65+i)+'</span><span>'+escapeHTML(answer)+'</span></button>').join('');
    const isCorrect=essentialChoice===selected.answer;
    const feedback=essentialReveal?'<div class="feedback '+(isCorrect?'good':'attn')+'" role="status"><b>'+(isCorrect?'Bien compris.':'La bonne réponse : '+escapeHTML(selected.choices[selected.answer])+'.')+'</b><p>'+escapeHTML(selected.why)+'</p></div>':'';
    const nextReview=microReviewsData()[selected.id]?.due;
    return intro('SAVOIRS ESSENTIELS','Une idée, une question.','Des réflexes concrets à utiliser dans la vie. Les tranches d’âge sont des suggestions, jamais des restrictions.')+
      '<div class="civic-progress"><span>'+count+' / '+cards.length+' notions réussies une fois</span><span>Disponibles hors connexion · relecture en attente</span></div>'+
      '<section class="calm-reading-step civic-question"><span class="eyebrow">'+escapeHTML(selected.topic)+' · conseillé '+escapeHTML(selected.ageGroups.join(', '))+' ans</span>'+
      '<h2>'+escapeHTML(selected.title)+'</h2><p>'+escapeHTML(selected.body)+'</p>'+
      '<p class="civic-source-note">Simulation pédagogique · édition du 22/10/2026 · relecture indépendante en attente</p>'+essentialEvidence(selected)+
      '<div class="story-question">'+escapeHTML(selected.question)+'</div><div class="case-options">'+choices+'</div>'+
      '<button class="btn primary" type="button" id="essential-check" '+(essentialChoice===null||essentialReveal?'disabled':'')+'>Vérifier ma réponse →</button>'+feedback+
      (essentialReveal?'<div class="micro-next-date">'+(nextReview?'Prochaine révision : '+escapeHTML(nextReview):'À revoir prochainement')+'</div><button class="calm-card-action" id="essential-next" type="button">Notion suivante →</button>':'')+
      '</section><details class="calm-disclosure micro-catalogue"><summary>Parcourir les '+cards.length+' savoirs <span aria-hidden="true">＋</span></summary>'+
      '<div class="calm-reading-extra"><p>Les suggestions suivent ta tranche d’âge, mais tu peux consulter tous les sujets.</p>'+
      '<div class="micro-age-picker" role="group" aria-label="Tranche d’âge pour les savoirs">'+
      ['12-15','16-20','21-28'].map(a=>'<button type="button" class="micro-age-choice '+(catalogAge===a?'selected':'')+'" aria-pressed="'+(catalogAge===a)+'" data-essential-age="'+a+'">'+escapeHTML(a.replace('-', '–'))+' ans</button>').join('')+
      '</div><p class="micro-catalog-count">'+shown.length+' fiches proposées pour cette tranche d’âge</p>'+
      '<div class="civic-topic-list">'+shown.map(c=>'<button class="civic-topic" data-essential-id="'+escapeHTML(c.id)+'" type="button"><span>'+escapeHTML(c.title)+'</span><small>'+(state.completed.includes('essential:'+c.id)?(microReviewsData()[c.id]?.stage>=2?'✓ Révisé plusieurs fois':'✓ Première réussite'):escapeHTML(c.topic))+'</small></button>').join('')+'</div></div></details>'+
      '<button class="calm-footer-link" data-route="explorer">← Retour à Découvrir</button>';
  }


  function politicalDossiers(){
    const parties=(Array.isArray(PARTY_DATA.parties)?PARTY_DATA.parties:[]).filter(x=>x.country===state.country)
      .slice().sort((a,b)=>a.name.localeCompare(b.name,'fr'));
    const resources=Array.isArray(PARTY_DATA.countrySources?.[state.country])?PARTY_DATA.countrySources[state.country]:[];
    const partyRows=parties.map(p=>'<details class="party-record"><summary><span class="party-name">'+escapeHTML(p.name)+'</span><span class="party-record-label">Voir les documents <span aria-hidden="true">＋</span></span></summary>'+
      '<div class="party-record-body"><div><span class="eyebrow">ARCHIVE DOCUMENTAIRE</span><p>'+escapeHTML(p.election)+'</p></div><p>'+escapeHTML(p.notes)+'</p>'+
      '<p class="party-meta">Document : '+escapeHTML(p.docDate)+' · '+escapeHTML(p.docType)+'</p>'+
      source(p.primarySource.label,p.primarySource.url)+' '+source(p.otherSource.label,p.otherSource.url)+
      '<details class="calm-disclosure"><summary>Données non encore vérifiées <span aria-hidden="true">＋</span></summary><p class="small muted">Dirigeants actuels, mandats, résultats chiffrés, comptes et décisions judiciaires individuelles : non renseignés. SAVRÉO ne fabrique pas ces informations et ne déduit pas de condamnation d’une accusation.</p></details></div></details>').join('');
    const resourcesHtml=resources.map(r=>'<a class="hub-item" href="'+safeURL(r.url)+'" target="_blank" rel="noopener noreferrer"><span class="hub-mark" aria-hidden="true">↗</span><span><b>'+escapeHTML(r.label)+'</b><small>Source institutionnelle ; vérifier année et territoire</small></span><span aria-hidden="true">↗</span></a>').join('');
    const checks=[
      ['Programmes','Lis le document original daté : une promesse n’est pas une mesure appliquée.'],
      ['Résultats','Vérifie le scrutin, son année et la circonscription auprès de l’autorité électorale.'],
      ['Déficit, dette et aides','Contrôle le périmètre du budget, les montants, l’année et la date d’entrée en vigueur.'],
      ['Responsables','Vérifie le mandat et sa date auprès de l’institution avant de publier un nom.'],
      ['Justice','Plainte, enquête, poursuite et condamnation ne sont pas interchangeables.']
    ];
    return intro('PARTIS ET DOSSIERS PUBLICS','Lire les documents, se faire son avis.','Les mêmes sources pour tous. Aucun classement politique ni recommandation de vote.')+
      '<section class="party-library"><div class="civic-progress"><span>'+parties.length+' dossiers documentaires</span><span>'+ (state.country==='BE'?'Chiffrage BFP fédéral de 2024':'Échantillon initial non exhaustif en France') +'</span></div>'+
      '<p class="muted small">'+(state.country==='BE'?'Ces douze partis sont ceux documentés par le chiffrage officiel fédéral de 2024. Le chiffrage porte sur les mesures soumises et non sur tout leur programme.':'Les cinq dossiers français sont un point de départ, pas une liste exhaustive ni une sélection des partis à soutenir.')+'</p>'+
      '<div class="party-records">'+partyRows+'</div></section>'+
      '<details class="calm-disclosure"><summary>Comment comparer sans se tromper <span aria-hidden="true">＋</span></summary><div class="calm-reading-extra">'+
      checks.map(([title,body])=>'<div class="calm-source-point"><h3>'+escapeHTML(title)+'</h3><p>'+escapeHTML(body)+'</p></div>').join('')+
      '</div></details>'+
      '<details class="calm-disclosure"><summary>Résultats, budgets et organismes de contrôle <span aria-hidden="true">＋</span></summary><div class="calm-submenu">'+resourcesHtml+'</div></details>'+
      '<p class="civic-legal-note">Documents datés, non relus par un expert indépendant. Les sites des partis expriment les positions de leurs auteurs. SAVRÉO ne garantit pas que ces documents représentent leur programme actuel.</p>'+
      '<button class="calm-footer-link" data-route="civique">Comprendre les élections →</button>';
  }

  function explore(){
    return `${intro('DÉCOUVRIR','Qu’as-tu envie de comprendre ?','Choisis une porte d’entrée. Tu pourras explorer le reste ensuite.')}
      <div class="calm-menu">
        <button class="hub-item" data-route="declic"><span class="hub-mark" aria-hidden="true">⚡</span><span><b>Situations de la vie</b><small>Une question, un réflexe</small></span><span aria-hidden="true">↗</span></button>
        <button class="hub-item" data-route="apprendre"><span class="hub-mark" aria-hidden="true">▤</span><span><b>Leçons essentielles</b><small>Comprendre à son rythme</small></span><span aria-hidden="true">↗</span></button>
        <button class="hub-item" data-route="vie-publique"><span class="hub-mark" aria-hidden="true">◎</span><span><b>Vie publique et élections</b><small>Décisions, vote et institutions</small></span><span aria-hidden="true">↗</span></button>
      </div>
      <details class="calm-disclosure"><summary>Autres ressources <span aria-hidden="true">＋</span></summary><div class="calm-submenu">
        <button class="hub-item" data-route="essentiels"><span class="hub-mark" aria-hidden="true">✦</span><span><b>Savoirs essentiels</b><small>'+essentialAvailable().length+' réflexes utiles, hors ligne</small></span><span aria-hidden="true">↗</span></button>
        <button class="hub-item" data-route="dico"><span class="hub-mark" aria-hidden="true">✳</span><span><b>Les mots utiles</b><small>Enrichir ton vocabulaire</small></span><span aria-hidden="true">↗</span></button>
        <button class="hub-item" data-route="sources"><span class="hub-mark" aria-hidden="true">✓</span><span><b>Sources et méthode</b><small>Comprendre la fiabilité</small></span><span aria-hidden="true">↗</span></button>
      </div></details>`;
  }
  function practice(){
    const achieved=dailyMissions().filter(m=>state.completed.includes(m.key)).length;
    return `${intro('PRATIQUER','Progresser à ton rythme.','Un exercice à la fois pour mieux retenir et mieux t’exprimer.')}
      <div class="calm-menu">
        <button class="hub-item" data-route="parcours"><span class="hub-mark" aria-hidden="true">◇</span><span><b>Mes parcours</b><small>Trois étapes pour apprendre</small></span><span aria-hidden="true">↗</span></button>
        <button class="hub-item" data-route="reviser"><span class="hub-mark" aria-hidden="true">↺</span><span><b>Mes révisions</b><small>${dueReviews().length+dueMicroReviews().length} à revoir aujourd’hui</small></span><span aria-hidden="true">↗</span></button>
        <button class="hub-item" data-route="debattre"><span class="hub-mark" aria-hidden="true">◉</span><span><b>Exprimer mes idées</b><small>Construire un argument</small></span><span aria-hidden="true">↗</span></button>
      </div>
      <details class="calm-disclosure"><summary>Mes missions du jour · ${achieved}/3 <span aria-hidden="true">＋</span></summary>
        <div class="mission-list calm-missions">${dailyMissions().map(m=>`<button class="mission-item" data-route="${m.route}"><span class="mission-icon" aria-hidden="true">${state.completed.includes(m.key)?'✓':'○'}</span><span><b>${m.name}</b><small>${m.desc}</small></span><span class="card-action">${state.completed.includes(m.key)?'Revoir':'Essayer'} →</span></button>`).join('')}</div>
      </details>`;
  }
  function lessonCard(l){
    const checked=state.completed.includes('lesson:'+l.id);
    return `<article class="card calm-lesson-card"><span class="eyebrow">${escapeHTML(l.tag)} · ${l.mins} min ${ageSuggestion(l)}</span><h3>${escapeHTML(l.title)}</h3><p>${escapeHTML(l.summary)}</p><button class="calm-card-action" data-lesson="${l.id}">${checked?'Revoir':'Découvrir'} <span aria-hidden="true">→</span></button></article>`;
  }
  function learn(){
    const first=recommendedLesson(),more=lessons.filter(l=>l.id!==first.id).sort((a,b)=>contentPriority(b)-contentPriority(a));
    return `${intro('APPRENDRE','Une notion à la fois.','Des explications courtes, puis un quiz pour vérifier ce que tu as compris.')}
      <div class="section-heading calm-section"><h2>Pour commencer</h2></div>
      <div class="calm-feature-lesson">${lessonCard(first)}</div>
      <details class="calm-disclosure"><summary>Voir toutes les leçons (${lessons.length}) <span aria-hidden="true">＋</span></summary><div class="calm-lesson-list">${more.map(lessonCard).join('')}</div></details>`;
  }
  function lessonView(l){
    const core=l.text[0],more=l.text.slice(1);
    const resources=(l.sources||LESSON_REFERENCES[l.id]||[]).filter(([name])=>l.id!=='lois'||(state.country==='BE'?name.startsWith('Belgique'):name.startsWith('France')));
    return `${intro(escapeHTML(l.tag)+' · '+l.mins+' min',escapeHTML(l.title),escapeHTML(l.summary))}
      <article class="calm-reading">
        <div class="calm-reading-step"><span class="eyebrow">01 · COMPRENDRE</span><h2>${escapeHTML(core[0])}</h2><p>${escapeHTML(core[1])}</p></div>
        <details class="calm-disclosure calm-inset"><summary>Exemples et détails <span aria-hidden="true">＋</span></summary><div class="calm-reading-extra">${more.map(([h,t])=>`<section><h3>${escapeHTML(h)}</h3><p>${escapeHTML(t)}</p></section>`).join('')}</div></details>
        <div class="calm-reading-step"><span class="eyebrow">02 · VÉRIFIER</span><h2>${escapeHTML(l.q)}</h2>
          <form id="lesson-quiz">${l.choices.map((c,i)=>`<label class="option"><input type="radio" name="answer" value="${i}" ${quizSelection===i?'checked':''}/><span>${escapeHTML(c)}</span></label>`).join('')}
          <button class="btn primary" type="submit">Valider ma réponse</button>
          ${quizDone?`<div class="feedback ${quizSelection===l.answer?'good':'attn'}" role="status"><strong>${quizSelection===l.answer?'Bonne réponse.':'La bonne réponse est : '+escapeHTML(l.choices[l.answer])+'.'}</strong> ${escapeHTML(l.why)}</div>`:''}
          </form>
        </div>
        <details class="calm-disclosure calm-inset"><summary>Sources et pour aller plus loin <span aria-hidden="true">＋</span></summary><div class="calm-reading-extra"><p>Repères pédagogiques : les fiches de cette version n’ont pas encore reçu de validation externe indépendante.</p>${resources.map(([name,url])=>source(name,url)).join('')}<p>Explique la notion à voix haute pour vérifier que tu la comprends.</p><button class="calm-card-action" data-route="debattre">M’exercer à argumenter →</button></div></details>
        <button class="calm-footer-link" data-route="apprendre">← Toutes les leçons</button>
      </article>`;
  }

  function analyze(text){const norm=text.toLocaleLowerCase('fr');const words=(text.trim().match(/[\p{L}’'-]+/gu)||[]); const indicators={
    position:/\b(je pense|selon moi|j'estime|à mon avis|je considère|personnellement|je suis d'accord|je ne suis pas d'accord)\b/.test(norm),
    reason:/\b(parce que|car |en raison|puisque|la raison|cela s'explique|en effet)\b/.test(norm),
    concession:/\b(toutefois|cependant|néanmoins|pourtant|je comprends|je reconnais|certes|en partie|il est vrai|dans une certaine mesure)\b/.test(norm),
    example:/\b(par exemple|prenons l'exemple|imaginons|notamment|à titre d'exemple)\b/.test(norm),
    conclusion:/\b(ainsi|en conclusion|finalement|en définitive|c'est pourquoi|pour conclure|donc)\b/.test(norm),
    nuance:/\b(toujours|jamais|tous|aucun|personne|nécessaire|suffisant|cela ne signifie pas|distinguer|nuancer|dépend)\b/.test(norm)
  };const criteria=[['Une position identifiable',indicators.position,'Annonce explicitement ton point de vue dès le départ.'],['Un argument expliqué',indicators.reason,'Ajoute « parce que » et explique le lien logique entre tes idées.'],['Une concession ou nuance',indicators.concession,'Reconnais ce que l’autre personne peut avoir raison de dire.'],['Un exemple précis',indicators.example,'Propose une situation concrète qui démontre réellement ton propos.'],['Une conclusion',indicators.conclusion,'Termine avec une phrase qui résume ce que tu as établi.']];const hits=criteria.filter(x=>x[1]).length;return {words:words.length,criteria,hits,feedback:words.length<28?'Ton texte est encore très court : développe un argument et un exemple.':words.length>170?'Tu développes ton idée : essaie maintenant d’en faire une version orale de 40 secondes.':'La longueur convient pour un court échange. Relis chaque phrase pour vérifier qu’elle sert ton argument.',caution:'Attention : ce retour identifie des indices de structure. Il ne vérifie pas la vérité de tes affirmations ni la solidité réelle de ton raisonnement.'};}
  function debate(){let d=debates[activeDebate];return `${intro('LABORATOIRE D’EXPRESSION','Défends tes idées.','Un entraînement sans jugement : tu réponds à une objection et identifies les éléments d’une argumentation convaincante.')}<details class="calm-disclosure calm-before-question"><summary>Changer de sujet <span aria-hidden="true">＋</span></summary><div class="chips">${debates.map((x,i)=>`<button class="chip ${i===activeDebate?'active':''}" data-debate="${i}">${x.label}</button>`).join('')}</div></details><div class="detail-layout"><div><div class="card calm-debate-card"><div class="eyebrow">L’OBJECTION DU JOUR</div><h2 style="margin:12px 0">${escapeHTML(d.title)}</h2><div class="quote">${escapeHTML(d.opp)}</div><p class="muted small">Réponds avec tes mots : position → concession → argument → exemple → conclusion.</p></div><div class="section-heading"><h2>À toi de répondre</h2></div><textarea id="debate-answer" class="textarea" placeholder="Je comprends ton point de vue, toutefois..." maxlength="1800">${escapeHTML(window.__debateDraft||'')}</textarea><div class="calm-primary-actions"><button class="btn primary" id="analyze-debate">Analyser ma structure →</button></div><details class="calm-disclosure"><summary>Autres outils (facultatifs) <span aria-hidden="true">＋</span></summary><div class="calm-extra-actions"><button class="btn secondary" id="ai-debate" ${aiBusy?'disabled':''}>${aiBusy?'Analyse IA en cours…':'✦ Coach IA détaillé'}</button><button class="btn ghost" id="voice-debate">🎙 Dicter</button><button class="btn ghost" id="reset-debate">Effacer</button></div></details>${debateFeedback?renderDebateFeedback(debateFeedback):''}${aiFeedback?renderAIFeedback(aiFeedback):''}${aiError?`<div class="notice" role="status">${escapeHTML(aiError)}</div>`:''}</div><aside class="card help-card calm-help"><span class="pill purple">MÉTHODE EN 5 ÉTAPES</span><ul><li>Ta position</li><li>Une concession</li><li>Une raison solide</li><li>Un exemple pertinent</li><li>Une conclusion nuancée</li></ul><div class="inner-separator"></div><h3>Indice sans réponse</h3><p class="muted small">${escapeHTML(d.help)}</p><p class="tool-footer">L’analyse de structure reste disponible sans IA. Le coach IA, si activé, transmet ton texte à un fournisseur de modèles via notre serveur : ne saisis pas d’informations personnelles sensibles. Aucun conseil juridique individualisé.</p></aside></div>`;}
  function renderAIFeedback(a){return `<div class="card ai-card" role="status"><div class="eyebrow">✦ RETOUR DU COACH IA · ${escapeHTML(a.grade||'Analyse')}</div><h3>Ce qui fonctionne</h3><p>${escapeHTML(a.strength)}</p><h3>Ce que tu peux améliorer</h3><p>${escapeHTML(a.improvement)}</p><h3>Une formulation plus solide</h3><p class="ai-rewrite">${escapeHTML(a.rewrite)}</p><h3>Ton prochain défi</h3><p>${escapeHTML(a.challenge)}</p><small class="muted">Cette analyse pédagogique peut se tromper. Vérifie les faits juridiques et politiques dans les sources officielles.</small></div>`;}
  async function runAICoach(){const answer=(el('debate-answer')?.value||'').trim();if(answer.length<40){toast('Développe ton idée sur au moins 40 caractères.');return;}const d=debates[activeDebate];window.__debateDraft=answer;aiFeedback=null;aiError='';aiBusy=true;render();const ctrl=new AbortController(),timer=setTimeout(()=>ctrl.abort(),23000);try{const res=await fetch('/api/coach',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({answer,topic:d.title,objection:d.opp,country:state.country}),signal:ctrl.signal});const data=await res.json();if(!res.ok)throw new Error(data.error||'Le coach IA ne peut pas répondre actuellement.');aiFeedback=data.feedback;if(reward('ai:'+dayKey(),20))toast('+20 XP · retour IA obtenu');}catch(e){aiError=(e.name==='AbortError'?'Le coach met trop de temps à répondre.':e.message.slice(0,180))+' Tu peux utiliser l’analyse locale gratuitement.';}finally{clearTimeout(timer);aiBusy=false;if(page==='debattre')render();}}
  function startDictation(){const SR=window.SpeechRecognition||window.webkitSpeechRecognition;if(!SR){toast('Dictée non disponible dans ce navigateur. Utilise le micro du clavier iPhone.');return;}const r=new SR();r.lang='fr-FR';r.continuous=false;r.interimResults=false;r.onresult=e=>{const t=Array.from(e.results).map(x=>x[0].transcript).join(' ');const area=el('debate-answer');if(area){area.value=(area.value.trim()+' '+t).trim();window.__debateDraft=area.value;}};r.onerror=()=>toast('Dictée interrompue. Tu peux utiliser le micro du clavier.');r.start();toast('Parle maintenant…');}
  function renderDebateFeedback(a){return `<div class="card flat" style="margin-top:17px"><div class="eyebrow">RETOUR PÉDAGOGIQUE</div><h3 style="margin:10px 0">${a.hits}/5 critères détectés · ${a.words} mots</h3><div class="progressbar"><i style="width:${a.hits*20}%"></i></div><div class="context-list">${a.criteria.map(([label,ok,tip])=>`<div class="context-stage"><span class="num">${ok?'✓':'→'}</span><div><b>${escapeHTML(label)}</b><p>${ok?'Indice repéré dans ton texte.':escapeHTML(tip)}</p></div></div>`).join('')}</div><div class="feedback">${escapeHTML(a.feedback)}\n\n${escapeHTML(a.caution)}</div></div>`;}

  function renderRightsCards(items){
    return items.map(r=>`<details class="right-entry">
      <summary><span class="right-tag">${escapeHTML(r.tag)}</span><span class="right-title">${escapeHTML(r.title)}</span><span class="right-chevron" aria-hidden="true">＋</span></summary>
      <div class="right-expanded"><p>${escapeHTML(r.body)}</p><div class="calm-example"><b>Dans la vraie vie</b><p>${escapeHTML(r.practical)}</p></div>
      ${source('Vérifier sur le site officiel',r.url)}</div>
    </details>`).join('');
  }
  function rights(){
    const items=RIGHTS[state.country].filter(r=>(r.title+' '+r.tag+' '+r.body).toLowerCase().includes(rightFilter.toLowerCase()));
    return `${intro('MES DROITS','Savoir où chercher.','Choisis un sujet, puis ouvre la fiche qui t’intéresse.')}
      <div class="calm-country-context"><span>Sources : ${state.country==='BE'?'Belgique':'France'}</span><button type="button" data-route="profil">Modifier →</button></div>
      <label class="calm-search-label" for="rights-search">Rechercher un sujet</label>
      <input class="search calm-search" id="rights-search" type="search" value="${escapeHTML(rightFilter)}" placeholder="Ex. : travail, contrat, vie privée…" autocomplete="off"/>
      <div class="rights-grid calm-rights">${renderRightsCards(items)||'<p class="blank-state">Aucun résultat. Essaie un mot plus simple.</p>'}</div>
      <details class="calm-disclosure calm-safety"><summary>Fiabilité et limites des fiches <span aria-hidden="true">＋</span></summary>
      <div class="calm-reading-extra"><p>Ces informations sont des points de départ. Leur validation juridique externe est encore en attente. Les règles dépendent du pays, de la date et de ta situation. Vérifie la source officielle.</p>
      <button class="calm-card-action" data-route="sources">Notre méthode de vérification →</button></div></details>`;
  }

  function levelName(){return state.xp<100?'Éclaireur':state.xp<300?'Observateur':state.xp<700?'Analyste':'Esprit avisé';}
  function dailyMissions(){return [{key:'mission:case:'+dayKey(),name:'Un Déclic',desc:'Réponds à un cas concret',route:'declic'}, {key:'mission:lesson:'+dayKey(),name:'Une leçon',desc:'Apprends une notion utile',route:'apprendre'}, {key:'debate:'+dayKey(),name:'Une objection',desc:'Défends ton raisonnement',route:'debattre'}];}
  function newsCards(){if(liveNews.status==='loading')return '<div class="notice">Chargement des publications officielles…</div>';if(liveNews.status==='error')return `<div class="notice"><strong>Flux indisponible :</strong> ${escapeHTML(liveNews.error)}. Aucun titre fictif n’est affiché. Ouvre les sources ci-dessous pour vérifier directement.</div>`;if(liveNews.status!=='success')return '<div class="notice">Appuie sur « Actualiser les titres » pour interroger la source officielle.</div>';if(!liveNews.items.length)return '<div class="notice">Aucune publication exploitable n’a été renvoyée. Consulte la source directement.</div>';return `<p class="source-age">${escapeHTML(liveNews.source)} · consultation : ${escapeHTML(new Date(liveNews.checkedAt).toLocaleString('fr-BE'))} · titres bruts, pas une vérification de l’entrée en vigueur</p><div class="grid two">${liveNews.items.map(n=>`<article class="card feed-card"><span class="pill grey">SOURCE OFFICIELLE · ${escapeHTML(n.date||'date non précisée')}</span><h3>${escapeHTML(n.title)}</h3><p>${escapeHTML(n.summary||'Ouvrir la publication pour les détails.')}</p><div class="news-actions">${source('Lire sur le site officiel',n.url)}<button class="btn ghost small" data-save-news="${escapeHTML(n.url)}">${state.savedNews.some(x=>x.url===n.url)?'✓ Sauvegardé':'☆ Sauvegarder'}</button></div></article>`).join('')}</div>`;}
  function vigie(){
    const country=state.country;
    const sources=SOURCES[country].map(x=>`<a class="hub-item" target="_blank" rel="noopener noreferrer" href="${safeURL(x.url)}"><span class="hub-mark" aria-hidden="true">↗</span><span><b>${escapeHTML(x.name)}</b><small>${escapeHTML(x.description)}</small></span><span aria-hidden="true">↗</span></a>`).join('');
    const stages=[['01','Annoncé','Une déclaration ne change pas immédiatement le droit.'],['02','En examen','Un texte peut encore évoluer.'],['03','Adopté et publié','Il faut vérifier la version définitive.'],['04','En vigueur','Vérifie les dates et exceptions.']].map(([n,h,p])=>`<div class="context-stage"><span class="num">${n}</span><div><b>${h}</b><p>${p}</p></div></div>`).join('');
    const saved=state.savedNews.filter(x=>x.country===country);
    return `${intro('ACTUALITÉ','Vérifier ce qui change.','Lis des publications institutionnelles, puis consulte les sources.')}
      <section class="calm-feed-primary"><h2>Publications officielles</h2><p>Les titres sont récupérés à ta demande. Ils ne prouvent pas qu’une nouvelle loi est en vigueur.</p>
        <button id="load-news" class="btn primary" ${liveNews.status==='loading'?'disabled':''}>${liveNews.status==='loading'?'Chargement…':'Afficher les publications →'}</button>
      </section>
      ${liveNews.status==='idle'?'':'<div class="calm-feed-results" id="live-news">'+newsCards()+'</div>'}
      <details class="calm-disclosure"><summary>Comprendre les étapes d’une réforme <span aria-hidden="true">＋</span></summary><div class="calm-reading-extra">${stages}</div></details>
      <details class="calm-disclosure"><summary>Consulter directement les institutions <span aria-hidden="true">＋</span></summary><div class="calm-submenu">${sources}</div></details>
      <details class="calm-disclosure"><summary>Mes publications sauvegardées (${saved.length}) <span aria-hidden="true">＋</span></summary><div class="calm-reading-extra">${saved.length?saved.map(n=>`<div class="saved-news">${source(n.title,n.url)} <button class="btn ghost small" data-unsave-news="${escapeHTML(n.url)}">Retirer</button></div>`).join(''):'<p>Tu n’as encore enregistré aucune publication.</p>'}</div></details>
      <details class="calm-disclosure"><summary>Limites du radar <span aria-hidden="true">＋</span></summary><p class="muted small">${country==='BE'?'Le flux pilote contient certaines publications fédérales, sans couverture exhaustive des Régions et Communautés.':'Le flux Service-Public ne couvre pas toutes les décisions de l’État.'} Aucune analyse automatique ne peut déterminer seule la date d’application d’une mesure.</p></details>`;
  }

  async function fetchNews(force=false){if(newsRequest)return newsRequest;liveNews={status:'loading',items:[],source:'',checkedAt:'',error:''};if(page==='vigie')render();const chosen=state.country;newsRequest=(async()=>{const ctrl=new AbortController(),timer=setTimeout(()=>ctrl.abort(),12000);try{const res=await fetch('/api/news?country='+chosen,{signal:ctrl.signal,cache:'no-store'});const data=await res.json();if(!res.ok||!Array.isArray(data.items))throw new Error(data.error||'Erreur de connexion');if(state.country===chosen){liveNews={status:'success',items:data.items,source:data.source,checkedAt:data.checkedAt,error:''};}}catch(e){if(state.country===chosen)liveNews={status:'error',items:[],source:'',checkedAt:'',error:e.name==='AbortError'?'Délai de réponse dépassé':e.message.slice(0,130)};}finally{clearTimeout(timer);newsRequest=null;if(page==='vigie')render();}})();return newsRequest;}

  function profile(){
    const lessonDone=state.completed.filter(x=>x.startsWith('lesson:')).length;
    const completedCases=state.completed.filter(x=>x.startsWith('case:')).length;
    const interests=chosenInterests().map(id=>INTERESTS.find(t=>t.id===id)?.label).filter(Boolean).map(escapeHTML).join(' · ');
    return `${intro('MON ESPACE','Ton parcours, tes choix.','Retrouve tes progrès et adapte SAVRÉO à tes préférences.')}
      <section class="calm-profile-head"><div><span class="eyebrow">TON PROFIL</span><h2>${escapeHTML(state.firstName)}</h2><p>${escapeHTML(AGE_GROUPS[state.ageGroup]||'Âge non précisé')} · ${escapeHTML(GENDERS[state.gender]||'Genre non précisé')}</p></div><button class="btn ghost small" id="edit-profile">Modifier</button></section>
      <section class="calm-settings"><h2>Pays des informations</h2><p>Pour afficher les droits et les sources de ton pays.</p><div class="calm-country-picker" role="group" aria-label="Pays pour les contenus juridiques"><button type="button" class="country" data-country="BE" aria-pressed="${state.country==='BE'}">Belgique</button><button type="button" class="country" data-country="FR" aria-pressed="${state.country==='FR'}">France</button></div></section>
      <section class="calm-settings"><h2>Apparence</h2><p>Choisis un affichage confortable pour toi.</p>
      <div class="theme-selector" role="group" aria-label="Apparence de l’application">
        ${[['auto','Automatique'],['light','Clair'],['dark','Sombre']].map(([id,title])=>`<button type="button" class="theme-option ${themePreference()===id?'active':''}" data-theme-option="${id}" aria-pressed="${themePreference()===id}">${title}</button>`).join('')}
      </div></section>
      <section class="calm-settings"><div class="calm-section-head"><div><h2>Centres d’intérêt</h2><p>${interests||'Choisis les sujets que tu veux découvrir.'}</p></div><button class="btn ghost small" id="edit-interests">Modifier</button></div></section>
      <section class="calm-settings"><h2>Ta progression</h2>
        <div class="calm-progress"><div><b>${lessonDone}<span> / ${lessons.length}</span></b><small>Leçons validées</small></div><div><b>${completedCases}</b><small>Situations maîtrisées</small></div></div>
        <button class="calm-card-action" data-route="reviser">Voir mes révisions →</button>
      </section>
      <details class="calm-disclosure"><summary>Historique et points <span aria-hidden="true">＋</span></summary>
        <div class="calm-reading-extra"><p>${state.xp} XP · ${state.history.length} entraînement(s) enregistrés.</p>
        ${state.history.length?state.history.slice(-8).reverse().map(h=>`<div class="history-item"><div><b>${escapeHTML(h.title)}</b><small>${escapeHTML(h.date)} · ${h.hits}/5 critères</small></div></div>`).join(''):'<p>Ton historique apparaîtra après un exercice d’argumentation.</p>'}</div>
      </details>
      <details class="calm-disclosure"><summary>Confidentialité et données <span aria-hidden="true">＋</span></summary>
        <div class="calm-reading-extra"><p>Ton prénom, tes préférences et ta progression sont enregistrés dans ce navigateur. Pas de compte requis. Certaines fonctions optionnelles peuvent utiliser un serveur lorsque tu les actives.</p>
        <div class="calm-privacy-actions"><button class="btn ghost small" id="export-progress">Exporter mes données</button><button class="btn ghost small" id="clear-progress">Effacer mes données</button></div></div>
      </details>`;
  }

  function render(){renderHeader();if(!state.onboardingDone || profileEditing){document.body.classList.add('onboarding-active');el('main').innerHTML=onboarding();applyTheme();return;}if(!state.interestsDone || interestsEditing){document.body.classList.add('onboarding-active');el('main').innerHTML=interestsScreen();applyTheme();return;}document.body.classList.remove('onboarding-active');let view; const l=lessons.find(x=>x.id===activeLesson)||lessons[0];switch(page){case 'vie-publique':view=publicHub();break;case 'civique':view=civicSchool();break;case 'dossiers':view=politicalDossiers();break;case 'essentiels':view=essentialSchool();break;case 'parcours':view=journeys();break;case 'reviser':view=reviewPage();break;case 'sources':view=editorialPage();break;case 'explorer':view=explore();break;case 'pratiquer':view=practice();break;case 'apprendre':view=learn();break;case 'lecon':view=lessonView(l);break;case 'debattre':view=debate();break;case 'droits':view=rights();break;case 'vigie':view=vigie();break;case 'declic':view=cases();break;case 'dico':view=dictionary();break;case 'profil':view=profile();break;default:view=welcome();}el('main').innerHTML=view;applyTheme();}
  function navigate(next){page=next; if(next==='lecon'){quizSelection=null;quizDone=false;}if(next==='reviser'){reviewLessonId='';reviewChoice=null;reviewResult=null;}window.location.hash=(next==='lecon'?'lecon/'+activeLesson:next);render();window.scrollTo({top:0,behavior:'instant'});}
  function setCountry(c){if(!['BE','FR'].includes(c))return;state.country=c;liveNews={status:'idle',items:[],source:'',checkedAt:'',error:''};rightFilter='';publicScope='all';publicSourcesOpen=false;activeScenario=null;caseChoice=null;caseReveal=false;civicCurrent=null;civicChoice=null;civicReveal=false;essentialCurrent=null;essentialChoice=null;essentialReveal=false;essentialAgeView=null;setStore();render();toast(`Sources et droits : ${c==='BE'?'Belgique':'France'}`)}
  document.addEventListener('click',ev=>{if(ev.target.closest('#theme-entry')){updateTheme(document.documentElement.dataset.theme==='light'?'dark':'light');render();return;}const themeChoice=ev.target.closest('[data-theme-option]');if(themeChoice){updateTheme(themeChoice.dataset.themeOption);return;}if(ev.target.closest('#theme-quick, #theme-entry')){updateTheme(document.documentElement.dataset.theme==='light'?'dark':'light');return;}const ageButton=ev.target.closest('[data-essential-age]');if(ageButton){const val=ageButton.dataset.essentialAge;if(['12-15','16-20','21-28'].includes(val)){essentialAgeView=val;render();document.querySelector('details.micro-catalogue')?.setAttribute('open','');}return;}const micro=ev.target.closest('[data-micro-review]');if(micro){essentialCurrent=micro.dataset.microReview;essentialChoice=null;essentialReveal=false;navigate('essentiels');return;}const eTopic=ev.target.closest('[data-essential-id]');if(eTopic){essentialCurrent=eTopic.dataset.essentialId;essentialChoice=null;essentialReveal=false;render();return;}const eOption=ev.target.closest('[data-essential-choice]');if(eOption&&!essentialReveal){essentialChoice=Number(eOption.dataset.essentialChoice);render();return;}if(ev.target.id==='essential-check'){const current=essentialAvailable().find(x=>x.id===essentialCurrent)||essentialAvailable().find(x=>x.ageGroups.includes(state.ageGroup)&&!state.completed.includes('essential:'+x.id))||essentialAvailable()[0];if(!current||essentialChoice===null)return;essentialCurrent=current.id;essentialReveal=true;recordMicroReview(current.id,essentialChoice===current.answer);if(essentialChoice===current.answer)reward('essential:'+current.id,10);render();return;}if(ev.target.id==='essential-next'){essentialCurrent=nextMicroCard(essentialCurrent,essentialAgeView||state.ageGroup)?.id||null;essentialChoice=null;essentialReveal=false;render();return;}const scopeBtn=ev.target.closest('[data-public-scope]');if(scopeBtn){const next=scopeBtn.dataset.publicScope;if(['all','national','regional','local'].includes(next)){publicScope=next;publicSourcesOpen=true;render();}return;}const cTopic=ev.target.closest('[data-civic-id]');if(cTopic){civicCurrent=cTopic.dataset.civicId;civicChoice=null;civicReveal=false;render();return;}const cOption=ev.target.closest('[data-civic-choice]');if(cOption&&!civicReveal){civicChoice=Number(cOption.dataset.civicChoice);render();return;}if(ev.target.id==='civic-check'){const current=civicAvailable().find(x=>x.id===civicCurrent)||civicAvailable().find(x=>!state.completed.includes('civic:'+x.id))||civicAvailable()[0];if(!current||civicChoice===null)return;civicCurrent=current.id;civicReveal=true;if(civicChoice===current.answer)reward('civic:'+current.id,12);render();return;}if(ev.target.id==='civic-next'){const cards=civicAvailable(),i=cards.findIndex(x=>x.id===civicCurrent);civicCurrent=cards[(i+1+cards.length)%cards.length]?.id||null;civicChoice=null;civicReveal=false;render();return;}const country=ev.target.closest('[data-country]');if(country){setCountry(country.dataset.country);return;}const lesson=ev.target.closest('[data-lesson]');if(lesson){activeLesson=lesson.dataset.lesson;navigate('lecon');return;}if(ev.target.id==='edit-interests'){interestsEditing=true;render();window.scrollTo({top:0,behavior:'instant'});return;}if(ev.target.id==='cancel-interests'){interestsEditing=false;render();return;}if(ev.target.id==='skip-interests'){state.interests=[];state.interestsDone=true;interestsEditing=false;setStore();navigate('accueil');toast('Tu pourras choisir tes sujets plus tard.');return;}if(ev.target.id==='edit-profile'){profileEditing=true;render();window.scrollTo({top:0,behavior:'instant'});return;}if(ev.target.id==='cancel-onboarding'){profileEditing=false;render();return;}const journeyStep=ev.target.closest('[data-journey][data-stage]');if(journeyStep){const j=JOURNEYS.find(x=>x.id===journeyStep.dataset.journey);if(!j)return;const kind=journeyStep.dataset.stage;journeyContext=j.id;if(kind==='case'){activeScenario=j.case[state.country];caseChoice=null;caseReveal=false;navigate('declic');}else if(kind==='lesson'){activeLesson=j.lesson;navigate('lecon');}else if(kind==='debate'){activeDebate=j.debate;debateFeedback=null;aiFeedback=null;window.__debateDraft='';navigate('debattre');}return;}const reviewButton=ev.target.closest('[data-review]');if(reviewButton){reviewLessonId=reviewButton.dataset.review;reviewChoice=null;reviewResult=null;render();return;}const route=ev.target.closest('[data-route],[data-page]');if(route){journeyContext='';navigate(route.dataset.route||route.dataset.page);return;}const debate=ev.target.closest('[data-debate]');if(debate){activeDebate=Number(debate.dataset.debate);debateFeedback=null;aiFeedback=null;aiError='';window.__debateDraft='';render();return;}const casepick=ev.target.closest('[data-case]');if(casepick){activeScenario=casepick.dataset.case;caseChoice=null;caseReveal=false;render();return;}const cp=ev.target.closest('[data-case-choice]');if(cp && !caseReveal){caseChoice=Number(cp.dataset.caseChoice);render();return;}if(ev.target.id==='case-retry'){caseChoice=null;caseReveal=false;render();return;}if(ev.target.id==='case-submit'){const s=byCountry().find(x=>x.id===(activeScenario||todayCase().id))||todayCase();if(caseChoice===null)return;caseReveal=true;if(!state.completed.includes('mission:case:'+dayKey())){state.completed.push('mission:case:'+dayKey());setStore();}if(caseChoice===s.answer){if(reward('case:'+s.id,30))toast('+30 XP · bon réflexe !');}render();return;}const wp=ev.target.closest('[data-word]');if(wp){activeWord=wp.dataset.word;wordReveal=false;wordChoice=null;wordCheck=false;render();return;}if(ev.target.id==='word-flip'){wordReveal=!wordReveal;wordChoice=null;wordCheck=false;render();return;}const wc=ev.target.closest('[data-word-choice]');if(wc && !wordCheck){wordChoice=Number(wc.dataset.wordChoice);render();return;}if(ev.target.id==='word-retry'){wordChoice=null;wordCheck=false;render();return;}if(ev.target.id==='word-submit'){const w=words.find(x=>x.id===activeWord)||words[0];if(wordChoice===null)return;wordCheck=true;if(wordChoice===w.answer){if(reward('word:'+w.id,8))toast('+8 XP · mot acquis !');}render();return;}if(ev.target.id==='ai-debate'){runAICoach();return;}if(ev.target.id==='voice-debate'){startDictation();return;}if(ev.target.id==='load-news'){fetchNews(true);return;}const saved=ev.target.closest('[data-save-news]');if(saved){const url=saved.dataset.saveNews;const n=liveNews.items.find(x=>x.url===url);if(n && !state.savedNews.some(x=>x.url===url)){state.savedNews.unshift({country:state.country,url:n.url,title:n.title});state.savedNews=state.savedNews.slice(0,40);setStore();render();toast('Publication sauvegardée');}return;}const unsaved=ev.target.closest('[data-unsave-news]');if(unsaved){state.savedNews=state.savedNews.filter(x=>x.url!==unsaved.dataset.unsaveNews);setStore();render();return;}if(ev.target.id==='analyze-debate'){let text=el('debate-answer').value.trim();if(text.length<30){toast('Écris au moins 30 caractères pour t’entraîner.');return;}window.__debateDraft=text;debateFeedback=analyze(text);const d=debates[activeDebate];state.history.push({date:new Date().toLocaleDateString('fr-BE'),title:d.title,hits:debateFeedback.hits,text});state.history=state.history.slice(-30);setStore();if(journeyContext&&JOURNEYS.some(j=>j.id===journeyContext)){state.journeyDebates=Array.isArray(state.journeyDebates)?state.journeyDebates:[];if(!state.journeyDebates.includes(journeyContext))state.journeyDebates.push(journeyContext);setStore();journeyContext='';}if(reward('debate:'+dayKey(),25)){toast('+25 XP · entraînement enregistré');}else{toast('Entraînement enregistré dans ton parcours');}render();el('debate-answer')?.scrollIntoView({block:'center'});return;}if(ev.target.id==='reset-debate'){window.__debateDraft='';debateFeedback=null;aiFeedback=null;aiError='';render();return;}if(ev.target.id==='clear-progress'){if(confirm('Effacer définitivement la progression et les réponses sauvegardées dans ce navigateur ?')){state={...DEFAULT,country:state.country,theme:themePreference()};setStore();render();toast('Données locales effacées.');}return;}if(ev.target.id==='export-progress'){const blob=new Blob([JSON.stringify({...state,exportedAt:new Date().toISOString()},null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='savreo-mon-parcours.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),3000);toast('Progression téléchargée.');return;}});
  document.addEventListener('submit',ev=>{if(ev.target.id==='review-quiz'){ev.preventDefault();const lesson=lessons.find(l=>l.id===reviewLessonId),answer=ev.target.querySelector('input[name="answer"]:checked');if(!lesson||!answer||reviewResult!==null)return;reviewChoice=Number(answer.value);reviewResult=reviewChoice===lesson.answer;recordReview(lesson.id,reviewResult);render();return;}if(ev.target.id==='interests-form'){ev.preventDefault();const ids=[...ev.target.querySelectorAll('input[name="interests"]:checked')].map(x=>x.value).filter(id=>INTERESTS.some(t=>t.id===id)).slice(0,3);const wasEditing=interestsEditing;state.interests=ids;state.interestsDone=true;interestsEditing=false;setStore();navigate(wasEditing?'profil':'accueil');toast(wasEditing?'Sujets mis à jour.':'Bienvenue sur SAVRÉO !');return;}if(ev.target.id==='onboarding-form'){ev.preventDefault();const form=ev.target;const name=safeName(form.elements.firstName.value);const age=form.elements.ageGroup.value;const gender=form.elements.gender.value;if(!name){toast('Indique un prénom ou un pseudo.');return;}if(!Object.hasOwn(AGE_GROUPS,age)){toast('Choisis ta tranche d’âge.');return;}if(gender && !Object.hasOwn(GENDERS,gender)){toast('Choix non reconnu.');return;}const wasEditing=profileEditing;state.firstName=name;state.ageGroup=age;state.gender=gender;state.onboardingDone=true;profileEditing=false;setStore();if(wasEditing){navigate('profil');toast('Préférences enregistrées.');}else{render();window.scrollTo({top:0,behavior:'instant'});}return;}if(ev.target.id!=='lesson-quiz')return;ev.preventDefault();const picked=ev.target.querySelector('input[name=answer]:checked');if(!picked){toast('Choisis une réponse.');return;}quizSelection=Number(picked.value);quizDone=true;const l=lessons.find(x=>x.id===activeLesson);if(quizSelection===l.answer){if(!state.completed.includes('mission:lesson:'+dayKey())){state.completed.push('mission:lesson:'+dayKey());setStore();}queueReview(l.id);if(reward('lesson:'+l.id,20))toast('+20 XP · leçon validée !');else toast('Bonne réponse. Leçon déjà validée.');}else toast('Lis l’explication et réessaie.');render();});
    document.addEventListener('change',ev=>{
    if(!ev.target.matches('#interests-form input[name="interests"]'))return;
    const checked=[...document.querySelectorAll('#interests-form input[name="interests"]:checked')];
    if(checked.length>3){
      ev.target.checked=false;
      toast('Choisis jusqu’à 3 sujets.');
    }
    const total=document.querySelectorAll('#interests-form input[name="interests"]:checked').length;
    const counter=el('interests-count');
    if(counter)counter.textContent=total+'/3 sujets choisis';
  });
document.addEventListener('input',ev=>{if(ev.target.id==='rights-search'){const pos=ev.target.selectionStart;rightFilter=ev.target.value;const cards=RIGHTS[state.country].filter(x=>(x.title+' '+x.tag+' '+x.body).toLowerCase().includes(rightFilter.toLowerCase()));const grid=document.querySelector('.rights-grid');if(grid)grid.innerHTML=renderRightsCards(cards)||'<p class="blank-state">Aucun résultat. Essaie un autre mot.</p>';ev.target.setSelectionRange(pos,pos);}if(ev.target.id==='debate-answer')window.__debateDraft=ev.target.value;});
  window.addEventListener('hashchange',()=>{let route=location.hash.slice(1);if(route.startsWith('lecon/')){activeLesson=route.split('/')[1];page='lecon';}else if(['accueil','explorer','pratiquer','apprendre','debattre','droits','vigie','profil','declic','dico','parcours','reviser','sources','vie-publique','civique','dossiers','essentiels'].includes(route))page=route;else page='accueil';render();});
  if('serviceWorker' in navigator && location.protocol.startsWith('http')){navigator.serviceWorker.register('./sw.js').catch(()=>{});}
  let route=location.hash.slice(1);if(route.startsWith('lecon/')){activeLesson=route.split('/')[1];page='lecon';}else if(['accueil','explorer','pratiquer','apprendre','debattre','droits','vigie','profil','declic','dico','parcours','reviser','sources','vie-publique','civique','dossiers','essentiels'].includes(route))page=route;
  state.completed.filter(x=>x.startsWith('lesson:')).forEach(x=>queueReview(x.slice(7)));
  render();
})();