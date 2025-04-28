# Functions (Continued)

## Interaction Functions (Continued)

### ⭐ hover

Hover on an element (will wait for the element to appear before hovering on it) 

**Syntax:** hover(<selector>);

**Parameters:**
- selector: Element selector

```javascript
hover('#item');
```

### ⭐ html_capture_options

Influence the process of the HTML capturing

**Parameters:**
- options: An object which accepts options defining how HTML capturing should be processed
  - coordinate_attributes

```javascript
html_capture_options({
    coordinate_attributes: true,
});
```

### Image

Collect image data

**Parameters:**
- src: Image URL or data:image URI string

```javascript
let i = new Image('https://example.com/image.png');
collect({image: i});
```

### input

Global object available to the interaction code. Provided by trigger input or next_stage() calls

```javascript
navigate(input.url);
```

### job

Global object available to the interaction code. Provided by trigger input or next_stage() calls

```javascript
let {created} = job;
```

### load_html

Load html and return Cheerio instance

**Parameters:**
- html: Any HTML string

```javascript
let $$ = load_html('<p id="p1">p1</p><p id="p2">p2</p>');
collect({data: $$('#p2').text()});
```

### ⭐ load_more

Scroll to the bottom of a list to trigger loading more items. Useful for lazy-loaded infinite-scroll sites

**Parameters:**
- selector: Selector for the element that contains the lazy-loaded items

```javascript
load_more(<selector>);
load_more('.search-results');
load_more('.search-results', {children: '.result-item', trigger_selector: '.btn-load-more', timeout: 10000});
```

### load_sitemap

Read a list of urls from a sitemap xml (supports sitemap indexes, and .gz compressed sitemaps. see examples.)

```javascript
let {pages} = load_sitemap({url: 'https://example.com/sitemap.xml.gz'});
let {children} = load_sitemap({url: 'https://example.com/sitemap-index.xml'});
```

### location

Object with info about current location. Available fields: href

```javascript
navigate('https://example.com');
location.href; // "https://example.com/"
```

### Money

Collect price/money data

**Parameters:**
- value: Amount of money
- currency: Currency code

```javascript
let p = new Money(10, 'USD');
collect({product_price: p});
```

### ⭐ mouse_to

Move the mouse to the specified (x,y) position 

**Syntax:** mouse_to(<x>, <y>);

**Parameters:**
- x: Target x position
- y: Target y position

```javascript
mouse_to(0, 0);
```

### navigate

Navigate the browser to a URL 

**Syntax:** navigate(<url>);

A 404 status code will throw a dead_page error by default. Use opt.allow_status to override this

**Parameters:**
- url: A URL to navigate to
- opt: navigate options (see examples)

```javascript
navigate(input.url);
navigate('https://example.com');

// waits until DOM content loaded event is fired in the browser
navigate(`url`, {wait_until: 'domcontentloaded'}); 

// adds a referer to the navigation
navigate(`url`, {referer: `url`}); 

// the number of milliseconds to wait for. Default is 30000 ms
navigate(`url`, {timeout: 45000}); 

// Don't throw an error if this URL sends a 404 status code
navigate(`url`, {allow_status: [404]});

// Specify browser width/height
navigate(`url`, {
    fingerprint: {screen: {width: 400, height: 400}},
});
```

### next_stage

Run the next stage of the crawler with the specified input

**Parameters:**
- input: Input object to pass to the next browser session

```javascript
next_stage({url: 'http://example.com', page: 1});
```

### parse

Parse the page data

```javascript
let page_data = parse();
collect({
    title: page_data.title,
    price: page_data.price,
});
```

### preserve_proxy_session

Preserve proxy session across children of this page

```javascript
preserve_proxy_session();
```

### ⭐ press_key

Type special characters like Enter or Backspace in the currently focused input (usually used after typing something in a search box)

```javascript
press_key('Enter');
press_key('Backspace');
```

### ⭐ proxy_location

Configure your crawl to run from a specific location. Unless you need high resolution control over where your crawl is running from, you probably want to use country(code) instead

**Parameters:**
- configuration: Object with a desired proxy location, check examples for more info

```javascript
proxy_location({country: 'us'});

// lat in range: [-85, 85], long in range: [-180, 180]
proxy_location({lat: 37.7749, long: 122.4194}); 

// radius in km
proxy_location({lat: 37.7749, long: 122.4194, country: 'US', radius: 100}); 
```

### ⭐ redirect_history

Returns history of URL redirects since last navigate

```javascript
navigate('http://google.com');
let redirects = redirect_history();
// returns:
// [
//   'http://google.com',
//   'http://www.google.com',
//   'https://www.google.com/',
// ]
```

### rerun_stage

Run this stage of the crawler again with new input

```javascript
rerun_stage({url: 'http://example.com/other-page'});
```

### resolve_url

Returns the final URL that the given url argument leads to

**Parameters:**
- url: URL string/instance

```javascript
let {href} = parse().anchor_elem_data;
collect({final_url: resolve_url(href)});
```

### response_headers

Returns the response headers of the last page load

```javascript
let headers = response_headers();
console.log('content-type', headers['content-type']);
```

### request

Make a direct HTTP request

**Parameters:**
- url | options: the url to make the request to, or request options (see examples)

```javascript
let res = request('http://www.example.com');
let res = request({url: 'http://www.example.com', method: 'POST', headers: {'Content-type': 'application/json'}, body: {hello: 'world'}})
```
