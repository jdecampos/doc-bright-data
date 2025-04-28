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
  
  // Extraire les informations des produits en utilisant les sélecteurs CSS exacts
  const products = $('.s-result-item[data-asin]:not([data-asin=""])').toArray()
    .slice(0, 10) // Récupérer plus de produits pour avoir une marge
    .map(item => {
      const $item = $(item);
      const asin = $item.attr('data-asin');
      
      // Extraire les informations du produit pour le logging
      const title = $item.find('h2 .a-link-normal').text().trim() || 
                   $item.find('h2.a-size-base-plus').text().trim() || 
                   $item.find('.a-size-base-plus').text().trim();
      const price = $item.find('.a-price .a-offscreen').first().text().trim();
      
      console.log(`Found product: ${title.substring(0, 50)}... (${asin}) - ${price}`);
      
      // Créer un lien direct vers le produit en utilisant l'ASIN
      if (asin) {
        return `https://www.amazon.fr/dp/${asin}`;
      }
      return null;
    })
    .filter(url => url !== null)
    .slice(0, 5); // Limiter à 5 produits pour l'exemple
    
  const productLinks = products;
  
  // Visiter chaque page produit et collecter les données
  for (let i = 0; i < productLinks.length; i++) {
    try {
      const url = productLinks[i];
      console.log(`Navigating to product ${i+1}: ${url}`);
      await navigate(url);
      
      // Vérifier si nous sommes sur une page produit valide
      // Attendre avec un délai plus court et plusieurs sélecteurs alternatifs
      const isProductPage = await Promise.race([
        wait('#productTitle', { timeout: 10000 }).then(() => true).catch(() => false),
        wait('.product-title-word-break', { timeout: 10000 }).then(() => true).catch(() => false),
        wait('.a-size-large.product-title-word-break', { timeout: 10000 }).then(() => true).catch(() => false),
        wait('.product-information', { timeout: 10000 }).then(() => true).catch(() => false)
      ]);
      
      if (!isProductPage) {
        console.log(`Product page ${i+1} not recognized, skipping...`);
        continue; // Passer au produit suivant
      }
      
      // Attendre que la page soit complètement chargée
      await wait_page_idle(2000);
      
      // Taguer le HTML pour le parsing
      await tag_html(`product_${i+1}`);
      console.log(`Successfully tagged product ${i+1}`);
    } catch (error) {
      console.error(`Error processing product ${i+1}:`, error);
      // Continuer avec le produit suivant au lieu d'arrêter complètement
      continue;
    }
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
