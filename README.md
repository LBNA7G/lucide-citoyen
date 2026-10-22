# SAVRÉO — version 0.5

SAVRÉO — « Apprends ce qui compte. » Une application web mobile pour apprendre à comprendre le monde, développer l'esprit critique, s'exprimer et connaître ses droits, centrée sur la Belgique et la France. Démonstration pédagogique ; aucune orientation partisane.

## Expérience v0.5

- **Accueil allégé** : un Déclic du jour, une leçon à reprendre et deux accès rapides.
- **4 rubriques mobiles** : Accueil, Découvrir, Pratiquer, Mes droits ; le profil reste accessible en haut.
- **Identité SAVRÉO** : typographie sobre, fond bleu nuit, vert citron réservé aux accents importants, nouveau pictogramme S.
- **Progression conservée** : la clé de stockage locale de LUCIDE v0.4 est maintenue pour éviter toute perte de données lors de la migration.
- **Version de prévisualisation** : à vérifier sur plusieurs tailles d’écran avant publication dans la branche main.

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
