# SAVRÉO — charte de fiabilité et validation éditoriale

**Situation actuelle** : registre de 25 contenus, statut `pending_external_review`. **Aucun visa de juriste ou d'enseignant indépendant n'est acquis.** Le statut n'est pas une certification.

## Chaîne de publication

1. **Auteur** : crée une fiche avec ID unique, pays (BE/FR/ALL), type (simulation, fait, exercice, droit), objectif pédagogique, scénario, réponse expliquée, sources cliquables.
2. **Éditeur** : contrôle la clarté 12–15/16–20/21–28, le langage neutre et non-partisan, les options de quiz et le risque d'ambiguïté.
3. **Vérificateur externe approprié** : juriste BE/FR pour un droit ou salaire, spécialiste pédagogique pour une leçon, expert des médias pour un cas de désinformation. Exiger nom/organisation, domaine d'expertise, date, version et réserves.
4. **Mise à jour** : renseigner `reviewed_at`, `next_review_at`, `reviewer`, preuve/lien d'approbation dans le registre ; passer à `approved` seulement après validation documentée.
5. **Maintenance** : suivre les changements de règles et dates d'entrée en vigueur ; revoir au moins tous les 90 jours les sujets juridiques actifs et immédiatement après changement connu. Toute information non vérifiée retourne à `needs_update`.

## Points de contrôle obligatoires

- Quel texte exact ? Quel pays/région/communauté et quel âge ? Quelle date d'application ?
- Une annonce est-elle distinguée du droit en vigueur ?
- Le cas est-il fictif, inspiré d'une situation fréquente ou documenté ? La source soutient-elle bien la conclusion ?
- La bonne réponse contient-elle les nuances sans conduire à une action dangereuse ?
- Le lien officiel fonctionne-t-il et son éditeur est-il identifiable ?
- Les apprentissages de droit ne personnalisent pas un conseil juridique individuel.
- Une page non validée doit afficher ses limites et ne pas porter de label « certifié ».

## Structure du registre

Fichier : `content/editorial-registry.json` ; ID, type, pays, thème, classification, URLs, statut, rôle attendu, vérification, révision prévue et notes.

Le contrôle automatique bloque l'apparition d'un statut `approved` sans source, identité du réviseur et traces datées. **Il ne prouve pas la justesse du fond** et ne remplace pas la validation.

## Échantillon initial prioritaire à faire relire

1. `case:be-heures` : travail étudiant et dépassement du contingent d'heures, référence Student@work.
2. `case:be-manif` / `case:fr-manif` : liberté de réunion et limites locales.
3. `case:fr-salaire` : versement des salaires et recours.
4. Toutes les fiches `right:BE:*`, `right:FR:*` : base légale, territoire, nuance, actualité.

## Neutralité

Ne jamais noter un parti ou une idéologie comme « bonne opinion ». Les quiz évaluent une compétence factuelle ou argumentative, pas une préférence politique. Les sujets controversés sont présentés avec faits, limites et points de vue contradictoires justifiés.

## Signalement

À prévoir avant publication commerciale : lien « Signaler une erreur », circuit de correction et journal des versions. Pendant la prévisualisation, utiliser la PR GitHub pour les retours, sans déposer des données personnelles de testeurs.
