# SAVRÉO v0.9 — Calm UI, principes et critères

**Statut : refonte implémentée, validation sur utilisateurs et audit global d'accessibilité en attente.** Le mode clair ou sombre ne doit pas être présenté comme médicalement meilleur pour tous : les préférences de lecture, l'environnement et l'écran varient.

## Références de conception

- W3C WAI Cognitive Accessibility : https://www.w3.org/WAI/cognitive/
- W3C — Making Content Usable for People with Cognitive and Learning Disabilities : https://www.w3.org/TR/coga-usable/
  - hiérarchie simple, navigation familière, sections identifiables, texte concis et *progressive disclosure*.
- WCAG 2.2 — contraste du texte : https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html (4,5:1 pour le texte normal, 3:1 pour le grand texte).
- WCAG 2.2 — dimensions et espacement des contrôles : https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html (24 × 24 CSS px ou espacement suffisamment grand, sauf exceptions).
- Digital.gov, Plain Language : https://digital.gov/guides/plain-language

Les valeurs d'espacement sont des **hypothèses de conception** soumises aux tests qualitatifs, pas des normes physiologiques spécifiques aux 12–28 ans.

## Modes d'apparence

- **Automatique par défaut** : suit `prefers-color-scheme`, y compris les changements du système.
- **Clair** : fond `#f6f8f5`, cartes `#fff`, texte `#14232a`, accent `#285c43`.
- **Sombre** : fond `#0b0e18`, cartes `#151a28`, texte `#f4f5f8`, accent `#d4fd7b`.
- Sélection persistante sous la clé locale de progression historique. Bouton rapide dans l'en-tête ; choix à 3 options dans le profil.
- Amorçage dans `index.html` avant chargement CSS pour limiter un flash de thème incorrect.
- Contrast ratios calculés sur les tokens principaux via `tests/calm-ui.test.mjs`. **Ce n'est pas un audit WCAG complet**.

## Structure écran par écran

| Écran | Action principale immédiatement disponible | Information dépliable |
|---|---|---|
| Accueil | Déclic du jour | Explorer, révisions seulement si dues |
| Découvrir | Situations, leçons, mots | Actualités institutionnelles, méthodes |
| Pratiquer | Parcours, révisions, argumentation | Missions quotidiennes |
| Mes droits | Recherche de droits, titres de fiches | Détails, cas pratique, sources, limites |
| Profil | Identité et thème ; centres d'intérêt | Historique, XP, confidentialité |
| Leçons | Premier concept, quiz | Exemples, détails, références |
| Situations | Question et choix | Autres scénarios, précautions |
| Dictionnaire | Mot du jour | Autres mots |
| Débat | Objection et texte | Choix de thème, IA/dictée/réinitialisation |
| Vigie | Voir les publications | Étapes d'une loi, liens, favoris, limites |

## Règles de composition

1. **Un objectif au premier regard** : un CTA principal par écran/section ; pas de rubriques statistiques concurrentes en haut.
2. Le texte long reste présent mais dans un panneau fermé avec intitulé explicite.
3. Les `details/summary` natifs préservent la navigation clavier et l'état ouvert/fermé sans script.
4. Sur mobile : une colonne, marges ≥ 14–20 px, écarts entre grands groupes ≥ 30 px.
5. Texte principal 16 px par défaut, interligne autour de 1,65, paragraphes de longueur limitée.
6. Le vert est une couleur d'interaction, pas une décoration omniprésente ; la sélection possède aussi un libellé/état.
7. Espacement tactile souhaité autour de 44 px pour les commandes majeures, avec vérification manuelle des exceptions.
8. Respecter `prefers-reduced-motion`, focus visible et zoom à 200 %.

## Vérifications avant publication (non réalisées)

- Contrôle de cinq largeurs au minimum : iPhone 320/375/430, tablette 768, bureau 1280 px.
- VoiceOver iPhone et TalkBack Android : formulaires, `summary`, onglets et déclenchement de toutes les actions.
- Audit automatisé (axe, Lighthouse) **et** manuel WCAG 2.2 AA : contraste de chaque état (active, disabled, focus), pas seulement les tokens.
- Zoom texte, mode paysage, Safari PWA installée, inversion système clair/sombre, migration ancienne progression.
- Comparaison du temps de repérage de l'action, de l'effort visuel perçu et du taux de réussite des tâches lors du pilote **24 jeunes** prévu. Aucun résultat n'est affirmé avant réalisation.
