# Complete Web Scraper IDE Examples

Explore comprehensive examples of web scraping using the Web Scraper IDE, including code for interaction, parsing, handling multiple results, and advanced techniques.

## Introduction

The collect and parse commands have been removed. The data will be returned from parser code as an object or array, and it will be automatically saved to the output.

## Basic Example: Product Details

This example shows how to scrape a single product page for basic details.

### Interaction Code

```javascript
// Navigate to the product page
navigate(input.url);

// Wait for the product details to load
wait('.product-details');
```

### Parser Code

```javascript
// Extract product information
return {
  title: $('.product-title').text().trim(),
  price: $('.product-price').text().trim(),
  description: $('.product-description').text().trim(),
  rating: $('.product-rating').text().trim(),
  inStock: $('#stock-status').text().includes('In Stock')
};
```

## Multi-Page Example: Search Results

This example demonstrates how to scrape multiple pages of search results.

### Interaction Code

```javascript
// Navigate to the search results page
let searchUrl = new URL(input.url);
if (input.page && input.page > 1) {
  searchUrl.searchParams.set('page', input.page);
}
navigate(searchUrl);

// Wait for results to load
wait('.search-results');

// If this is the first page, get total pages and trigger scraping for other pages
if (!input.page || input.page === 1) {
  let totalPages = parseInt($('.pagination .total-pages').text()) || 1;
  // Limit to a reasonable number of pages
  totalPages = Math.min(totalPages, 10);
  
  // Trigger scraping for other pages
  for (let page = 2; page <= totalPages; page++) {
    rerun_stage({url: input.url, page: page});
  }
}
```

### Parser Code

```javascript
// Extract all product listings from the search results
return $('.product-item').map(function() {
  return {
    title: $(this).find('.item-title').text().trim(),
    price: $(this).find('.item-price').text().trim(),
    url: new URL($(this).find('a').attr('href'), location.href).href,
    image: $(this).find('img').attr('src'),
    page: input.page || 1
  };
}).get();
```

## Advanced Example: E-commerce Category Scraper

This multi-stage example shows how to scrape product categories and then individual products.

### Stage 1: Category Page (Interaction)

```javascript
// Navigate to the category page
navigate(input.category_url);

// Wait for the product listings to load
wait('.product-grid');

// Close any popup that might appear
close_popup('.popup', '.popup-close');
```

### Stage 1: Category Page (Parser)

```javascript
// Get all product URLs from the category page
let productUrls = $('.product-item a.product-link').map(function() {
  return new URL($(this).attr('href'), location.href).href;
}).get();

// Return the product URLs for the next stage
return {
  productUrls: productUrls,
  categoryName: $('.category-title').text().trim()
};
```

### Stage 2: Product Details (Interaction)

```javascript
// Navigate to each product page
navigate(input.productUrl);

// Wait for product details to load
wait('.product-details');

// Tag any API responses that contain product data
tag_response('product_api_data', /\/api\/products\/\d+/);

// Capture product images
tag_image('main_image', '.product-main-image img');
```

### Stage 2: Product Details (Parser)

```javascript
// Extract detailed product information
let specs = {};
$('.product-specs tr').each(function() {
  let key = $(this).find('th').text().trim();
  let value = $(this).find('td').text().trim();
  if (key && value) {
    specs[key] = value;
  }
});

// Use API data if available
let apiData = parser.product_api_data || {};

return {
  title: $('.product-title').text().trim(),
  price: new Money(
    parseFloat($('.product-price').text().replace(/[^\d.]/g, '')),
    $('.currency-symbol').text().trim() || 'USD'
  ),
  description: $('.product-description').text().trim(),
  specs: specs,
  mainImage: parser.main_image,
  inStock: $('#stock-status').text().includes('In Stock'),
  categoryName: input.categoryName,
  apiData: apiData
};
```

## Real-World Example: News Article Scraper

This example shows how to scrape news articles including handling pagination and extracting article content.

### Stage 1: News Listing (Interaction)

