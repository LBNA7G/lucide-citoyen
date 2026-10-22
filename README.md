# SAVRÉO — version 1.6.2 bêta

## 1.6.2 — Première vraie extension régionale de la Vigie
- Flux institutionnel fédéral belge **et** flux du Parlement de Wallonie (« derniers décrets adoptés »), en parallèle, à partir du catalogue officiel des flux RSS du Parlement.
- France : Service Public conserve son flux pilote distinct.
- Pour chaque publication RSS : source attribuée, territoire, date, avertissement « statut juridique non vérifié » ; affichage des sources indisponibles même lorsque l'autre source fonctionne.
- Filtres territoriaux BE, possibilité de lire les liens documentaires communaux en dehors du flux RSS.
- Couverture non exhaustive ; un décret adopté ne signifie pas nécessairement qu'il est en vigueur. Les éventuels cas sans résultats ne sont pas remplis artificiellement.
- L'URL du flux Wallonie est publiée par le Parlement (https://www.parlement-wallonie.be/flux-rss). Le flux et les liens d'articles peuvent changer ; vérifier leur bon fonctionnement en environnement réel.



SAVRÉO — « Apprends ce qui compte. » Une application web mobile pour apprendre à comprendre le monde, développer l'esprit critique, s'exprimer et connaître ses droits, centrée sur la Belgique et la France. Démonstration pédagogique ; aucune orientation partisane.

## Bêta 1.6.1 — Des défis plus utiles et une bêta mieux encadrée

- Démonstration d'un Déclic fictif avant inscription, sans prénom ni points.
- Sur cinq cas, exercice de transfert dans une situation nouvelle. La progression distingue maintenant « réussi une fois » et « appliqué à un autre cas », sans faire croire à une maîtrise durable.
- Partage facultatif d'un **lien vers un exercice**, pas vers des résultats personnels ; accès direct par `#declic/identifiant`.
- Défi oral facultatif de 40 secondes, sans microphone ni enregistrement ; le coach IA reste désactivé par défaut.
- Vigie : liens directs régionaux/communaux séparés du RSS fédéral/national ; chaque titre porte l'avertissement « statut juridique non vérifié ».
- Deux lots de 48 QCM re-rédigés pour réduire les mauvaises réponses caricaturales ; **relecture éditoriale indépendante toujours nécessaire**.
- Ce lot **ne constitue pas** une couverture exhaustive des territoires, une validation humaine ou un essai utilisateur.

**Audit de forme actualisé : 176/215 QCM modulaires présentent encore une bonne réponse la plus longue ou ex æquo (contre 197/215 au départ).** Les 48 questions retravaillées comptent 23 réponses de ce type, contre 44 avant correction ; une relecture humaine est nécessaire pour évaluer l'exactitude des options, et ce comptage n'est pas une preuve de réussite d'apprentissage.

## Bêta 1.6 — Une progression qui donne envie de revenir

- **Accueil** : premier écran plus direct, niveau XP (Curieux / Éclaireur / Explorateur / Esprit critique), barre de progression vers le prochain palier, sans obligation de connexion quotidienne.
- **Déclic du jour** : une mission est validée **uniquement après une bonne réponse**, avec un message de réussite, +30 XP pour un cas réussi pour la première fois, une explication et un autre défi inédit proposé. Une mauvaise réponse ouvre un nouvel essai sans distribuer de points ; rejouer un cas validé ne crée pas des points infinis.
- **Leçons et micro-fiches** : retours d'XP mesurés et différenciation entre première réussite et révision. Les 240 unités restent consultables ; la logique de révision espacée est conservée.
- **Actualités** : chargement à l'ouverture de la Vigie, rechargement à la demande et automatiquement lors d'un retour après dix minutes, avec bouton d'actualisation ; tri du plus récent au plus ancien, dédoublonnage des URL de publications RSS, filtre sur les 14 derniers jours et date exacte de consultation du flux.
- **Neutralité** : deux flux pilotes seulement (institutions fédérales belges et Service Public français), donc couverture **non exhaustive** ; aucune publication n'est assimilée à une loi applicable ni évaluée selon un point de vue politique. Aucune actualité fictive en cas d'échec réseau.
- **Vie privée** : progression stockée localement, pas de profil d'opinion politique ni de notification compulsive.
- **Accessibilité** : cibles de 44 px pour les nouveaux filtres d'actualité, messages de résultat accessibles, animations de progression désactivées si l’utilisateur préfère une réduction du mouvement.
- **Tests** : scénarios de mission échouée puis réussie, XP attribué une seule fois, niveau et accueil, tri RSS et sécurité de domaine ; voir `tests/calm-ui-runtime.test.mjs` et `tests/news-refresh.test.mjs`.

