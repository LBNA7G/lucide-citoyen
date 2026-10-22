# SAVRÉO — Audit éditorial initial du corpus de 240 unités

**Date : 22 octobre 2026.** Audit automatisé de structure et de spécificité des URL sur la branche de développement. **Aucune fiche n’a été approuvée par un relecteur indépendant.**

## État quantitatif

| Type de contenu | Unités | Références | Références trop générales |
|---|---:|---:|---:|
| Situations | 18 | 23 | 3 |
| Leçons | 12 | 15 | 1 |
| Fiches juridiques | 10 | 10 | 2 |
| Comprendre le vote et les institutions | 24 | 24 | 10 |
| Micro-exercices | 176 | 176 | 119 |
| **Total** | **240** | **248** | **135 (54,4 %)** |

### Comment est calculée une « source trop générale » ?

Une URL vers la racine d’un site institutionnel (ou un simple /fr) est classée **générique**. Elle confirme parfois l’identité de l'organisme, mais ne démontre pas nécessairement le point précis de la fiche. La métrique est un **signal de travail éditorial**, pas une preuve de fausseté ; à l’inverse, une URL profonde n’est pas forcément exacte, accessible ou fiable. La vérification humaine du document précis reste indispensable.

## Priorités

**P0 — droits civiques, justice, aides et santé : vérification juridiction/date.** Rechercher la loi ou la page officielle correspondante, vérifier la date de consultation, les exceptions et le pays. Un communiqué ou un texte en projet ne doit pas être présenté comme un droit en vigueur. Les informations sur les procédures judiciaires doivent distinguer plainte, enquête, jugement et décision définitive.

**P1 — dix fiches civiques avec URL générique encore à approfondir :**
- `civic:promesse-loi`, `civic:fait-opinion`, `civic:budget-deficit`, `civic:aides`
- `civic:accusation-decision`, `civic:autorites-locales`, `civic:be-depenses`
- `civic:fr-pouvoirs`, `civic:fr-comptes-partis`, `civic:fr-depenses`

**P2 — 119 micro-exercices avec source institutionnelle générale.** Faire correspondre chaque situation à une étude, une fiche, un article ou une page précise. Pour les simulations pédagogiques générales (écoute, argumentation), rendre explicite qu'il s'agit d'un conseil éducatif plutôt que d'une règle de droit.

## Corrections déjà apportées et contrôlées

Cinq fiches électorales pointent maintenant vers une page plus pertinente :
- `civic:be-16-europe` — conditions du droit de vote selon le type d'élection : https://elections.fgov.be/electeurs
- `civic:be-participation` — participation, bulletin blanc : https://elections.fgov.be/node/111505
- `civic:fr-voter-18` — conditions d'inscription et qualité d'électeur : https://www.service-public.fr/particuliers/vosdroits/F1367
- `civic:fr-inscription` — inscription automatique à 18 ans, sous conditions : https://www.service-public.fr/particuliers/vosdroits/F1961
- `civic:fr-procuration` — modalités de procuration : https://www.service-public.fr/particuliers/vosdroits/F1604

**Attention au droit belge 2024 :** la question du vote européen à 16 et 17 ans a connu des évolutions et une décision de la Cour constitutionnelle. Toujours préciser scrutin et année, et vérifier la règle applicable au moment d'une nouvelle élection, plutôt que de réutiliser hors contexte une archive de 2024.

## Renforcement technique

Le test `tests/editorial-integrity.test.mjs` contrôle :
- 240 identifiants uniques et présence de références ;
- correspondance exacte entre URL de la fiche et `content/editorial-registry.json` pour les 215 contenus modulaires ;
- interdiction de marquer une fiche `reviewed` sans date, responsable compétent et source spécifique ;
- absence de classement ou de score politiques dans le répertoire de partis.

**Limites** : l'automatisation n'établit pas la véracité des affirmations ni le bon fonctionnement permanent des sites. Les 25 contenus non modulaires sont seulement vérifiés via le registre et les tests existants ; un audit source par source reste nécessaire.

## Conditions avant lancement

1. Traiter d'abord les 15 références génériques des catégories droits/situations/leçons/civiques prioritaires, puis les 119 micro-fiches restantes.
2. Faire relire chaque fiche sensible avec un relecteur habilité, une date, une source exacte et une trace de validation.
3. Tester le rendu sans connexion, les mises à jour du cache et la persistance de progression sur vrais appareils.
4. Réaliser le pilote avec 24 jeunes selon le protocole existant et documenter les résultats à J0, J+3 et J+7.
5. Se garder de toute formule du type « savoirs validés » ou « actualités en temps réel hors ligne » tant que ces critères ne sont pas remplis.

## Suivi après premier lot de 12 QCM

Après le remaniement des questions civiques prioritaires et de quatre références documentaires, le registre contient désormais **133 références génériques sur 248**. Le chiffre initial de **135 sur 248** dans le tableau ci-dessus reste conservé comme état de départ de l'audit.

Douze QCM sur vote, programmes, budgets, aides, résultats et procédures judiciaires ont été réécrits ; ils comportent désormais 3 réponses plus plausibles avec un bon équilibre A/B/C (4/4/4). Sur ces 12 questions, 3 réponses correctes sont encore les plus longues ou ex aequo, contre 8 avant la réécriture. Les fiches sont toujours en attente de validation indépendante.

Les URL des fiches concernées ont été synchronisées avec le registre. Vérifier à nouveau la précision de l'ensemble des pages au moment de la publication et à chaque évolution légale.
