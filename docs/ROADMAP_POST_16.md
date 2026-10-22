# SAVRÉO — suite du chantier 1.6 (22 octobre 2026)

## État vérifié
La bêta 1.6 sur `feature/savreo-brand-v05` dispose d'un premier Déclic, de niveaux XP, de 240 unités hors ligne, de révisions espacées, de 2 flux RSS pilotes et d'un laboratoire d'argumentation écrite. Le flux institutionnel est incomplet : aucun texte de loi applicable ne peut être déduit d'un titre RSS. Les 240 contenus n'ont aucune relecture indépendante enregistrée.

## P0 : faits, sécurité et pédagogie
- **24 QCM supplémentaires retravaillés** dans les packs Savoirs, Sciences, Vie quotidienne et Institutions (6 par pack). Options plus plausibles, moins d'indices évidents, même bonne réponse et même explication. Ce lot reste en attente de relecture externe. Mesurer ensuite les biais sur l'ensemble des 215 questions et faire relire le sens des distracteurs.
- Remplacer les **133 références génériques restantes** par des documents précis après consultation humaine, priorité droits des jeunes, emploi, logement, élections, protection des données et santé. Aucun « vérifié » sans preuve et date de contrôle.
- Contrôle indépendant, conformité RGPD/mineurs et traitement des plaintes à obtenir AVANT diffusion à large public. Le dépôt GitHub a été contrôlé comme **public** : vérifier sa confidentialité avec le propriétaire et appliquer des restrictions d'accès à la Preview avant partage sous NDA ; un NDA n'empêche pas la copie technique.

## P1 : attractivité et apprentissage profond
- Première interaction : mini-Déclic libre **avant** toute demande de prénom, âge ou centres d'intérêt, sans profilage ni points au simple clic. Ne pas casser l'historique des utilisateurs existants.
- Déclics : retour après une bonne réponse, puis application dans un nouveau contexte lorsqu'une question de transfert soigneusement relue existe. XP une seule fois, erreur utile, pas de sanction de rupture de série.
- Progression : distinguer « réussi une fois », « appliqué » et « revu plus tard » ; ne pas nommer « maîtrisé » ce qui n'a été vérifié qu'une fois.
- UX : une action principale par écran, premier cas fort mais non sensationnaliste, accessibilité clavier et lecteurs d'écran, illustrations uniquement si elles apportent des preuves, animation désactivable.
- Couvrir davantage de connaissances concrètes (budget, contrat, arnaques, droits, vérification, débat), mais **ne pas augmenter le volume brut** avant la relecture du corpus existant.

## P1 : vigie locale et actualités
- Les flux RSS existants restent fédéral belge et Service Public français. En complément, donner un accès clairement identifié aux **publications régionales/communales documentaires** (Wallonie, Mons, etc.) sans prétendre qu'elles sont agrégées en direct.
- Pour chaque future intégration : origine autorisée, titre exact, date publiée, date de consultation, autorité et territoire, nature de l'acte, statut juridique **non vérifié par défaut**, historique des corrections, liens sourcés. Aucune suggestion de vote/parti.
- L'ajout d'un flux régional automatique exige de vérifier le format, les droits et le maintien technique auprès de la source. Ne pas inventer de flux RSS ni d'actualité.

## P2 : expression, partage, confidentialité
- Oral : défi de 40 secondes **sans enregistrement ni microphone** ; suggérer position, raison, exemple, nuance et conclusion. Si transcription ensuite, consentement explicite et vérification traitement externe.
- Partage facultatif d'un lien vers l'exercice générique et non de résultats nominatifs, classement d'opinions, notes de partis ou historique d'un jeune.
- Éviter notifications compulsives, classements publics de jeunes et analyse des convictions. Tester d'abord les usages solo.

## Critères de sortie
1. Tests CI verts et vérifications Safari iOS/Chrome Android, lecture VoiceOver/TalkBack, mode avion après préchargement, retour d'ancienne version sans perte d'XP.
2. Relecture externe datée de tous les contenus juridiques/civiques présentés comme fiables.
3. Tests réels auprès de 24 jeunes (8 par tranche 12–15/16–20/21–28), J0/J+3/J+7, consentements applicables, résultats anonymisés, aucun résultat inventé.
4. Pull request en brouillon jusqu'à clôture des défauts P0 ; pas de fusion ou déploiement production automatique.