Cette bêta traite un premier lot de micro-améliorations et **n'est pas une preuve d'engagement utilisateur ou de rétention**. Les sessions réelles de test avec 24 jeunes et la relecture indépendante des 240 fiches restent nécessaires.

## Bêta 1.5 — « Qui affirme quoi, quand et où ? »

- **Avant le quiz**, chaque fiche de « Comprendre le vote » et « Savoirs essentiels » dispose d'un panneau de provenance : source, territoire ou type d'exercice, date de l'édition pédagogique, état de relecture indépendante et avertissement lorsque la référence est trop générale.
- **Vie publique** : les archives institutionnelles sont décrites comme des publications documentaires, sans supposer qu'une annonce ou un ordre du jour est une mesure en vigueur. La date et la portée sont visibles.
- **Choix du territoire** : navigation entre sources nationales/fédérales, régionales et communales lorsque disponibles, sans classement politique ; les liens locaux de Mons, Brugelette et Paris restent distingués des flux d'actualité récents.
- **Source communale supplémentaire** : un procès-verbal daté du conseil communal de Brugelette (17 avril 2025), explicitement présenté comme archive.
- **Protection éditoriale** : le lien vers un site institutionnel ne constitue pas un label de vérification indépendante ; aucune des 240 fiches n'est prétendue validée par un expert.
- **Tests ajoutés** : chargement simulé des écrans, visibilité des sources avant réponse, changement de filtre territorial et réinitialisation au changement de pays, contrôles des métadonnées documentaires et scripts compatibles avec le cache v1.5.
- Le site public ne change pas. Aucun déploiement Vercel manuel n'a été demandé. Le détail des limites et du fonctionnement est dans [la charte de provenance v1.5](docs/PUBLIC_EVIDENCE_DESIGN_V15.md).

## Travail qualité — audit du 22 octobre 2026

