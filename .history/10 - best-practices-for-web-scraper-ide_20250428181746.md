# Best Practices for Web Scraper IDE

Learn the best practices for using Web Scraper IDE, including optimizing performance, handling errors, managing retries, and writing efficient scraper code.

## Missing dead_page condition

When using navigate command, a 'dead_page' condition should be added to check if the page is not found. This will prevent automatic retries. While we automatically handle this when the response status is 404, in some cases, the website may respond with various other status codes.

Here are good and bad practices examples:

### Bad Practice

```javascript
try {
    // no need to wait 30sec 'ok-selector' in case of dead_page()
    wait('ok-selector');
} catch(e) {
    // in this case we can't be sure that the page is real dead
    dead_page('Page doesn\'t exist');
}
```

### Good Practice

```javascript
wait('ok-selector, 404-selector');
if (el_exists('404-selector'))
  dead_page();
```

### Minimize amount of requests to the browser

Some interaction commands like click type el_exists el_is_visible wait wait_visible make real requests to the browser and may increase latency and decrease performance. It is recommended to combine selectors and make a single call instead of multiple calls.


### Bad Practice

```javascript
if (!(el_exists('#price1')) || el_exists('#price2')
  || el_exists('#price3') || el_exists('#discount'))
{
    dead_page('No price found');
}
```

### Good Practice

```javascript
if (!el_exists('#price1, #price2, #price3, #discount'))
  dead_page('No price found');
```

### Incorrect usage of rerun_stage()

When a website has pagination on the page and data from all pages is required, rerun_stage() should be called for each page from the root page instead of calling it from each page. This allows the system to parallelize the requests and make the scraper faster.

### Bad Practice

```javascript
navigate(input.url);
let $ = html_load(html());
let next_page_url = $('.next_page').attr('href');
rerun_stage({url: next_page_url});
```

### Good Practice

```javascript
let url = new URL(input.url);
if (input.page)
    url.searchParams.set('page', input.page);
navigate(url);
// The input.page does not exist except on the root page, from which we
// have already invoked rerun_stage() for each page.
if (input.page)
    return;

let $ = html_load(html());
let total_products = +$('.total_pages').text();
let total_pages = Math.ceil(total_products / 20);
total_pages = Math.min(total_pages, 50);

for (let page=2;page<=total_pages;page++)
    rerun_stage({url: input.url, page});
```

### Use close_popup() to close popups

Do not spend time waiting for popups to appear. Use close_popup('popup_selector', 'close_button_selector') to close popups. A popup can appear at any time, and in most cases, adding a check before each interaction command is not desirable.

### Bad Practice

```javascript
navigate('https://example.com');
try {
  wait_visible('.cky-btn-accept', {timeout: 5000});
  click('.cky-btn-accept');
} catch(e) {
    console.log('Accept cookies button does not exist, continue');
}

```

### Good Practice

```javascript
// it runs in the background and does not affect the performance.
// We check if the popup is visible before any interaction like
// click or type.
close_popup('.cky-btn-accept', '.cky-btn-accept');
navigate('https://example.com');
click('.open-product-full-info');
```

### Use wait_for_parser_value() with tag_response()

When using tag_response command and needing to ensure that request is finished before collecting data from the page, wait_for_parser_value() should be used:

### Bad Practice

```javascript
tag_response('product', /api\/product/);

// parser code
// in this case we can't be sure that the request is finished
let {product} = parser;
return product.data;
```

### Good Practice

```javascript
tag_response('product', /api\/product/);
navigate('https://example.com');
wait_for_parser_value('product');

// parser code
let {product} = parser;
return product.data;
```

```javascript
tag_response('product', /api\/product/);
navigate('https://example.com');

// you can also get the data from the response in interaction
let product = wait_for_parser_value('product');
navigate(product.reviews_url);
tag_html('reviews_html');

// parser code
let {product, reviews_html} = parser;
let $ = html_load(reviews_html);
let reviews = $('.review').toArray().map(v=>$(v).text());
return {
  ...product.data,
  reviews,
};
```

### Custom error messages

Avoid using custom error messages when possible. Our system does the best to provide you with the most accurate error messages:

### Bad Practice

```javascript
try {
  wait('selector1');
  //some code
  wait('selector2');
  //some code
} catch(e) {
  throw "Page not loaded properly"
}
```

### Good Practice

```javascript
if (!el_exists('.product-title'))
    throw new Error('Failed to load product page');
```

```javascript
// Crawler error: waiting for selector "selector1" failed: timeout 30000ms exceeded
wait('selector1');
//some code
wait('selector2');
//some code
```

### Slow website response, increasing timeouts

If the website is not loading properly, it may be due to a poor peer connection. It is advisable to display an error message, and the system will attempt to load the page using a more stable peer session.

### Bad Practice

```javascript
// 120 sec to long for waiting
wait('selector', {timeout: 120000});
```

### Good Practice

```javascript
wait('selector'); // better to use default timeout (30 sec)
wait('selector', {timeout: 45000});
wait('selector', {timeout: 60000});  // 60 sec is ok for slow websites
```

### Retry mechanism

The scraper code should be clear and focus solely on the necessary tasks for scraping data. There is no need to attempt to reinvent the wheel. It’s better to emphasize issues unrelated to the code and report them in the system.

### Bad Practice

```javascript
let counter = input.counter || 5;
while (counter > 1) {
  try {
    wait('selector' , {timeout: 500});
    click('selector');
    type('selector');
    //some code
    break;
  } catch(e) {
    // not acceptable use rerun_stage to create new session in case of error
    return rerun_stage({...input, counter: --counter});
  }
}
```

### Good Practice

```javascript
navigate("https://example.com");
wait('h1');
```


### Avoid using a try-catch block

This facilitates the development of concise and readable code, effectively managing potential 'null' or 'undefined' values without the reliance on a try-catch block.   

### Bad Practice

```javascript
try {
  const example = obj.prop;
} catch(e) {
  console.log(e);
}
```

```javascript
// wasting browser time for no reason
try { wait('selector'); } catch(e){}
try { wait_network_idle({timeout: 8000}) } catch(e){};
try { wait_page_idle(); } catch(e) {}
```

### Good Practice

```javascript
const links = $('.card.product-wrapper').toArray().map(v=>({
  url: $(v).find('h4 a').attr('href'),
}));
```

### Avoid using a try-catch block

Parser code: get values from set of elements
The best practice code employs the more concise and functional toArray() and map() methods instead of the traditional each() loop. This enhances code readability and upholds a declarative style.  

### Bad Practice

```javascript
const links = [];
$('.card.product-wrapper').each(function(i, el) {
  links.push({url: $(this).find('h4 a').attr('href')});
})
return links;
```

### Good Practice

```javascript
let name = $('a').text_sane();
or if you need only numbers
let value= +$('a').text().replace(/\D+/g, '');
```
