# SAVRÉO 1.0 bêta — audit fonctionnel, contenu et critères de sortie

**Statut du 22 octobre 2026 : prévisualisation technique, pas encore lancement public.**

## Ce qui est techniquement réalisé

| Domaine | Résultat | Limites |
|---|---|---|
| Navigation | Routes principales testées par simulation DOM Node | Pas de test manuel exhaustif iPhone/Android |
| Onboarding | Prénom/pseudo, tranches d'âge, genre facultatif, intérêts | Contrôle RGPD mineurs à confirmer avant collecte pilote |
| Thèmes | Clair, sombre, auto, préférences sauvegardées | Audit complet WCAG/lecteur d'écran non réalisé |
| Leçons | 12 leçons courtes : 6 historiques + 6 nouveaux modules | Six nouvelles leçons sans visa d'expert externe |
| Situations | 19 situations : 10 historiques + 9 simulations fictives | Couverture équilibrée en âge dans les nouveaux contenus |
| Parcours | 6 parcours : 3 initiaux et 3 nouveaux parcours ciblés par âge | Les sujets non conseillés restent accessibles à tous |
| Révisions | Quiz, première révision au lendemain, répétition espacée | Pas d'étude d'efficacité mémorielle réalisée |
| Progression | Ancienne clé localStorage conservée, formats de progrès non remplacés | À vérifier après mise à jour depuis l'ancienne version sur vrai appareil |
| Navigation hors ligne | Service worker actualisé pour inclure la bibliothèque bêta | Test physique Safari PWA sans connexion à faire |
| Recherche des droits | Search et accordéons, juridiction sélectionnable | Fiches juridiques toujours en attente de relecture |
| Sources | Liens primaires ou spécialisés fournis, 40 entrées au registre | Chaque source doit encore être recontrôlée manuellement à publication |
| IA facultative | Coach conservé sans activation forcée | Audit vie privée et transmission externe requis |

## Deux exigences importantes

1. **Évaluation de contenu** : les 15 nouveaux modules portent la mention de simulation ou de leçon pédagogique. Aucune fiction ne doit être présentée comme un témoignage réel. En droit, consulter la source primaire et valider les exceptions avant publication.
2. **Autonomie sans pression** : aucun parcours ne bloque l'exploration des autres classes d'âge ; les exercices ne donnent pas de punition lors d'un oubli.

## Architecture de la version bêta

- `app.js` — rendu, progression locale, scénarios historiques, recommandations.
- `curriculum-beta.js` — 9 scénarios + 6 leçons avec réponses argumentées, tranche d'âge suggérée, intérêt et source.
- `content/editorial-registry.json` — 40 contenus répertoriés, tous **pending_external_review**.
- `tests/curriculum-beta.test.mjs` — quiz, couverts par âge, source et métadonnées.
- `tests/calm-ui-runtime.test.mjs` — simulation chargement écran, choix, réussite, révision et réponse fausse.
- `sw.js` — cache des scripts, de la feuille de style et des ressources installables.

## Avant autorisation de lancement

1. Tester l'inscription complète et la mise à jour de 0.9 vers 1.0 bêta sur un iPhone réel ; thèmes et pays.
2. Tester les parcours BE et FR, le quiz des 12 leçons, la correction d'erreur, le retour à la liste et les révisions après J+1.
3. Tester PWA installée, mode avion, rechargement et restauration de connexion.
4. Vérifier responsive 320/375/430/768/1280 px, zoom 200 %, clavier et lecteurs d'écran.
5. Appliquer le protocole de 24 participants de `docs/USER_STUDY_24.md` : **0 volontaire recruté et 0 test réel terminé à ce jour.**
6. Faire relire les contenus sensibles par des experts BE/FR puis dater et signer les validations.
7. Vérifier disponibilité juridique du nom SAVRÉO et finaliser la politique de confidentialité et les conditions de protection des jeunes.

## Décision

**GO pour la prévisualisation privée et les contrôles accompagnés. NO-GO pour la fusion en production, une diffusion à grande échelle ou la mention « validé par des experts ».**
