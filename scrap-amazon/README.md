# Scraper Amazon pour Bright Data

Ce projet contient un scraper pour Amazon utilisant le Web Scraper IDE de Bright Data.

## Structure du projet

- `interaction.js` : Code d'interaction qui gère la navigation et l'interaction avec le site Amazon
- `parser.js` : Code de parsing qui extrait les données des pages HTML collectées

## Fonctionnalités

Le scraper est configuré pour :
- Rechercher des produits sur Amazon.fr
- Accepter automatiquement les cookies
- Faire défiler la page pour charger plus de résultats
- Collecter les données de la page de recherche
- Visiter jusqu'à 5 pages produit individuelles
- Extraire des informations détaillées comme le titre, prix, disponibilité, description, etc.

## Utilisation dans Bright Data Web Scraper IDE

1. Connectez-vous à votre compte Bright Data
2. Accédez au Web Scraper IDE
3. Créez un nouveau scraper
4. Copiez le contenu de `interaction.js` dans l'onglet "Interaction Code"
5. Copiez le contenu de `parser.js` dans l'onglet "Parser Code"
6. Configurez les paramètres d'entrée (input schema) pour inclure un champ `query` de type string
7. Testez le scraper en fournissant une requête de recherche (ex: "smartphone")
8. Lancez le scraper pour collecter les données

## Paramètres d'entrée

Le scraper accepte les paramètres suivants :

- `query` : Terme de recherche à utiliser sur Amazon (par défaut: "smartphone")

## Données de sortie

Le scraper produit un objet JSON contenant :

- `search_results` : Informations sur la page de recherche et liste des produits trouvés
- `product_details` : Informations détaillées sur chaque produit visité
- `scrape_date` : Date et heure du scraping

## Personnalisation

Vous pouvez personnaliser ce scraper en modifiant :

- Le nombre de pages produit à visiter (actuellement limité à 5)
- Le nombre de défilements de page (actuellement 3)
- Les sélecteurs CSS utilisés pour extraire les données
- Le site Amazon ciblé (actuellement amazon.fr)

## Remarques importantes

- Respectez les conditions d'utilisation d'Amazon
- Utilisez des délais raisonnables entre les requêtes pour éviter d'être bloqué
- Les sélecteurs CSS peuvent changer si Amazon modifie son site web
