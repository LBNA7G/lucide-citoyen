# SAVRÉO — méthode de vérification éditoriale des fiches

## Traçabilité des contenus

Le fichier `content/editorial-registry.json` conserve une entrée stable par unité pédagogique. Les fiches sont, par défaut, en statut `pending_external_review`. Une URL institutionnelle constitue une piste de documentation, **pas** une preuve que la question/explication a été validée par l'institution.

Statuts permis : `draft`, `pending_external_review`, `reviewed`, `needs_correction`, `archived`. Ne passer à `reviewed` qu'avec date, responsable habilité, périmètre, source primaire pertinente et preuve conservée d'une lecture indépendante. Ne jamais modifier en masse un statut pour accélérer une sortie.

## Deux niveaux de contrôle

1. **Automatique** : unicité des ID, structure des quiz, nombre de réponses, index de correction, présence d'explication et d'URL sûre, langue, champs de registre, cardinalité BE/FR et âge, proportion des bonnes réponses par position, absence d'accès accidentel à des domaines arbitraires.
2. **Humain** : exactitude factuelle de la question et des distracteurs, langage adapté 12–15/16–20/21–28, ambiguïtés, variation régionale, vérification des URL de pages exactes, questions sensibles, neutralité et biais de cadrage.

## Catégories à plus haut risque

Droit électoral, aides sociales, fiscalité, santé, justice pénale, identité de dirigeants et faits judiciaires. Vérifier **région + pays + texte + date d'application**. Mentionner explicitement si une source correspond à un texte en projet, une promesse ou une archive.

Pour une affaire judiciaire impliquant une personne nommée : contrôle par un juriste de l'identité, du stade et des décisions de justice publiques, du caractère définitif ou non, des recours, de la proportionnalité et des rectifications. Ne pas présenter une mise en cause comme une condamnation.

## Neutralité éditoriale des partis

Pour chaque parti, conserver la provenance et l'année du programme : texte **publié par le parti**, pas une conclusion indépendante. Présenter tous les partis avec ordre alphabétique ou ordre institutionnel non évaluatif, jamais par préférence déduite du prénom, de l'âge ou du genre. Éviter résumés contestables ou réductions en scores sans contre-expertise.

L'annuaire belge v1.2 se limite aux 12 partis listés dans le chiffrage du BFP 2024, **une archive documentée**, pas une liste de tous les partis actuels. L'échantillon français v1.2 a cinq entrées **non exhaustives** ; des documents et dates restent à valider.

## Cycle de corrections

Créer une entrée `review_issue` avec ID, date, auteur du signalement, source(s), sévérité et changement demandé. Ne pas publier les données personnelles du signalant. Toute correction d'une information électorale ou juridique doit être datée, visible et historiquement retraçable. Établir un rythme de relecture avant chaque élection / changement de législation ; ne pas afficher « mis à jour aujourd'hui » sans preuve de consultation.

## Préparation à la publication

- [ ] Chaque unité a été relue par une personne compétente.
- [ ] Les cas fictifs sont signalés comme simulations et les cas réels citent une source précise.
- [ ] Les informations actualisées hors ligne portent une date et un avertissement sur leur péremption.
- [ ] Le contenu pour mineurs a été évalué pour son âge, sa confidentialité et ses risques.
- [ ] Contraste, lecture sur petits écrans, lecteur d'écran, navigation clavier et mode hors ligne testés.
- [ ] Résultats du pilote réel auprès de 24 jeunes rapportés sans extrapolation excessive.
- [ ] Procédure de correction et politique de confidentialité publiées.
