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
      
      // Utiliser plusieurs sélecteurs alternatifs pour s'assurer d'extraire les données
      const title = $item.find('h2 .a-link-normal').text().trim() || 
                   $item.find('h2.a-size-base-plus').text().trim() || 
                   $item.find('.a-size-base-plus').text().trim();
      
      const price = $item.find('.a-price .a-offscreen').first().text().trim();
      
      const ratingText = $item.find('.a-icon-star-small .a-icon-alt').text().trim() ||
                        $item.find('.a-icon-star .a-icon-alt').text().trim() ||
                        $item.find('.a-star-mini .a-icon-alt').text().trim();
      
      const rating = ratingText ? parseFloat(ratingText.split(' ')[0].replace(',', '.')) : null;
      
      const reviewsCount = $item.find('.a-size-base.s-underline-text').text().trim() ||
                          $item.find('.s-underline-text').text().trim();
      
      // Extraire l'URL de l'image avec gestion des srcset
      const imgElement = $item.find('img.s-image');
      const image = imgElement.attr('src') || imgElement.attr('data-src');
      
      // Construire l'URL directe du produit à partir de l'ASIN
      const url = `https://www.amazon.fr/dp/${asin}`;
      
      // Extraire des informations supplémentaires si disponibles
      const badge = $item.find('.a-badge-text').text().trim();
      const category = $item.find('.a-color-base.s-background-color-platinum').text().trim();
      const delivery = $item.find('.a-color-base.puis-normal-weight-text').text().trim();
      
      return {
        asin,
        title,
        price,
        rating,
        reviews_count: reviewsCount,
        image,
        url,
        badge: badge || null,
        category: category || null,
        delivery: delivery || null,
        prime: $item.find('.a-icon-prime').length > 0
      };
    })
  };
}

// Fonction pour extraire les données détaillées d'un produit
function parseProductPage(html, url) {
  const $ = html_load(html);
  
  // Extraire le titre exact depuis l'élément productTitle
  const title = $('#productTitle').text().trim();
  
  // Extraire le prix en utilisant les sélecteurs exacts du code HTML fourni
  let price = '';
  try {
    // Essayer d'abord le sélecteur principal pour le prix
    const priceWhole = $('.a-price-whole').first().text().trim();
    const priceFraction = $('.a-price-fraction').first().text().trim();
    const priceSymbol = $('.a-price-symbol').first().text().trim();
    
    if (priceWhole && priceFraction) {
      price = `${priceWhole}${priceFraction}${priceSymbol}`;
    } else {
      // Essayer des sélecteurs alternatifs
      price = $('.a-price .a-offscreen').first().text().trim() ||
              $('#corePriceDisplay_desktop_feature_div .a-offscreen').first().text().trim() ||
              $('.a-color-price').first().text().trim();
    }
  } catch (e) {
    console.log('Erreur lors de l\'extraction du prix:', e.message);
  }
  
  // Extraire la marque depuis l'élément bylineInfo
  const brandElement = $('#bylineInfo');
  const brand = brandElement.text().trim().replace('Visiter la boutique ', '');
  
  // Extraire la note et le nombre d'avis en utilisant les sélecteurs exacts
  let rating = null;
  let reviewsCount = null;
  
  try {
    // Extraire la note depuis acrPopover
    const ratingText = $('#acrPopover').attr('title') || 
                      $('.a-icon-star .a-icon-alt').first().text().trim() ||
                      $('.a-star-mini .a-icon-alt').text().trim();
    
    if (ratingText) {
      const ratingMatch = ratingText.match(/(\d+[.,]\d+)/);
      if (ratingMatch) {
        rating = parseFloat(ratingMatch[1].replace(',', '.'));
      }
    }
    
    // Extraire le nombre d'avis depuis acrCustomerReviewText
    const reviewsText = $('#acrCustomerReviewText').text().trim();
    if (reviewsText) {
      const reviewsMatch = reviewsText.match(/(\d+[\s\d]*\d*)/); 
      if (reviewsMatch) {
        reviewsCount = reviewsMatch[1].replace(/\s+/g, '');
      }
    }
  } catch (e) {
    console.log('Erreur lors de l\'extraction des avis:', e.message);
  }
  
  // Extraire le badge "Choix d'Amazon" s'il existe
  const amazonChoice = $('.ac-badge-wrapper').length > 0 ? 
                      $('.ac-badge-wrapper .ac-for-text').text().trim() : null;
  
  // Extraire les informations de vente ("Plus de X achetés")
  const salesInfo = $('.social-proofing-faceout-title-text').text().trim() || null;
  
  // Extraire la disponibilité
  const availability = $('#availability').text().trim() ||
                      $('.a-color-success').text().trim();
  
  // Extraire la description et les caractéristiques
  const description = $('#productDescription p').text().trim();
  
  const features = $('#feature-bullets .a-list-item').map(function() {
    return $(this).text().trim();
  }).get();
  
  // Extraire les images
  let images = [];
  try {
    // Essayer d'extraire les images depuis data-a-dynamic-image
    const dynamicImageAttr = $('#imgTagWrapperId img').attr('data-a-dynamic-image');
    if (dynamicImageAttr) {
      images = Object.keys(JSON.parse(dynamicImageAttr));
    } else {
      // Essayer d'autres sélecteurs pour les images
      const mainImage = $('#landingImage').attr('src') || 
                       $('.a-dynamic-image').attr('src');
      if (mainImage) images.push(mainImage);
    }
  } catch (e) {
    console.log('Erreur lors de l\'extraction des images:', e.message);
  }
  
  // Extraire les promotions
  const promotions = [];
  $('.promoPriceBlockMessage').each(function() {
    const promoText = $(this).text().trim();
    if (promoText) promotions.push(promoText);
  });
  
  // Extraire les informations de livraison
  const deliveryInfo = $('#mir-layout-DELIVERY_BLOCK').text().trim() || 
                      $('#deliveryBlockMessage').text().trim() || 
                      $('.a-color-base.puis-normal-weight-text').text().trim();
  
  // Extraire l'ASIN depuis l'URL
  let asin = '';
  try {
    if (url.includes('/dp/')) {
      asin = url.split('/dp/')[1].split('/')[0];
    } else if (url.includes('/gp/product/')) {
      asin = url.split('/gp/product/')[1].split('/')[0];
    } else {
      asin = url.split('/').pop();
    }
    // Nettoyer l'ASIN des paramètres d'URL
    asin = asin.split('?')[0];
  } catch (e) {
    console.log('Erreur lors de l\'extraction de l\'ASIN:', e.message);
  }
  
  // Extraire les informations de TVA
  const vatInfo = $('#vatMessage_feature_div').text().trim() || null;
  
  return {
    url,
    title,
    price,
    brand,
    rating,
    reviews_count: reviewsCount,
    amazon_choice: amazonChoice,
    sales_info: salesInfo,
    availability,
    description,
    features,
    images,
    promotions: promotions.length > 0 ? promotions : null,
    delivery_info: deliveryInfo || null,
    vat_info: vatInfo,
    asin
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
