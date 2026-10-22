# SAVRÉO — version 1.0 bêta

SAVRÉO — « Apprends ce qui compte. » Une application web mobile pour apprendre à comprendre le monde, développer l'esprit critique, s'exprimer et connaître ses droits, centrée sur la Belgique et la France. Démonstration pédagogique ; aucune orientation partisane.

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
