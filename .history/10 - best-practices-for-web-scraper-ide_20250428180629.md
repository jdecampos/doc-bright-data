# Best Practices for Web Scraper IDE

Learn the best practices for using Web Scraper IDE, including optimizing performance, handling errors, managing retries, and writing efficient scraper code.

## Missing dead_page condition

When using navigate command, a 'dead_page' condition should be added to check if the page is not found. This will prevent automatic retries. While we automatically handle this when the response status is 404, in some cases, the website may respond with various other status codes.

Here are good and bad practices examples:

### Bad Practice

```javascript
navigate(input.url);
let data = parse();
collect(data);
```

### Good Practice

```javascript
navigate(input.url);
if (el_exists('.not-found-page') || el_exists('.error-404')) {
    dead_page('Page not found');
    return;
}
let data = parse();
collect(data);
```

## Optimize Performance

### Use Code Workers When Possible

Code Workers are more efficient and cost-effective than Browser Workers. Only use Browser Workers when necessary for complex interactions.

### Bad Practice

```javascript
// Using Browser Worker for simple data extraction
navigate(input.url);
let data = parse();
collect(data);
```

### Good Practice

```javascript
// Using Code Worker for simple data extraction
// Switch to Browser Worker only when needed for complex interactions
let res = request(input.url);
let $ = load_html(res.body);
collect({
    title: $('h1').text().trim(),
    price: $('.price').text().trim()
});
```

## Handle Errors Properly

### Implement Proper Error Handling

Always include error handling in your code to prevent crashes and improve reliability.

### Bad Practice

```javascript
navigate(input.url);
click('#show-more');
let data = parse();
collect(data);
```

### Good Practice

```javascript
navigate(input.url);
try {
    if (el_exists('#show-more')) {
        click('#show-more');
    }
    let data = parse();
    collect(data);
} catch (error) {
    console.error('Error occurred:', error.message);
    // Handle the error appropriately
}
```

## Manage Retries Effectively

### Use Appropriate Error Codes

Using the right error codes helps the system manage retries appropriately.

### Bad Practice

```javascript
navigate(input.url);
if (!el_exists('.product')) {
    throw new Error('Product not found');
}
```

### Good Practice

```javascript
navigate(input.url);
if (!el_exists('.product')) {
    if (el_exists('.login-required')) {
        blocked('Login required');
    } else if (el_exists('.not-found')) {
        dead_page('Product not found');
    } else if (el_exists('.bad-input-message')) {
        bad_input('Invalid input provided');
    } else {
        throw new Error('Unknown error occurred');
    }
}
```

## Write Efficient Parser Code

### Keep Parser Code Simple

Parser code should be focused on data extraction and transformation, not complex logic.

### Bad Practice

```javascript
// Complex logic in parser code
return {
    products: $('.product').map(function() {
        let price = $(this).find('.price').text();
        if (price.includes('$')) {
            price = parseFloat(price.replace('$', ''));
            if (price > 100) {
                return {
                    title: $(this).find('.title').text(),
                    price: price,
                    expensive: true
                };
            } else {
                return {
                    title: $(this).find('.title').text(),
                    price: price,
                    expensive: false
                };
            }
        } else {
            return null;
        }
    }).get().filter(Boolean)
};
```

### Good Practice

```javascript
// Simple data extraction in parser code
return {
    products: $('.product').map(function() {
        const title = $(this).find('.title').text().trim();
        const priceText = $(this).find('.price').text().trim();
        const price = priceText.includes('$') ? 
            parseFloat(priceText.replace('$', '')) : null;
        
        return {
            title,
            price,
            priceText
        };
    }).get()
};
```

## Use Multi-Stage Scraping Effectively

### Separate Complex Tasks into Stages

Break down complex scraping tasks into multiple stages for better organization and error handling.

### Bad Practice

```javascript
// Trying to do everything in one stage
navigate(input.search_url);
wait('.search-results');
let productUrls = parse().productUrls;
let allProducts = [];

for (let url of productUrls) {
    navigate(url);
    let productData = parse();
    allProducts.push(productData);
}

for (let product of allProducts) {
    collect(product);
}
```

### Good Practice

```javascript
// Stage 1: Get product URLs from search page
navigate(input.search_url);
wait('.search-results');
let productUrls = parse().productUrls;

for (let url of productUrls) {
    next_stage({product_url: url});
}

// Stage 2: Process each product page
// In a separate stage file:
navigate(input.product_url);
if (el_exists('.product-details')) {
    collect(parse());
} else {
    dead_page('Product details not found');
}
```

## Optimize Waiting and Timing

### Use Appropriate Wait Functions

Choose the right wait function for your specific needs to improve reliability and performance.

### Bad Practice

```javascript
// Using a fixed timeout
navigate(input.url);
setTimeout(() => {
    let data = parse();
    collect(data);
}, 5000);
```

### Good Practice

```javascript
// Using proper wait functions
navigate(input.url);
wait('.content-loaded');
// Or wait for network to be idle
wait_network_idle();
let data = parse();
collect(data);
```

## Document Your Code

### Add Comments for Complex Logic

Well-documented code is easier to maintain and troubleshoot.

### Bad Practice

```javascript
navigate(input.url);
if (el_exists('#popup')) click('#popup-close');
wait('.product');
let data = parse();
if (data.price) {
    data.price = data.price.replace('$', '');
    data.price = parseFloat(data.price);
}
collect(data);
```

### Good Practice

```javascript
// Navigate to the product page
navigate(input.url);

// Close popup if it appears
if (el_exists('#popup')) {
    click('#popup-close');
}

// Wait for product information to load
wait('.product');

// Get product data
let data = parse();

// Clean and convert price to number format
if (data.price) {
    // Remove currency symbol and convert to float
    data.price = parseFloat(data.price.replace('$', ''));
}

// Save the product data
collect(data);
```
