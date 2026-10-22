# SAVRÉO v1.4 — critères de sortie et contrôle Vercel

## État avant un nouveau déploiement

- Le contenu est commité sur `feature/savreo-brand-v05` et la pull request 2 demeure en **brouillon**.
- 240 unités pédagogiques structurées dans les sources de la bêta, toutes inscrites au registre ; **aucune certification indépendante globale**.
- 17 fiches de sources documentaires de partis, sans classement de candidats et avec plusieurs champs laissés vides.
- Les tests GitHub sont un **contrôle logiciel simulé** et ne remplacent pas un test en navigateur réel.
- Aucune migration de données distante ni dépendance à un service payant n'est prévue pour les contenus hors ligne.

## Contrôles techniques requis en prévisualisation avant fusion

1. Vérifier que Vercel est connecté à `LBNA7G/lucide-citoyen` et que l'environnement visé est **preview**, branche `feature/savreo-brand-v05`.
2. Créer une prévisualisation **une seule fois** lorsque la limite de déploiements de l'équipe le permet ; inspecter SHA exact, statut READY et logs.
3. iPhone Safari : lancer l'onboarding, choisir âge/pays/apparence ; vérifier les 4 onglets ; changer d'âge dans les 176 savoirs ; vérifier qu'un menu de catalogue ne se referme pas accidentellement ; choisir une réponse et consulter sa correction.
4. Tester l'apprentissage : 1 fiche correcte, 1 erronée, réouverture de l'application, révisions programmées sans doublon de points.
5. Activer le mode avion **après chargement complet en ligne** : recharger accueil et 5 parcours au hasard ; tester les fichiers JS/CSS préchargés, les 240 fiches et la progression locale. Les liens institutionnels et la Vigie doivent indiquer qu'internet est requis.
6. Tester un retour de connexion et une mise à jour de cache depuis une version antérieure en conservant la progression (clé locale `lucide-demo-v1` conservée volontairement).
7. Tester zoom texte, focus clavier, lecture VoiceOver/TalkBack, lecteurs de couleur, tap targets, dark/light/auto, vitesse réseau lente.
8. Contrôler les URLs des programmes (2024/2025/2026) et liens administratifs, et leur libellé archive/présent, sans prétendre que la liste de partis est exhaustive.
9. Fermer les problèmes critiques détectés pendant le pilote des 24 jeunes, puis seulement préparer une nouvelle release candidate et envisager une fusion après revue.

## Limites éditoriales bloquantes

Relecture externe des contenus sensibles ; procédures pour signaler et corriger des erreurs ; consentements et confidentialité, y compris mineurs ; vérification locale du régime de protection des données ; clarification du statut légal de la marque SAVRÉO. Ne pas annoncer de partenariats inexistants.

## Action Vercel après résolution du quota

- Inspecter d'abord le plan et les limites réellement appliqués à l'équipe ; changer d'abonnement n'est pas une action à automatiser.
- Vérifier le projet `lucide-citoyen` et le commit exact du brouillon.
- Déployer en **preview**, sans modifier les domaines de production.
- Après contrôles de qualité, demander une décision distincte pour publier la version sur l'URL principale.

Ne pas contourner les limites du fournisseur en ouvrant de nouveaux comptes, nouveaux projets inutiles ou en déclenchant des reconstructions sans contrôle.
