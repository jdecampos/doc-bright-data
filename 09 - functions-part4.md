# Functions (Continued)

## Interaction Functions (Continued)

### ⭐ type

Enter text into an input (will wait for the input to appear before typing)

**Parameters:**
- selector: Element selector
- text: Text to enter

```javascript
type(<selector>, <text>);
type('#location', 'New York');

// replacing text in input if it is not empty
type(<selector>, <text>, {replace: true}); 

// type text to an element with id ending "input-box" (e.g. <input id="c2E57-input-box">)
type('[id$=input-box]', <text>); 

// dispatching 'Enter' key press
type(<selector>, ['Enter']); 

// typing text and then dispatching 'Enter' key press
type(<selector>, ['Some text', 'Enter']); 

// deleting 1 char from input
type(<selector>, ['Backspace']); 
```

### URL

URL class from NodeJS standard "url" module

**Parameters:**
- url: URL string

```javascript
let u = new URL('https://example.com');
```

### ⭐ verify_requests

Monitor failed requests with a callback function

**Parameters:**
- callback: A function which will be called on each failed request with an object in format: {url, error, type, response}

```javascript
verify_requests(({url, error, type, response})=>{
    if (response.status!=404 && type=='Font')
        throw new Error('Font failed to load');
});
```

### Video

Collect video data

**Parameters:**
- src: Video URL

```javascript
let v = new Video('https://example.com/video.mp4');
collect({video: v});
```

### ⭐ wait

Wait for an element to appear on the page

**Parameters:**
- selector: Element selector
- opt: wait options (see examples)

```javascript
wait(<selector>);
wait('#welcome-splash');
wait('.search-results .product');
wait('[href^="/product"]');

// the number of milliseconds to wait for. Default is 30000 ms
wait(<selector>, {timeout: 5000}); 

// wait for element to be hidden
wait(<selector>, {hidden: true}); 

// wait for element inside in an iframe
wait(<selector>, {inside: '#iframe_id'}); 
```

### ⭐ wait_any

Wait for any matching condition to succeed

```javascript
wait_any(['#title', '#notfound']);
```

### wait_for_parser_value

Wait for a parser field to contain a value. This can be useful after you click something to wait for some data to appear

**Parameters:**
- field: The parser value path to wait on
- validate_fn: An optional callback function to validate that the value is correct
- opt: Extra options (e.g. timeout)

```javascript
wait_for_parser_value(<field>[, <validate_fn>][, opt]);
wait_for_parser_value('profile');
wait_for_parser_value('listings.0.price', v=>{
            return parseInt(v)>0;
        }, {timeout: 5000});
```

### ⭐ wait_for_text

Wait for an element on the page to include some text

**Parameters:**
- selector: Element selector
- text: The text to wait for

```javascript
wait_for_text(<selector>, <text>);
wait_for_text('.location', 'New York');
```

### ⭐ wait_hidden

Wait for an element to not be visible on the page (removed or hidden)

**Parameters:**
- selector: Element selector

```javascript
wait_hidden(<selector>);
wait_hidden('#welcome-splash');
wait_hidden(<selector>, {timeout: 5000});
```

### ⭐ wait_network_idle

Wait the browser network has been idle for a given time

**Parameters:**
- timeout: Wait for browser network to be idle for X milliseconds
- options: ignore: an array of patterns to exclude requests from monitoring timeout: how long the network needs to be idle in milliseconds (default 500)

```javascript
wait_network_idle();
wait_network_idle({
    timeout: 1e3,
    ignore: [/long_request/, 'https://example.com'],
});
```

### ⭐ wait_page_idle

Wait until no changes are being made on the DOM tree for a given time

**Parameters:**
- timeout: Milliseconds to wait for no changes
- options: An object, which can accept a ignore argument to exclude some elements from monitoring

```javascript
wait_page_idle();
wait_page_idle({
    ignore: [<selector1>, <selector2>],
    idle_timeout: 1000,
});
```

### ⭐ wait_visible

Wait for an element to be visible on the page

**Parameters:**
- selector: Element selector

```javascript
wait_visible(<selector>);
wait_visible('#welcome-splash');
wait_visible(<selector>, {timeout: 5000});
```

### $

Helper for jQuery-like expressions

**Parameters:**
- selector: Element selector

```javascript
$(<selector>);
wait($('.store-card'))
```

### Clicking on selector based on text

Helper for jQuery-like expressions

**Parameters:**
- selector: Element selector

```javascript
$('.selector').filter_includes('text').click()
```

### ⭐ emulate_device

View pages as a mobile device. This command will change user agent and screen parameters (resolution and device pixel ratio)

**Parameters:**
- device: A string with the name of device

```javascript
emulate_device('iPhone X');
emulate_device('Pixel 2');
```

Here is the full list of device names:

## Parser Functions

This article lists and explains the available commands within the Parser code for writing a scraper using the IDE.

### input

Global variable available to the parser code

```javascript
let url = input.url;
```

### $

An instance of cheerio

```javascript
$('#example').text();
$('$example').attr('href');
$('#example').text_sane(); /* This is like $().text() but also trims text and replace all space characters with single space "a b \t\n\n c" -> "a b c" */
```

Find more information on the [cheerio website](https://cheerio.js.org/).

### location

A global variable available to the parser code. Object with info about current location

```javascript
let current_url = location.href; 
```

### Image

Collect image data

```javascript
let i = new Image('https://example.com/image.png');
collect({image: i});
```

### Video

Collect video data

```javascript
let v = new Video('https://example.com/video.mp4');
collect({video: v});
```

### Money

Collect price/money data

```javascript
let p = new Money(10, 'USD');
collect({product_price: p});
```