- 240 unités intégrées, **0 validation indépendante enregistrée** ; volume et fiabilité sont deux étapes distinctes.
- 248 références enregistrées, dont 133 URL générales à remplacer progressivement par des documents précis. [Rapport de spécificité des sources](docs/EDITORIAL_AUDIT_2026-10-22.md).
- Sur 215 QCM modulaires, 206 ont une bonne réponse qui est la plus longue ou ex aequo : risque de réussite sans compréhension. [Plan d'amélioration pédagogique](docs/QUIZ_QUALITY_2026-10-22.md).
- Cinq fiches électorales BE/FR ont reçu des liens institutionnels plus ciblés. Le registre éditorial est synchronisé avec les modules.
- Les nouvelles micro-fiches suggèrent d'abord une révision due ou un contenu inédit ; seulement trois révisions urgentes sont présentées avant le panneau dépliable.
- Tests d'intégrité éditoriale, biais des quiz, navigation et progression ajoutés au pipeline GitHub. Aucun déploiement manuel Vercel demandé.

## Version 1.4 bêta — 240 unités hors ligne en cours de validation

- **240 unités pédagogiques uniques écrites** : 18 situations, 12 leçons, 10 fiches de droits, 24 civiques et 176 micro-exercices.
- **80 à 176 micro-exercices** par enrichissement progressif des packs : 32 savoirs essentiels, 48 culture générale/sciences, 48 choix quotidiens/contrats/logement et 48 institutions/vie publique/budgets.
- 59 exercices conseillés aux 12–15 ans, 59 aux 16–20 ans, 58 aux 21–28 ans dans les packs micro-learning. Aucune interdiction d'accès aux autres âges.
- Révision espacée pour les micro-exercices : rappels à 1, 3, 7, 14, 30 jours selon les réponses ; progression locale préservée avec le même stockage que les versions antérieures.
- Catalogue discret, plié au départ, avec choix explicite de tranche d'âge.
- Les nouveaux packs sont prévus dans le préchargement du service worker. Les liens externes, le flux d'actualité et les documents en ligne nécessitent toujours une connexion.
- Tests automatiques, registre, sources documentaires et validation externe **distincts** : aucune revue par experts ou cohorte de 24 jeunes encore réalisée.
- Voir [protocole 24 jeunes](docs/PILOT_24_YOUNG_USERS.md) et [guide de validation éditoriale](docs/EDITORIAL_REVIEW_PLAYBOOK.md).

## Version 1.2 bêta — nouveaux savoirs et annuaire documentaire

- **32 micro-fiches supplémentaires hors ligne** (11 pour 12–15 ans, 11 pour 16–20 ans, 10 pour 21–28 ans) : vérification de l’information, cybersécurité, argent, consommation, statistiques et institutions. Tous les sujets sont accessibles à toutes les tranches d’âge ; seules les propositions sont orientées.
- **Réponses réparties entre A/B/C** pour réduire la réussite automatique par clic sur la première option. Chaque fiche contient une explication et au moins une source institutionnelle.
- **Première bibliothèque documentaire des partis** : 12 partis belges correspondant à l’échantillon complet du chiffrage BFP de 2024, 5 documents français sélectionnés initialement à titre illustratif, **non exhaustifs**. Sources datées et directement attribuées, ordre alphabétique ; aucune note électorale ni classement.
- **Données non vérifiées laissées vides** : dirigeants, bilan des mandats, procédures et décisions judiciaires, chiffres particuliers et résultats détaillés. L'absence de donnée ne signifie ni absence de fait ni constat de faute.
- **96 unités pédagogiques uniques hors ligne au stade v1.2** ; les 17 entrées documentaires partisanes et les archives d’actualité sont comptées séparément. Registre de relecture à 96 entrées, toutes en attente de validation indépendante.
- **Tests techniques** couvrant le rendu et l’apprentissage hors ligne, le catalogue, les quiz, l’annuaire, les contrastes de base et la conservation de la progression.
- **Actualités** : le flux en ligne existant est limité aux titres officiels nationaux ; les sources municipales et régionales disposent d’accès directs, pas encore d’agrégation automatique exhaustive.



- **Trois nouvelles portes** dans « Découvrir → Vie publique » : publications institutionnelles, apprentissage électoral et méthode de consultation des dossiers publics.
- **24 exercices civiques uniques** entièrement fournis dans le cache hors ligne : 8 communs à la Belgique et à la France, 8 propres à la Belgique et 8 à la France (16 accessibles par pays).
- **Exemples d'archives datées** : publication gouvernementale wallonne du 12 octobre 2026 et documents du Conseil de Paris d'octobre 2026, clairement séparés de l'actualité en direct.
- **Sources par territoire** : fédéral/régional/local ; plateformes publiques vérifiées pour le Conseil communal de Mons et le Conseil de Paris.
- **Neutralité éditoriale** : pas de note de parti, pas de matching électoral, pas de tri idéologique à partir du profil, pas d'assimilation d'une accusation à une condamnation.
- **Registre** : 64 unités pédagogiques uniques hors ligne au total ; toutes les unités pertinentes restent à valider par les experts avant une publication de confiance.
- **Objectif progressif** : 240 unités hors ligne, sans gonfler les comptes par les quiz et les révisions. Voir [plan détaillé](docs/CONTENT_ROADMAP_240.md).
- **Règles de contenus sensibles** : voir [politique de neutralité](docs/CIVIC_EDITORIAL_NEUTRALITY.md).
- **Actualité fraîche** : nécessite internet et vérification datée ; la Vigie préexistante ne couvre pas toutes les villes. Ne jamais présenter une archive comme une information mise à jour en temps réel.

## Bêta 1.0 — contenus de la vraie vie et vérifications

- **18 situations pédagogiques** au total, dont 9 nouvelles simulations fictives signalées comme telles : droit à l'image, captures hors contexte, faux cadeaux, premiers salaires, recrutement frauduleux, partage de localisation, fausse location, abonnements et budget personnel.
- **12 leçons** au total, dont 6 nouveaux modules avec quiz, justification de la réponse et références institutionnelles.
- **6 parcours progressifs**, dont 3 nouveaux ateliers adaptés à l'âge : vérification de l'information (12–15 ans), offres douteuses (16–20 ans), précautions face à une location (21–28 ans). Les thèmes ne sont jamais verrouillés par âge.
- **Recommandations** tenant compte des intérêts et tranches d'âge, sans profils publics ni collecte d'historique à distance.
- **Réponses pédagogiques** : mauvaise réponse accompagnée de la bonne option et de son explication.
- **Progression, apparence et préférences locales** préservées de la 0.9. Ressources hors ligne mises à jour.
- **Registre éditorial : 40 éléments**, tous en attente de validation indépendante, dont 18 situations, 12 leçons et 10 fiches de droits.
- Tests fonctionnels, contrôles de source et audit de préparation dans `docs/BETA_1_0_AUDIT.md` ; **validation en conditions réelles et pilote de 24 jeunes non réalisés**.

## Expérience v0.5

- **Accueil allégé** : un Déclic du jour, une leçon à reprendre et deux accès rapides.
- **4 rubriques mobiles** : Accueil, Découvrir, Pratiquer, Mes droits ; le profil reste accessible en haut.
- **Identité SAVRÉO** : typographie sobre, fond bleu nuit, vert citron réservé aux accents importants, nouveau pictogramme S.
- **Progression conservée** : la clé de stockage locale de LUCIDE v0.4 est maintenue pour éviter toute perte de données lors de la migration.
- **Version de prévisualisation** : à vérifier sur plusieurs tailles d’écran avant publication dans la branche main.

## Démarrage personnalisé (v0.6)

Au premier lancement, SAVRÉO demande un prénom ou pseudo, l'une des tranches d'âge 12–15 / 16–20 / 21–28 ans et propose un choix de genre **facultatif**. Les données sont conservées localement sans compte ; aucune de ces préférences n'est envoyée au coach IA ou au flux d'actualité. Le prénom s'affiche sur l'accueil, l'âge aide à sélectionner les situations et leçons proposées, et le genre ne change que certaines formules de bienvenue. Aucun sujet n'est bloqué. Les préférences se modifient depuis « Mon parcours » et peuvent être effacées avec les données locales. La clé locale historique reste utilisée pour conserver la progression existante.

## Centres d'intérêt (v0.7)

Une seconde étape facultative permet de sélectionner **jusqu'à 3 sujets** : argent & travail, droits, actualité & société, expression & débat, réseaux & information, culture & réflexion. Le choix est enregistré dans la progression locale, n'est pas envoyé aux services externes et reste modifiable dans le profil. Il influence la recommandation d'un Déclic et de la prochaine leçon ; la sélection vide conserve une recommandation adaptée à la tranche d'âge. L'ensemble des modules reste librement accessible.

Pour vérifier la migration : utiliser une session vierge, une session v0.6 existante sans centres d'intérêt, puis modifier les préférences dans le profil et les exporter/effacer.

## Parcours, design system, validation — v0.8

- **3 parcours** : vérifier une information, argent/travail, connaître ses droits. Chaque parcours relie un cas, une leçon avec quiz et un débat.
- **Mémorisation** : une réussite planifie la première révision à J+1, puis J+3 / J+7 / J+14 / J+30, avec remise à J+1 après une erreur. La progression antérieure est conservée.
- **Design system documenté** : `docs/DESIGN_SYSTEM.md`; tokens, états, composants, usages responsive.
- **Qualité éditoriale** : 25 fiches inventoriées, avec des références pour les 6 leçons fondamentales dans `content/editorial-registry.json`, toutes en attente de validation indépendante, avec contrôles automatiques dans `tests/editorial-registry.test.mjs`.
- **Étude utilisateur** : protocole pour 24 jeunes dans `docs/USER_STUDY_24.md` et tableau anonymisé vierge `docs/USER_STUDY_TRACKER.md`. **Aucun recrutement ni test réel à ce stade.**
- **Partenariats pressentis** : `docs/PARTNERSHIP_PIPELINE.md`; aucune prise de contact ni approbation réalisée.
- **Charte éditoriale** : `docs/EDITORIAL_POLICY.md`. Ne pas commercialiser une fiche juridique comme « certifiée » sans contrôle externe documenté.

## Calm UI (v0.9)

- **Apparence** : clair, sombre et automatique (préférence du téléphone), avec option mémorisée dans le stockage local et bascule rapide dans l'en-tête ; démarrage sans flash par script d'amorçage.
- **Accueil minimal** : salutation, Déclic prioritaire, reprise d'une seule leçon et rappel conditionnel. Les sections secondaires ne se battent plus sur l'écran.
- **Découvrir / Pratiquer** : trois destinations principales, puis autres ressources et missions sous détails expansibles.
- **Leçons** : le premier concept et son quiz visibles, détails, exemples et sources sous accordéons explicitement nommés.
- **Droits** : une recherche puis les titres de fiches, détails ouverts à la demande et limites juridiques accessibles.
- **Profil** : réglage des modes, informations personnelles, progression simplifiée ; journal et actions de confidentialité repliés.
- **Cas, dico, débat et actualité** : contenus secondaires repliés, priorité à l'activité.
- **Tokens contrastes vérifiés** et contrôles automatiques : `tests/calm-ui.test.mjs`. **Audit visuel mobile, lecteur d'écran et pilote 24 jeunes toujours non réalisés.**
- Voir `docs/CALM_UI.md` pour critères et sources W3C. Aucun mode clair/sombre n'est présenté comme médicalement préférable à tous les utilisateurs.

## Ce qui fonctionne

- **Déclic** : cas pratiques BE/FR, réponses interactives et sources.
- **Dico** : définitions claires, exercices et validation des mots.
- **Argumenter** : entraînement à la position, concession, argument, exemple, conclusion et analyse locale de structure.
- **Coach IA (optionnel)** : analyse sémantique par le serveur Vercel, réécriture fidèle, objections. **Désactivé par défaut.**
- **Radar** : flux officiels, affichage de la source et date de consultation ; flux BE des communiqués fédéraux, flux FR Service-Public. Ne constitue pas un suivi exhaustif des décisions politiques.
- **Missions quotidiennes** et points XP ; progression locale, export et effacement.
- Interface adaptée au mobile, prise en charge PWA et mode dégradé hors ligne.

## Déploiement

Connecter ce dépôt à un projet Vercel (framework: Other, dossier racine: `./`). Publier la branche `main` après avoir vérifié le résultat du déploiement Preview. Les routes `api/*.js` sont des fonctions Vercel : elles ne fonctionnent pas avec un simple `python -m http.server`.

Pour les contrôles : `node scripts/check.mjs` et `node --test tests/*.test.mjs`. Les tests automatiques GitHub les exécutent à chaque push.

## Activation **volontaire** du coach IA

1. Avant toute activation publique : configurer un budget plafonné et des alertes AI Gateway dans l'équipe Vercel.
2. Mettre en place une limitation anti-abus distribuée et un contrôle d'utilisation : la limitation mémoire actuelle de la fonction est seulement indicative et **insuffisante pour une exposition publique**.
3. Vérifier les conditions de traitement des textes utilisateurs et afficher une information de confidentialité claire. Éviter la saisie de données personnelles sensibles.
4. Activer `AI_GATEWAY_ENABLED=true` dans Vercel uniquement après ces vérifications ; AI Gateway utilise l'authentification OIDC Vercel ou une clé stockée côté serveur (`AI_GATEWAY_API_KEY`), jamais exposée au navigateur.
5. Modèle testé dans le catalogue Vercel : `google/gemini-3.1-flash-lite` (vérifier sa disponibilité et son coût avant de l'activer).

En l'absence de configuration, le coach affiche un message explicite et l'analyse locale reste entièrement disponible.

## Rigueur citoyenne et juridique

Les publications RSS sont des **titres officiels bruts**, pas des textes de loi analysés. Ne jamais affirmer qu'une annonce est en vigueur sans vérifier le texte, son statut, sa date et la juridiction. Aucun contenu politique n'est promu. Le droit dépend notamment de l'âge, du pays et de la situation.

## Confidentialité

Par défaut, réponses, progression et favoris sont conservés dans le navigateur (localStorage), sans compte ; le contenu soumis volontairement au coach IA serait transmis au fournisseur IA via un serveur. Ne pas copier de données sensibles dans les réponses.
## Note sur la marque

SAVRÉO est un nom de travail retenu, non un constat de disponibilité juridique. Avant publication commerciale : vérifier les marques similaires (BOIP, EUIPO/TMview), les domaines, les réseaux et les classes pertinentes, puis envisager une recherche professionnelle d'antériorité.
