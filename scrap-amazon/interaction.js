/**
 * Interaction Code pour Amazon Scraper
 * Ce code gère la navigation et l'interaction avec le site Amazon
 */

// Fonction principale qui sera exécutée
async function main() {
  // Récupérer l'URL d'entrée ou utiliser une URL par défaut pour la recherche
  const searchQuery = input.query || "smartphone";
  const searchUrl = `https://www.amazon.fr/s?k=${encodeURIComponent(searchQuery)}`;
  
  // Naviguer vers la page de recherche
  console.log(`Navigating to: ${searchUrl}`);
  await navigate(searchUrl);
  
  // Attendre que les résultats de recherche soient chargés
  await wait('.s-result-item');
  console.log("Search results loaded");
  
  // Gérer les cookies si un dialogue apparaît
  if (await el_exists('#sp-cc-accept')) {
    console.log("Accepting cookies");
    await click('#sp-cc-accept');
    await wait_hidden('#sp-cc-accept');
  }
  
  // Faire défiler la page pour charger plus de résultats (pagination infinie)
  console.log("Scrolling to load more results");
  for (let i = 0; i < 3; i++) {
    await scroll_to('bottom');
    await wait_page_idle(2000);
  }
  
  // Marquer le HTML pour le parsing
  console.log("Tagging HTML for parsing");
  await tag_html("search_results");
  
  // Récupérer les URLs des produits pour un scraping plus détaillé (optionnel)
  console.log("Extracting product URLs");
  const $ = load_html(html());
  const productLinks = $('.s-result-item[data-asin]:not([data-asin=""])').toArray()
    .slice(0, 5) // Limiter à 5 produits pour l'exemple
    .map(item => {
      const asin = $(item).attr('data-asin');
      const link = $(item).find('a.a-link-normal.s-no-outline').attr('href');
      if (link) {
        return new URL(link, location.href).href;
      }
      return null;
    })
    .filter(url => url !== null);
  
  // Visiter chaque page produit et collecter les données
  for (let i = 0; i < productLinks.length; i++) {
    const url = productLinks[i];
    console.log(`Navigating to product ${i+1}: ${url}`);
    await navigate(url);
    await wait('#productTitle');
    await tag_html(`product_${i+1}`);
  }
}

// Exécuter la fonction principale
(async function() {
  try {
    await main();
  } catch (error) {
    console.error("Error in scraper:", error);
    throw error;
  }
})();
