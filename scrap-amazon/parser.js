/**
 * Parser Code pour Amazon Scraper
 * Ce code extrait les données des pages HTML collectées pendant l'interaction
 */

// Récupérer les données taguées pendant l'interaction
const { search_results, search_results_url, ...productPages } = parser;

// Fonction pour extraire les données des résultats de recherche
function parseSearchResults() {
  const $ = html_load(search_results);
  
  return {
    search_url: search_results_url,
    total_results: $('.s-result-count').text().trim(),
    products: $('.s-result-item[data-asin]:not([data-asin=""])').toArray().map(item => {
      const $item = $(item);
      const asin = $item.attr('data-asin');
      
      return {
        asin: asin,
        title: $item.find('h2 .a-link-normal').text().trim(),
        price: $item.find('.a-price .a-offscreen').first().text().trim(),
        rating: $item.find('.a-icon-star-small .a-icon-alt').text().trim(),
        reviews_count: $item.find('.a-size-base.s-underline-text').text().trim(),
        image: $item.find('img.s-image').attr('src'),
        url: new URL($item.find('h2 .a-link-normal').attr('href'), search_results_url).href
      };
    })
  };
}

// Fonction pour extraire les données détaillées d'un produit
function parseProductPage(html, url) {
  const $ = html_load(html);
  
  return {
    url: url,
    title: $('#productTitle').text().trim(),
    price: $('#corePriceDisplay_desktop_feature_div .a-offscreen').first().text().trim() || 
           $('.a-price .a-offscreen').first().text().trim(),
    availability: $('#availability').text().trim(),
    description: $('#productDescription p').text().trim() || $('#feature-bullets .a-list-item').map(function() {
      return $(this).text().trim();
    }).get().join('\n'),
    brand: $('.a-section.a-spacing-none #bylineInfo').text().trim(),
    images: $('#imgTagWrapperId img').attr('data-a-dynamic-image') ? 
            Object.keys(JSON.parse($('#imgTagWrapperId img').attr('data-a-dynamic-image'))) : [],
    features: $('#feature-bullets .a-list-item').map(function() {
      return $(this).text().trim();
    }).get(),
    rating: $('.a-icon-star .a-icon-alt').first().text().trim(),
    reviews_count: $('#acrCustomerReviewText').first().text().trim()
  };
}

// Traiter les résultats de recherche
const searchData = parseSearchResults();

// Traiter les pages de produits individuelles
const productDetails = [];
Object.keys(productPages).forEach(key => {
  if (key.startsWith('product_') && key.endsWith('_url')) {
    const htmlKey = key.replace('_url', '');
    const html = productPages[htmlKey];
    const url = productPages[key];
    if (html && url) {
      productDetails.push(parseProductPage(html, url));
    }
  }
});

// Retourner les données combinées
return {
  search_results: searchData,
  product_details: productDetails,
  scrape_date: new Date().toISOString()
};
