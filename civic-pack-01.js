/* SAVRÉO — premiers repères civiques hors ligne, sans recommandation électorale. */
(function(){'use strict';window.SAVREO_CIVIC={
  "version": "pilot-01",
  "updated": "2026-10-22",
  "language": "fr",
  "principles": [
    "neutralité éditoriale",
    "révision experte requise",
    "pas de classement de partis",
    "pas de personnalisation de préférence politique"
  ],
  "cards": [
    {
      "id": "promesse-loi",
      "country": "ALL",
      "topic": "Décryptage",
      "title": "Une promesse n'est pas une loi",
      "body": "Une promesse électorale décrit une intention. Pour voir si elle est devenue une règle, il faut retrouver le texte adopté, publié et sa date d'application.",
      "question": "Un programme annonce une aide. L'aide existe déjà ?",
      "choices": [
        "Oui, le programme suffit.",
        "Il faut vérifier le texte et son entrée en vigueur.",
        "Oui, si la vidéo est virale."
      ],
      "answer": 1,
      "why": "Une proposition peut être modifiée, reportée ou abandonnée. Elle ne prouve pas qu'un droit est en vigueur.",
      "sources": [
        {
          "label": "Vie publique — institutions et lois",
          "url": "https://www.vie-publique.fr"
        }
      ],
      "status": "pending_external_review",
      "offline": true
    },
    {
      "id": "fait-opinion",
      "country": "ALL",
      "topic": "Décryptage",
      "title": "Séparer les faits des commentaires",
      "body": "« Le budget a été voté » est une affirmation vérifiable ; « le budget est injuste » est un jugement. Les deux peuvent se discuter, mais ne se prouvent pas de la même façon.",
      "question": "Quelle phrase appelle une vérification factuelle ?",
      "choices": [
        "Cette décision est scandaleuse.",
        "Le Parlement a adopté ce texte à telle date.",
        "Je préfère cette proposition."
      ],
      "answer": 1,
      "why": "On peut chercher le texte, le vote et la date. Une appréciation exige des arguments, pas un faux label « vrai ».",
      "sources": [
        {
          "label": "Vie publique — vérifier les institutions",
          "url": "https://www.vie-publique.fr"
        }
      ],
      "status": "pending_external_review",
      "offline": true
    },
    {
      "id": "budget-deficit",
      "country": "ALL",
      "topic": "Budget",
      "title": "Déficit et dette, quelle différence ?",
      "body": "Le déficit compare des recettes et des dépenses sur une période. La dette représente des engagements accumulés à une date. Ils sont liés, mais ce n'est pas le même indicateur.",
      "question": "La dette correspond surtout à…",
      "choices": [
        "Un montant accumulé à une date.",
        "Une dépense d'un seul jour.",
        "Le nombre d'élus."
      ],
      "answer": 0,
      "why": "La dette est un stock et le déficit un flux. Compare toujours la période, la définition et la source.",
      "sources": [
        {
          "label": "Banque nationale de Belgique — projections",
          "url": "https://www.nbb.be/fr"
        }
      ],
      "status": "pending_external_review",
      "offline": true
    },
    {
      "id": "aides",
      "country": "ALL",
      "topic": "Budget",
      "title": "Une aide annoncée n'est pas toujours accessible",
      "body": "Un projet d'aide peut être annoncé mais dépendre d'un vote, d'une date de mise en œuvre, de ressources et de conditions d'éligibilité.",
      "question": "Avant de compter sur une aide, tu dois vérifier…",
      "choices": [
        "Seulement sa publicité.",
        "Les critères, la date et le service officiel.",
        "Le nombre de partages."
      ],
      "answer": 1,
      "why": "Une aide dépend de conditions concrètes, pas uniquement de sa communication politique.",
      "sources": [
        {
          "label": "Vie publique — décisions et dispositifs",
          "url": "https://www.vie-publique.fr"
        }
      ],
      "status": "pending_external_review",
      "offline": true
    },
    {
      "id": "programmes",
      "country": "ALL",
      "topic": "Partis",
      "title": "Comparer des programmes sans choisir à ta place",
      "body": "Compare les propositions sur des thèmes identiques. Cite les programmes originaux et leurs dates. Pose des questions sur le financement, le calendrier et la compétence de l'élu.",
      "question": "Quelle comparaison est la plus utile ?",
      "choices": [
        "Deux mesures sur le même thème, avec leurs sources.",
        "La popularité des slogans.",
        "Le nombre d'abonnés."
      ],
      "answer": 0,
      "why": "Une comparaison transparente expose les textes et les divergences sans distribuer de notes aux partis.",
      "sources": [
        {
          "label": "Ministère français de l'Intérieur — programmes candidats",
          "url": "https://www.elections.interieur.gouv.fr/comprendre-elections/comment-sont-encadrees-campagnes-electorales/comment-consulter-programme-des-candidats"
        }
      ],
      "status": "pending_external_review",
      "offline": true
    },
    {
      "id": "sondage-resultat",
      "country": "ALL",
      "topic": "Résultats",
      "title": "Un sondage n'est pas un résultat",
      "body": "Un sondage décrit des réponses à une date pour un échantillon. Un résultat électoral officiel compte les suffrages d'un scrutin.",
      "question": "Pour connaître le résultat d'un scrutin passé, consulte…",
      "choices": [
        "Un sondage d'avant le vote.",
        "Les chiffres publiés par l'autorité électorale.",
        "Une prédiction populaire."
      ],
      "answer": 1,
      "why": "Le résultat officiel d'une élection et une estimation d'intentions sont des données différentes.",
      "sources": [
        {
          "label": "Ministère de l'Intérieur — résultats",
          "url": "https://www.elections.interieur.gouv.fr/resultats"
        }
      ],
      "status": "pending_external_review",
      "offline": true
    },
    {
      "id": "accusation-decision",
      "country": "ALL",
      "topic": "Justice",
      "title": "Accusation et condamnation ne veulent pas dire la même chose",
      "body": "Une plainte, une enquête, une mise en examen ou une poursuite ne sont pas une condamnation. Toute information de justice exige une source et le stade exact de la procédure.",
      "question": "Que vérifier avant d'afficher « condamné » ?",
      "choices": [
        "Le titre d'un message anonyme.",
        "La décision de justice fiable et son caractère définitif, s'il est connu.",
        "Le nombre de commentaires."
      ],
      "answer": 1,
      "why": "Une accusation ne prouve pas la culpabilité. SAVRÉO ne publiera pas de fiches nominatives sans décision documentée, contexte et vérification juridique.",
      "sources": [
        {
          "label": "Vie publique — justice et institutions",
          "url": "https://www.vie-publique.fr"
        }
      ],
      "status": "pending_external_review",
      "offline": true
    },
    {
      "id": "autorites-locales",
      "country": "ALL",
      "topic": "Institutions",
      "title": "Qui prend les décisions près de chez toi ?",
      "body": "Selon le sujet, une décision peut dépendre d'une commune, d'une région ou de l'État. La même promesse n'a pas forcément le même décideur.",
      "question": "Pour comprendre une décision locale, cherche…",
      "choices": [
        "L'organe compétent, le texte et la date.",
        "Un seul influenceur.",
        "Uniquement le nom du parti."
      ],
      "answer": 0,
      "why": "Identifier la compétence évite d'attribuer une décision au mauvais niveau de pouvoir.",
      "sources": [
        {
          "label": "Vie publique — organisation des pouvoirs",
          "url": "https://www.vie-publique.fr"
        }
      ],
      "status": "pending_external_review",
      "offline": true
    },
    {
      "id": "be-16-europe",
      "country": "BE",
      "topic": "Voter",
      "title": "À 16 ans : les élections européennes en Belgique",
      "body": "En Belgique, les électeurs remplissant les conditions peuvent participer au scrutin européen dès 16 ans. Cette règle ne s'applique pas à toutes les élections.",
      "question": "À 16 ans, le vote pour la Chambre est-il aussi ouvert ?",
      "choices": [
        "Oui, chaque scrutin a le même âge.",
        "Non : le scrutin fédéral belge relève en principe de 18 ans.",
        "Uniquement avec une autorisation des parents."
      ],
      "answer": 1,
      "why": "Le droit de vote à partir de 16 ans concerne ici les élections européennes sous conditions. Il faut vérifier séparément l'obligation de participation et les règles propres à chaque élection et année.",
      "sources": [
        {
          "label": "SPF Intérieur — conditions d'électorat pour le Parlement européen",
          "url": "https://elections.fgov.be/electeurs"
        }
      ],
      "status": "pending_external_review",
      "offline": true
    },
    {
      "id": "be-18-chambre",
      "country": "BE",
      "topic": "Voter",
      "title": "Quel âge pour voter à la Chambre ?",
      "body": "En Belgique, le scrutin de la Chambre des représentants est ouvert sous conditions aux Belges âgés d'au moins 18 ans au jour du vote.",
      "question": "Quelle source vérifie cette règle ?",
      "choices": [
        "Le site du SPF Intérieur consacré aux élections.",
        "Un montage TikTok.",
        "Le tract d'un parti uniquement."
      ],
      "answer": 0,
      "why": "Les conditions sont définies dans les informations électorales officielles.",
      "sources": [
        {
          "label": "SPF Intérieur — électeurs",
          "url": "https://elections.fgov.be/electeurs"
        }
      ],
      "status": "pending_external_review",
      "offline": true
    },
    {
      "id": "be-participation",
      "country": "BE",
      "topic": "Voter",
      "title": "Participation obligatoire et choix secret",
      "body": "Pour les scrutins concernés en Belgique, la participation est obligatoire selon les conditions légales, tandis que le choix effectué dans l'isoloir est secret.",
      "question": "Être tenu de participer signifie-t-il choisir un parti ?",
      "choices": [
        "Non, il faut distinguer participation et choix de vote.",
        "Oui, un parti doit être choisi.",
        "Oui, sa famille décide."
      ],
      "answer": 0,
      "why": "Le bulletin blanc ou le choix personnel sont distincts de l'obligation de participation ; certaines règles peuvent varier suivant l'élection.",
      "sources": [
        {
          "label": "SPF Intérieur — participation, secret du choix et vote blanc",
          "url": "https://elections.fgov.be/node/111505"
        }
      ],
      "status": "pending_external_review",
      "offline": true
    },
    {
      "id": "be-bulletin",
      "country": "BE",
      "topic": "Voter",
      "title": "Que signifie un bulletin blanc ?",
      "body": "Un vote blanc n'exprime pas de préférence pour une liste. Il faut le distinguer d'un vote pour un candidat ou une liste.",
      "question": "Un bulletin blanc attribue-t-il ta voix à un parti ?",
      "choices": [
        "Oui, automatiquement au premier.",
        "Non, ce n'est pas un vote de préférence pour une liste.",
        "Oui, au dernier."
      ],
      "answer": 1,
      "why": "Ne te fie pas aux rumeurs : cherche les règles de comptage du scrutin.",
      "sources": [
        {
          "label": "SPF Intérieur — règles électorales",
          "url": "https://elections.fgov.be/electeurs"
        }
      ],
      "status": "pending_external_review",
      "offline": true
    },
    {
      "id": "be-resultats",
      "country": "BE",
      "topic": "Résultats",
      "title": "Lire les résultats des élections en Belgique",
      "body": "Les résultats peuvent être consultés par niveau de pouvoir, circonscription et, selon les jeux disponibles, par commune ou canton.",
      "question": "Comparer deux résultats exige surtout…",
      "choices": [
        "Le même type de scrutin et des dates identifiées.",
        "Deux captures sans dates.",
        "Uniquement les logos."
      ],
      "answer": 0,
      "why": "Un pourcentage communal et un chiffre fédéral ne portent pas nécessairement sur le même électorat.",
      "sources": [
        {
          "label": "SPF Intérieur — résultats électoraux",
          "url": "https://elections.fgov.be/informations-generales/resultats"
        }
      ],
      "status": "pending_external_review",
      "offline": true
    },
    {
      "id": "be-pouvoirs",
      "country": "BE",
      "topic": "Institutions",
      "title": "Fédéral, Région et Communauté",
      "body": "Les décisions belges sont réparties entre différents niveaux institutionnels. Une annonce faite au niveau fédéral ne dit pas à elle seule ce que décide une Région.",
      "question": "Que faut-il identifier en premier ?",
      "choices": [
        "Le pouvoir compétent pour le sujet.",
        "Le nombre de likes.",
        "La couleur du gouvernement."
      ],
      "answer": 0,
      "why": "Connaître l'autorité compétente aide à vérifier qui décide vraiment.",
      "sources": [
        {
          "label": "Belgium.be — pouvoirs publics",
          "url": "https://www.belgium.be/fr/la_belgique/pouvoirs_publics"
        }
      ],
      "status": "pending_external_review",
      "offline": true
    },
    {
      "id": "be-depenses",
      "country": "BE",
      "topic": "Budget",
      "title": "Lire un chiffre de dette publique belge",
      "body": "Un montant de dette ou de déficit doit être accompagné de l'année, de l'indicateur, du périmètre et de sa source. Une prévision n'est pas un résultat définitif.",
      "question": "Un chiffre 2028 « prévu » est-il une observation finale ?",
      "choices": [
        "Non, c'est une projection à vérifier.",
        "Oui, automatiquement.",
        "Oui, si le chiffre est précis."
      ],
      "answer": 0,
      "why": "Les projections de la BNB reposent sur des hypothèses et sont régulièrement révisées.",
      "sources": [
        {
          "label": "BNB — projections économiques",
          "url": "https://www.nbb.be/fr"
        }
      ],
      "status": "pending_external_review",
      "offline": true
    },
    {
      "id": "be-votes-archives",
      "country": "BE",
      "topic": "Résultats",
      "title": "Où consulter les archives électorales ?",
      "body": "Des élections précédentes disposent de tableaux publics. Regarde l'année et le type de scrutin avant de comparer.",
      "question": "Quel est le réflexe le plus fiable ?",
      "choices": [
        "Retrouver l'archive officielle datée.",
        "Comparer deux affiches sans date.",
        "Confondre sondage et résultat."
      ],
      "answer": 0,
      "why": "L'archive officielle documente les scrutins passés et évite les comparaisons trompeuses.",
      "sources": [
        {
          "label": "SPF Intérieur — archives des résultats",
          "url": "https://elections.fgov.be/informations-generales/resultats"
        }
      ],
      "status": "pending_external_review",
      "offline": true
    },
    {
      "id": "fr-voter-18",
      "country": "FR",
      "topic": "Voter",
      "title": "Qui peut voter aux élections nationales françaises ?",
      "body": "Sous les conditions applicables, le droit de vote des citoyens français s'exerce en principe à partir de 18 ans.",
      "question": "Un Français de 15 ans peut-il voter aux législatives ?",
      "choices": [
        "Oui, systématiquement.",
        "Non, pas avant l'âge légal.",
        "Oui, s'il suit l'actualité."
      ],
      "answer": 1,
      "why": "L'âge et la qualité d'électeur se vérifient via les sources officielles.",
      "sources": [
        {
          "label": "Service Public — conditions pour s'inscrire et voter",
          "url": "https://www.service-public.fr/particuliers/vosdroits/F1367"
        }
      ],
      "status": "pending_external_review",
      "offline": true
    },
    {
      "id": "fr-inscription",
      "country": "FR",
      "topic": "Voter",
      "title": "Comment vérifier son inscription électorale ?",
      "body": "L'inscription électorale peut être automatique à 18 ans sous certaines conditions, mais chacun doit pouvoir vérifier sa situation sur le service public.",
      "question": "Que faire en cas de doute ?",
      "choices": [
        "Vérifier via le service officiel.",
        "Se fier à une publication virale.",
        "Attendre les résultats du vote."
      ],
      "answer": 0,
      "why": "Les conditions et délais varient. Le service officiel aide à vérifier son inscription.",
      "sources": [
        {
          "label": "Service Public — inscription d'office à 18 ans",
          "url": "https://www.service-public.fr/particuliers/vosdroits/F1961"
        }
      ],
      "status": "pending_external_review",
      "offline": true
    },
    {
      "id": "fr-professions",
      "country": "FR",
      "topic": "Programmes",
      "title": "Où lire les programmes des candidats ?",
      "body": "Les professions de foi sont des documents présentés par les candidats. Lorsqu'elles sont disponibles, le ministère de l'Intérieur indique comment les consulter.",
      "question": "Le programme d'un candidat est…",
      "choices": [
        "Le texte de ses propositions, pas une loi adoptée.",
        "La liste des lois déjà entrées en vigueur.",
        "Un résultat de vote."
      ],
      "answer": 0,
      "why": "Les programmes sont des engagements à examiner à leur date et dans leur contexte.",
      "sources": [
        {
          "label": "Ministère de l'Intérieur — programmes des candidats",
          "url": "https://www.elections.interieur.gouv.fr/comprendre-elections/comment-sont-encadrees-campagnes-electorales/comment-consulter-programme-des-candidats"
        }
      ],
      "status": "pending_external_review",
      "offline": true
    },
    {
      "id": "fr-resultats",
      "country": "FR",
      "topic": "Résultats",
      "title": "Où vérifier les résultats français ?",
      "body": "Le site officiel des élections publie des résultats par scrutin, avec des archives et des niveaux territoriaux.",
      "question": "Quelle donnée utiliser pour un scrutin terminé ?",
      "choices": [
        "Les résultats officiels datés.",
        "Un sondage ancien.",
        "Un commentaire anonyme."
      ],
      "answer": 0,
      "why": "Ne mélange pas une estimation et un résultat proclamé.",
      "sources": [
        {
          "label": "Ministère français de l'Intérieur — résultats",
          "url": "https://www.elections.interieur.gouv.fr/resultats"
        }
      ],
      "status": "pending_external_review",
      "offline": true
    },
    {
      "id": "fr-pouvoirs",
      "country": "FR",
      "topic": "Institutions",
      "title": "Quel rôle pour la commune ?",
      "body": "En France, une commune possède des compétences locales ; d'autres décisions relèvent du département, de la région ou de l'État.",
      "question": "Comment savoir qui répond d'un sujet ?",
      "choices": [
        "Consulter les compétences officielles du niveau concerné.",
        "Lire uniquement le programme d'un seul élu.",
        "Connaître le nombre d'abonnés."
      ],
      "answer": 0,
      "why": "Un service public local n'a pas automatiquement la main sur une règle nationale.",
      "sources": [
        {
          "label": "Vie publique — collectivités territoriales",
          "url": "https://www.vie-publique.fr"
        }
      ],
      "status": "pending_external_review",
      "offline": true
    },
    {
      "id": "fr-comptes-partis",
      "country": "FR",
      "topic": "Budget",
      "title": "Les comptes des partis peuvent-ils être contrôlés ?",
      "body": "En France, la CNCCFP publie des informations relatives aux comptes des partis et aux financements des campagnes. Le statut d'un compte n'est pas un jugement de valeur global sur un parti.",
      "question": "Que regarder pour comprendre un financement ?",
      "choices": [
        "Les documents, l'exercice et la décision de l'organisme compétent.",
        "Un classement de popularité.",
        "Une rumeur."
      ],
      "answer": 0,
      "why": "Un bilan et un contrôle comptable sont des pièces précises qui doivent être datées.",
      "sources": [
        {
          "label": "CNCCFP — comptes et financements politiques",
          "url": "https://cnccfp.fr/"
        }
      ],
      "status": "pending_external_review",
      "offline": true
    },
    {
      "id": "fr-depenses",
      "country": "FR",
      "topic": "Budget",
      "title": "Déficit public et année de référence",
      "body": "Le déficit est mesuré sur une période ; pour comparer, précise l'année et le périmètre (État ou ensemble des administrations).",
      "question": "Comparer deux déficits sans année et périmètre est…",
      "choices": [
        "Risque de confusion.",
        "Toujours exact.",
        "Une preuve de fraude."
      ],
      "answer": 0,
      "why": "Les conventions de calcul et la période conditionnent l'interprétation.",
      "sources": [
        {
          "label": "Vie publique — finances publiques",
          "url": "https://www.vie-publique.fr"
        }
      ],
      "status": "pending_external_review",
      "offline": true
    },
    {
      "id": "fr-procuration",
      "country": "FR",
      "topic": "Voter",
      "title": "Comment se renseigner sur la procuration ?",
      "body": "Si un électeur français ne peut pas se déplacer, il peut se renseigner sur les démarches de procuration et leurs conditions officielles.",
      "question": "Le bon réflexe est de…",
      "choices": [
        "Vérifier les modalités actualisées auprès des services officiels.",
        "Partager ses mots de passe électoraux.",
        "Confier son identité à un inconnu."
      ],
      "answer": 0,
      "why": "Les délais et modalités pratiques doivent être confirmés auprès du service électoral.",
      "sources": [
        {
          "label": "Service Public — vote par procuration",
          "url": "https://www.service-public.fr/particuliers/vosdroits/F1604"
        }
      ],
      "status": "pending_external_review",
      "offline": true
    }
  ],
  "resources": {
    "BE": [
      {
        "topic": "Élections et résultats",
        "label": "SPF Intérieur — élections et résultats",
        "url": "https://elections.fgov.be/informations-generales/resultats"
      },
      {
        "topic": "Parlement et textes",
        "label": "La Chambre",
        "url": "https://www.lachambre.be/kvvcr/index.cfm?language=fr"
      },
      {
        "topic": "Finances et prévisions",
        "label": "Banque nationale de Belgique",
        "url": "https://www.nbb.be/fr"
      }
    ],
    "FR": [
      {
        "topic": "Élections et résultats",
        "label": "Ministère de l'Intérieur",
        "url": "https://www.elections.interieur.gouv.fr/resultats"
      },
      {
        "topic": "Programmes publiés",
        "label": "Professions de foi des candidats",
        "url": "https://www.elections.interieur.gouv.fr/comprendre-elections/comment-sont-encadrees-campagnes-electorales/comment-consulter-programme-des-candidats"
      },
      {
        "topic": "Finances des partis",
        "label": "CNCCFP",
        "url": "https://cnccfp.fr/"
      },
      {
        "topic": "Lois et institutions",
        "label": "Vie publique",
        "url": "https://www.vie-publique.fr"
      }
    ]
  },
  "snapshots": [
    {
      "id": "budget-wallonie-2026-10-12",
      "country": "BE",
      "scope": "Région wallonne",
      "date": "2026-10-12",
      "type": "Communication gouvernementale",
      "title": "Une trajectoire budgétaire annoncée pour 2027–2029",
      "summary": "Le Gouvernement wallon a présenté des orientations budgétaires et des mesures envisagées pour les prochaines années.",
      "verification": "Les montants, les dates et les conditions doivent être confirmés dans les textes adoptés et leurs publications officielles. Ce communiqué n'établit pas à lui seul les droits d'une personne.",
      "impact": "Aides, fiscalité, financement des services publics.",
      "source": {
        "label": "Wallonie — trajectoire budgétaire publiée le 12 octobre 2026",
        "url": "https://www.wallonie.be/fr/acteurs-et-institutions/wallonie/gouvernement-de-wallonie/communiques-presse/2026-10-12"
      }
    },
    {
      "id": "conseil-paris-2026-10",
      "country": "FR",
      "scope": "Ville de Paris",
      "date": "2026-10-09",
      "type": "Archives des délibérations",
      "title": "Comment retrouver les décisions du Conseil de Paris d’octobre",
      "summary": "La Ville de Paris publie des documents relatifs aux séances du Conseil des 6 au 9 octobre 2026 : comptes rendus, débats et délibérations.",
      "verification": "Une délibération publiée doit être consultée dans sa version exacte pour connaître son objet, son vote et sa portée. Un simple ordre du jour ne prouve pas son adoption.",
      "impact": "Transports, environnement, équipements et services locaux selon les dossiers.",
      "source": {
        "label": "Ville de Paris — archives du Conseil",
        "url": "https://www.paris.fr/pages/comptes-rendus-et-debats-et-deliberations-du-conseil-224"
      }
    }
  ],
  "localSources": {
    "BE": [
      {
        "scope": "Fédéral",
        "label": "Communiqués et Conseil des ministres",
        "url": "https://news.belgium.be/fr"
      },
      {
        "scope": "Région wallonne",
        "label": "Communiqués du Gouvernement wallon",
        "url": "https://www.wallonie.be/fr/acteurs-et-institutions/wallonie/gouvernement-de-wallonie/communiques-presse"
      },
      {
        "scope": "Ville de Mons",
        "label": "Plateforme des décisions du conseil communal de Mons",
        "url": "https://www.mons.be/fr/ma-commune/vie-politique/conseil-communal/ordres-du-jour-et-proces-verbaux/plateforme-deliberations"
      },
      {
        "scope": "Ville de Mons",
        "label": "Participation citoyenne à Mons",
        "url": "https://participation.mons.be"
      }
    ],
    "FR": [
      {
        "scope": "National",
        "label": "Vie publique — vie institutionnelle",
        "url": "https://www.vie-publique.fr"
      },
      {
        "scope": "National",
        "label": "Ministère de l'Intérieur — résultats électoraux",
        "url": "https://www.elections.interieur.gouv.fr/resultats"
      },
      {
        "scope": "Ville de Paris",
        "label": "Délibérations et comptes rendus du Conseil de Paris",
        "url": "https://www.paris.fr/pages/comptes-rendus-et-debats-et-deliberations-du-conseil-224"
      }
    ]
  }
};
})();