```javascript
// Navigate to the news page
let newsUrl = new URL(input.url);
if (input.page) {
  newsUrl.searchParams.set('page', input.page);
}
navigate(newsUrl);

// Wait for the news listings to load
wait('.news-list');

// If this is the first page, get total pages and trigger scraping for other pages
if (!input.page) {
  let totalPages = parseInt($('.pagination .last').text()) || 1;
  // Limit to a reasonable number of pages
  totalPages = Math.min(totalPages, 5);
  
  // Trigger scraping for other pages
  for (let page = 2; page <= totalPages; page++) {
    rerun_stage({url: input.url, page: page});
  }
}
```

### Stage 1: News Listing (Parser)

```javascript
// Extract all article links and basic info
let articles = $('.news-item').map(function() {
  return {
    title: $(this).find('.news-title').text().trim(),
    summary: $(this).find('.news-summary').text().trim(),
    date: $(this).find('.news-date').text().trim(),
    url: new URL($(this).find('a').attr('href'), location.href).href,
    image: $(this).find('img').attr('src')
  };
}).get();

// Pass articles to the next stage
articles.forEach(article => {
  next_stage({
    article_url: article.url,
    article_title: article.title,
    article_summary: article.summary,
    article_date: article.date,
    article_image: article.image
  });
});

// Return the articles for this page
return articles;
```

### Stage 2: Article Content (Interaction)

```javascript
// Navigate to the article page
navigate(input.article_url);

// Wait for the article content to load
wait('.article-content');
```

### Stage 2: Article Content (Parser)

```javascript
// Extract the full article content
let paragraphs = $('.article-content p').map(function() {
  return $(this).text().trim();
}).get();

// Extract any tags/categories
let tags = $('.article-tags .tag').map(function() {
  return $(this).text().trim();
}).get();

// Combine with the basic info from the previous stage
return {
  title: input.article_title,
  summary: input.article_summary,
  date: input.article_date,
  image: input.article_image,
  content: paragraphs.join('\n\n'),
  tags: tags,
  author: $('.article-author').text().trim(),
  url: input.article_url
};
```

## Advanced Techniques: Working with APIs

This example shows how to capture and use API responses in your scraper.

### Interaction Code

```javascript
// Tag API responses before navigation
tag_response('product_data', /\/api\/products\/\d+/);
tag_response('reviews_data', /\/api\/reviews/);

// Navigate to the product page
navigate(input.url);

// Wait for data to be loaded
wait_for_parser_value('product_data');
wait_for_parser_value('reviews_data');

// You can also use the API data directly in the interaction code
let productData = parse().product_data;
if (productData && productData.related_products) {
  // Navigate to related products
  for (let relatedUrl of productData.related_products) {
    next_stage({url: relatedUrl, is_related: true});
  }
}
```

### Parser Code

```javascript
// Extract data from API responses
let product = parser.product_data || {};
let reviews = parser.reviews_data || {items: []};

// Combine with data from the page
return {
  title: product.title || $('.product-title').text().trim(),
  price: product.price || $('.product-price').text().trim(),
  description: product.description || $('.product-description').text().trim(),
  rating: product.rating || $('.product-rating').text().trim(),
  reviews: reviews.items.map(review => ({
    author: review.author,
    rating: review.rating,
    text: review.text,
    date: review.date
  })),
  isRelated: input.is_related || false
};
```

## Handling Dynamic Content with Browser Worker

This example demonstrates how to handle JavaScript-heavy websites that load content dynamically.

### Interaction Code

```javascript
// Use a Browser Worker for this scraper
navigate(input.url);

// Wait for initial content to load
wait('.content-container');

// Click to load more content
if (el_exists('.load-more-button')) {
  click('.load-more-button');
  
  // Wait for new content to load
  wait_network_idle();
}

// Scroll to load lazy-loaded images
scroll_to_all('.product-item');

// Wait for all images to load
wait_page_idle();
```

### Parser Code

```javascript
// Extract data from the dynamically loaded content
return {
  products: $('.product-item').map(function() {
    return {
      title: $(this).find('.title').text().trim(),
      price: $(this).find('.price').text().trim(),
      image: $(this).find('img').attr('src') || $(this).find('img').data('src'),
      description: $(this).find('.description').text().trim()
    };
  }).get(),
  totalProducts: parseInt($('.total-count').text()) || 0,
  pageTitle: $('title').text().trim()
};
```
