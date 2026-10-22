# SAVRÉO — veille des décisions nationales, régionales et locales

## Ce qui existe à ce jour

La « Vigie » actuelle lit à la demande deux flux RSS officiels configurés sur une liste fermée : Belgique fédérale et Service-Public pour la France. L'écran « Vie publique » renvoie aussi vers les institutions régionales et municipales (Wallonie, Mons, Conseil de Paris). Ces **liens** ne constituent pas un flux automatique local.

Les cas d'archives conservés hors connexion sont des exemples pédagogiques **datés**. Ils ne doivent jamais être présentés comme « la dernière actualité ».

## Carte des sources vérifiables

| Territoire | Source | Usage | Statut actuel |
| --- | --- | --- | --- |
| Belgique fédérale | https://news.belgium.be/fr/feeds/all | Titres des communications institutionnelles | RSS intégré ; disponibilité à contrôler à chaque appel |
| Belgique | https://elections.fgov.be | Procédures et résultats électoraux | Liens de référence |
| Wallonie | https://www.wallonie.be/fr/acteurs-et-institutions/wallonie/gouvernement-de-wallonie/communiques-presse | Communiqués wallons | Lien direct, aucun collecteur certifié |
| Mons | https://www.mons.be/fr/ma-commune/vie-politique/conseil-communal/ordres-du-jour-et-proces-verbaux/plateforme-deliberations | Décisions communales et procès-verbaux | Lien direct, aucun collecteur certifié |
| France nationale | https://www.service-public.gouv.fr/abonnements/rss/actu-actualites-particuliers.rss | Actualités de démarches | RSS intégré ; ce n'est pas un journal officiel de toutes les décisions |
| France élections | https://www.elections.interieur.gouv.fr/resultats | Résultats électoraux officiels | Lien direct |
| Paris | https://www.paris.fr/pages/comptes-rendus-et-debats-et-deliberations-du-conseil-224 | Délibérations et comptes rendus | Lien direct, aucun collecteur certifié |

## Avant d'ajouter une autre ville

- Obtenir une **source officielle avec une interface stable et autorisée** : RSS, API ou publication structurée avec politique de réutilisation.
- Établir nom de l'institution, commune/région, URL canonique, date de publication et date de consultation ; rechercher un identifiant public unique pour dédoublonner.
- Transformer les documents en **résumés factuels attribués**, sans inventer d'effet juridique ni d'impact. Un vote doit porter la date et le résultat offici­el s'il est publiquement disponible.
- Distinguer annonce, consultation, débat, vote, publication, entrée en vigueur et bilan ; ne jamais inférer une étape à partir du titre.
- Si un flux échoue, afficher l'erreur et les liens directs. Pas de titres fictifs, pas de contenu LLM se faisant passer pour une publication officielle.
- Vérifier que les sources de partis, de programmes et de condamnations ne sont pas mélangées avec les informations administratives « neutres » sans attribution explicite.
- Ne collecter aucune opinion personnelle ou préférence de vote dans le cadre de la veille.
- Prévoir correctifs publics datés et purge des archives trompeuses.

## Ordre de construction recommandé

1. Valider les deux RSS existants en prévisualisation et auditer leurs URLs d'article.
2. Ajouter les sources territoriales sous forme d'**annuaire hiérarchisé** accessible même hors ligne, puis tester avec 24 jeunes.
3. Pour chaque région/ville, obtenir une source machine vérifiable (API/RSS), écriture de tests sur des exemples réels et limites de fraîcheur.
4. Construire un catalogue documenté des décisions : type, statut, date, autorité, texte, et lien original.
5. Ajouter des résumés uniquement après double vérification éditoriale et validation de neutralité.

## Points à ne pas annoncer

« Toutes les décisions de ton gouvernement », « publications en temps réel », « bilan neutre garanti », « impacts juridiques déjà vérifiés » ou « condamnation définitive » sans preuve datée. Le projet ne dispose pas aujourd'hui d'une collecte automatisée exhaustive des décisions de Mons, de Wallonie ou de Paris.
