# SAVRÉO — passer du quiz devinable au raisonnement véritable

**Audit du 22 octobre 2026** — 215 questions interactives dans les packs modulaires.

## Observation

- **206/215** questions ont la bonne réponse au moins aussi longue que les mauvaises : un indice de forme peut permettre de deviner sans comprendre.
- **34/215** utilisent au moins un distracteur contenant un indice parfois peu plausible (« couleur », « logo », « likes », etc.). Cette mesure est une heuristique de repérage, pas une analyse sémantique complète.
- Les positions A/B/C des 176 micro-fiches sont **correctement équilibrées** (59 / 59 / 58), mais cela ne compense pas l'indice de longueur.
- Le taux actuel de réussite aux quiz **n'est donc pas interprétable seul comme une mesure d'apprentissage**, même si la logique d'attribution XP fonctionne.

Les tests automatisés vérifient le biais avec `tests/quiz-quality.test.mjs`. Les changements exigent une relecture humaine : ne pas corriger une question politique ou juridique en déplaçant simplement une mauvaise réponse au hasard.

## Premier lot effectivement réécrit (22 octobre 2026)

Douze fiches civiques ont maintenant été réécrites dans `civic-pack-01.js` : `promesse-loi`, `budget-deficit`, `aides`, `programmes`, `sondage-resultat`, `accusation-decision`, `autorites-locales`, `be-16-europe`, `be-participation`, `be-resultats`, `fr-voter-18` et `fr-comptes-partis`.

- **Avant, sur ce lot : 8/12 bonnes réponses étaient les plus longues ou ex aequo.**
- **Après : 3/12**, avec quatre bonnes réponses en A, quatre en B et quatre en C. C'est un contrôle de forme, pas une démonstration que la connaissance a progressé.
- Sur les 215 QCM modulaires : **197/215** présentent encore cet indice de longueur, contre 206/215 auparavant.
- Les fiches modifiées disposent de nouveaux contextes et d'une explication distinguant les étapes institutionnelles. Plusieurs références ont été affinées et le registre des sources synchronisé.
- **Aucune relecture humaine externe n'a encore été enregistrée.** Les 12 fiches restent `pending_external_review` et doivent être testées avec des jeunes avant toute revendication d'efficacité.
- Nouveau garde-fou dans `tests/civic-pilot-quality.test.mjs` : distribution A/B/C, plausibilité minimale des options, explication, contexte, proportion de réponses les plus longues et correspondance des URL.
- Dans l'application, une première réponse juste n'est plus présentée comme une maîtrise durable.

## Règles de conception de la prochaine révision

1. **Une compétence identifiable** : la question demande d'appliquer une notion dans un cas précis (ex. distinguer projet, adoption et entrée en vigueur), non de reconnaître une formule de bon sens.
2. **Trois réponses plausibles au même niveau de détail** : un distracteur représente une erreur réelle, pas une réponse caricaturale (« lire le logo »).
3. **Un contexte suffisant** : territoire, date, public et autres informations utiles sont donnés lorsqu'ils modifient la réponse.
4. **Corrigé explicatif** : expliquer pourquoi la bonne réponse est justifiée **et** pourquoi l'alternative séduisante était inadaptée.
5. **Pas d'indice formel systématique** : longueur comparable, expressions symétriques, A/B/C équilibrées ; pas d'absolus (« toujours », « jamais ») réservés aux fausses réponses.
6. **Apprentissage avant gamification** : la réponse à la première lecture n'établit pas la mémorisation. Utiliser une question reformulée à J+3 et J+7 dans les tests pilotes.
7. **Neutralité** : les exercices d'élections évaluent la lecture de documents et les faits institutionnels, jamais l'adhésion à un parti, à une politique ou à une idéologie.
8. **Libre exploration** : accéder à d'autres âges n'a pas d'incidence sur des préférences politiques ni sur une catégorisation sensible.

## Exemple d'amélioration d'un distracteur

**Avant :** « Une annonce du gouvernement prouve-t-elle que la règle est en vigueur ? »  
A. Oui, si l'information devient virale  
B. Il faut retrouver le texte adopté et sa date d'application  
C. Oui, si la publicité est convaincante

**Après (illustration à relire, pas une fiche juridiquement validée) :**  
A. Oui, si un communiqué officiel annonce l'adoption de la mesure  
B. Il faut vérifier le texte officiellement publié et son entrée en vigueur  
C. Oui, si la majorité parlementaire a présenté un accord sur la mesure

Le contexte d'un texte précis et des exceptions reste à ajouter selon le pays. Les trois options correspondent désormais à des confusions réalistes.

## Séquencement de la refonte éditoriale

- **Lot pilote 1 :** 12 questions sur les élections, les aides, les décisions publiques et la sécurité ; documenter pour chacune la compétence et les deux erreurs typiques.
- **Lot pilote 2 :** 24 questions du quotidien et de l'analyse de médias, vérifiées par un enseignant et 8 jeunes volontaires de plusieurs tranches d'âge.
- **Lot 3 :** toutes les autres questions après observation du pilote ; ne pas attribuer le label « relecture approuvée » sur la seule base d'un test automatique.
- **Test de rétention** : suivre la capacité à expliquer une réponse dans une nouvelle situation, plutôt que le seul nombre de clics corrects.

### Critères qualité proposés (hypothèses internes)

Sur un lot de 12 questions revues, viser au plus 55 % de réponses correctes qui soient la plus longue option ou ex aequo, puis améliorer au fil des retours. Ce seuil n'est **ni une norme d'accessibilité ni une preuve scientifique** ; c'est un garde-fou contre un biais évident de forme. Le test applique ce critère uniquement lorsque suffisamment de fiches sont explicitement marquées `reviewed` avec preuve de relecture.

**État réel : aucune des 240 fiches n'a encore de relecture indépendante enregistrée.**
