# SAVRÉO — Design system 1.0

Statut : **implémenté pour le prototype**, validation UX et conformité WCAG complètes encore à effectuer.

## Principes

1. Une intention par écran : la première action doit être immédiatement identifiable.
2. Des contenus utiles avant les métriques XP, et des indications de progression lisibles.
3. Des blocs cohérents sur mobile et desktop : même grammaire visuelle, mêmes espacements, zones de clic fiables.
4. Le vert citron indique principalement l'action et l'état sélectionné. Pas une décoration omniprésente.
5. Conception inclusive : lisibilité, clavier, mode réduction d'animations, aucun indice transmis uniquement par couleur.

## Tokens CSS (source de vérité : styles.css)

| Type | Token | Valeur |
| --- | --- | --- |
| Fond | `--color-canvas` | #0b0e18 |
| Surface | `--color-surface` | #151a28 |
| Surface surélevée | `--color-surface-raised` | #1b2233 |
| Bordures | `--color-outline` | #354154 |
| Texte | `--color-text` | #f4f5f8 |
| Texte secondaire | `--color-secondary` | #b2bed0 |
| Action principale | `--color-primary` | #d4fd7b |
| Note pédagogique | `--color-highlight` | #b1a1fc |
| Information | `--color-information` | #8ee0d7 |
| Rayons | `--radius-sm/md/lg/xl` | 10/14/20/24 px |
| Échelle d'espacement | `--space-1/2/3/4/5/6/8/10/12` | 4/8/12/16/20/24/32/40/48 px |

Utiliser exclusivement cette échelle pour les nouveaux composants. Limiter les styles inline et les teintes spécifiques à des cas sémantiques justifiés.

## Grammaire de composants

- `.card` : surface générique, accent de bordure neutre, padding normalisé.
- `.learning-card` : parcours, contenant titre, description, progression, étapes.
- `.hub-item` : une navigation de niveau deux, icône, titre, sous-titre et chevron.
- `.review-choice` : rappel différé ; chaque bouton indique la notion et l'action.
- `.notice` : limites des informations, prudence juridique, transparence.
- `.btn.primary` : une action principale à la fois par zone de lecture, hauteur minimale 44 px.
- `.feedback.good/.attn` : confirmation ou correction en mots explicites, pas par la seule couleur.

Les composants interactifs doivent être des `button` ou `a` sémantiques, jamais des `div` cliquables. Les `fieldset` sont conservés dans les préférences.

## Typographie et responsive

Corps de texte 16 px par défaut. Titres mobiles adaptatifs. Largeur lisible pour les longs paragraphes (`--measure:68ch`). Mobile sous 760 px : navigation inférieure à quatre items, cartes de parcours et de révision sur une colonne, marges latérales 18 px, zones tactiles généreuses.

## Définition de terminé (validation restant à effectuer)

- iPhone compact, iPhone large, Android 360 px, tablette 768 px, desktop 1280 px.
- À zoom 200 %, aucun débordement horizontal ni champ masqué.
- Contrastes conformes WCAG 2.2 AA (à auditer avec un outil dédié).
- Parcours complet utilisable au clavier et avec VoiceOver/TalkBack.
- Aucune perte de progression après mise à jour, activation offline testée.
- Faire corriger les retours critiques du pilote 24 jeunes avant fusion en production.
