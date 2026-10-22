# SAVRÉO — méthode d'affichage des preuves et décisions publiques (v1.5 bêta)

Date de travail : 22 octobre 2026. **Ce document explique les conventions du prototype, pas une certification des faits ni un audit juridique.**

## Première lecture sur mobile : afficher l'essentiel

- Le titre et une explication courte.
- Une seule action principale par écran.
- Sous le texte : une note discrète « édition du … · relecture indépendante en attente ».
- Un panneau dépliable « Lire les sources et leur fiabilité » accessible **avant** la réponse, y compris hors connexion.
- Dans le panneau : pays concerné, date d'édition, statut indépendant de relecture, qualité indicative du lien (site général vs document ciblé), lien externe et note de prudence.
- Le lien vers une source **n'atteste pas** que la question a été vérifiée par l'institution. Les URL exactes et les exceptions restent à vérifier par un professionnel.

Dans « Savoirs essentiels », le panneau « Sources et approfondissement » suit la même règle : il est présent avant de répondre, et les scénarios créés sont explicitement présentés comme pédagogiques, **pas comme des témoignages réels**.

## Vie publique : cinq distinctions obligatoires

| Nature de l'information | Formulation adaptée | À ne pas écrire sans preuve |
| --- | --- | --- |
| Programme politique | « Le parti propose… » avec scrutin, année et texte original | « Le parti a mis en place… » |
| Communiqué gouvernemental | « Le gouvernement annonce… », date de la communication | « La nouvelle loi est entrée en vigueur » |
| Projet soumis au vote | « Le texte est en discussion… » | « Les conditions sont définitivement décidées » |
| Texte adopté et publié | « Le texte a été publié… » avec source normative et date d'effet à vérifier | « Toute personne a droit à… » sans conditions |
| Décision judiciaire | « Selon la décision [juridiction, date]… », stade et voies de recours | « Condamnation définitive » lorsque des recours demeurent possibles |

Une *archive* (ex. communication wallonne du 12/10/2026 ou délibérations de Paris 10/2026) conserve sa date ; elle ne doit **jamais** être rebaptisée « dernières nouvelles » hors connexion.

## Naviguer par territoire

« Vie publique » distingue désormais **national/fédéral**, **régional** et **ville/commune**, lorsque des sources sont disponibles pour le pays choisi. Les boutons sont accessibles au clavier, avec état actif via `aria-pressed`. Un changement de filtre laisse le panneau de sources ouvert pour ne pas créer un effet de disparition.

Les exemples documentaires comprennent des sources du fédéral belge, de Wallonie, de la Ville de Mons, des procès-verbaux publics de Brugelette et du Conseil de Paris. **Ce sont des portes vers les institutions, pas un service de surveillance exhaustif ou en temps réel.** Pour la France, aucun exemple régional n'est actuellement présent dans la base locale ; ce filtre n'est pas montré tant qu'il n'y a pas de source attribuée.

## Vie privée et neutralité

- Aucun besoin de connaître l'opinion politique, le genre, la religion ou l'origine d'un lecteur.
- Le choix du pays influence seulement la juridiction affichée ; les préférences d'âge concernent uniquement les **contenus éducatifs non partisans**.
- Aucun score de parti, classement, recommandation de vote ou association entre comportement et orientation électorale.
- Si les interfaces affichent des programmes des partis, la source du parti doit être attribuée explicitement : un programme est un document politique, **pas une expertise indépendante**.
- Les mineurs peuvent consulter les concepts civiques sans profil d'opinion ; les mesures de rétention du pilote doivent éviter les données sensibles.

## Contrôles automatiques supplémentaires

- `tests/civic-evidence.test.mjs` vérifie les 24 fiches, deux archives, les statuts de relecture et les niveaux territoriaux.
- `tests/calm-ui-runtime.test.mjs` vérifie l'affichage de la provenance avant réponse, le cas électoral belge ancien, les filtres locaux et la réinitialisation au changement de pays.
- Le service worker v1.5 doit fournir les scripts de contenu après un premier chargement réussi. Les **liens externes** vers les sources ne sont pas mis en cache par ces scripts.

## Limites connues et prochaines étapes

1. Ces libellés proviennent de métadonnées éditoriales codées dans le fichier : une date d'édition **n'est pas** une date de vérification. Les URL précises doivent être vérifiées en ligne.
2. Le diagnostic automatique « URL générique » identifie la structure d'une URL, pas la fiabilité de son contenu.
3. La couverture territoriale n'est pas exhaustive ; les pages municipales ne sont pas agrégées automatiquement.
4. Les 240 fiches sont en attente de validation indépendante ; les tests auprès de 24 jeunes, l'audit WCAG et la vérification PWA mobile hors ligne restent non réalisés.
5. Avant publication, faire relire les règles de vote par pays et scrutin, surtout lorsque les textes électoraux changent d'une année à l'autre.

**Règle éditoriale principale : préférer « nous n'avons pas encore vérifié » à toute apparence de certitude injustifiée.**
