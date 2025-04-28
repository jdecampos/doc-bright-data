# Coding Environment & Tutorials

Explore essential coding commands and best practices for using the Web Scraper IDE. Learn how to navigate, parse data, interact with elements, and optimize your scraping tasks efficiently.

## IDE Interaction Code

These are all of the codes that you can use with the IDE:

### input

Global object available to the interaction code. Provided by trigger input or next_stage() calls

```javascript
navigate(input.url);
```

### navigate

Navigate the browser session to a URL

**Parameters:**
- url: A URL to navigate to

```javascript
navigate([url]);
navigate(input.url);
navigate('https://example.com');
```

#### navigate options

```javascript
// waits until DOM content loaded event is fired in the browser
navigate([url], {wait_until: 'domcontentloaded'});

// adds a referer to the navigation
navigate([url], {referer: [url]});

// the number of milliseconds to wait for. Default is 30000 ms
navigate([url], {timeout: 45000});

// add headers to the navigation
navigate([url], {header : 'accept: text/html'});

// specify browser width/height
navigate([url], {fingerprint: {screen: {width: 400, height: 400}}});
```

### parse

Parse the page data

```javascript
let page_data = parse();
```

### collect

Adds a line of data to the dataset created by the crawler

**Parameters:**
- data_line: An object with the fields you want to collect
- validate_fn: Optional function to validate that the line data is valid

```javascript
collect([data_line] [validate_fn]);
collect({ title: page_data.title, price: page_data.price });
collect({ price: data.price });

collect(line, l=>!l && throw new Error('Empty line'));
```

### next_stage

Run the next stage of the crawler with the specified input

**Parameters:**
- input: Input object to pass to the next browser session

```javascript
next_stage({url: 'http://example.com', page: 1});
```

### rerun_stage

Run this stage of the crawler again with new input

**Parameters:**
- input: Input object to pass to the next browser session

```javascript
rerun_stage({url: 'http://example.com/other-page'});
```

### run_stage

Run a specific stage of the crawler with a new browser session

**Parameters:**
- input: Input object to pass to the next browser session
- stage: Which stage to run (1 is first stage)

```javascript
run_stage(2, {url: 'http://example.com', page: 1});
```

### country

Configure your crawl to run from a specific country

**Parameters:**
- code: 2-character ISO country code

```javascript
country(<code>);
```

### wait

Wait for an element to appear on the page

**Parameters:**
- selector: Element selector
- opt: wait options (see examples)

```javascript
wait(<selector>);
wait('#welcome-splash');
wait('.search-results .product');
wait('[href^="/product"]');
wait(<selector>, {timeout: 5000});
wait(<selector>, {hidden: true});
```

### wait_for_text

Wait for an element on the page to include some text

**Parameters:**
- selector: Element selector
- text: The text to wait for

```javascript
wait_for_text(<selector>, <text>);
wait_for_text('.location', 'New York');
```

### click

Click on an element (will wait for the element to appear before clicking on it)

**Parameters:**
- selector: Element selector

```javascript
click(<selector>);
click('#show-more');
```

### type

Enter text into an input (will wait for the input to appear before typing)

**Parameters:**
- selector: Element selector
- text: The text to type

```javascript
type(<selector>, <text>);
type('#location', 'New York');
type(<selector>, ['Enter']);
type(<selector>, ['Backspace']);
```

### select

Pick a value from a select element

**Parameters:**
- selector: Element selector
- value: The value to select

```javascript
select(<select>, <value>);
select('#country', 'Canada');
```

### URL

URL class from NodeJS standard "url" module

**Parameters:**
- url: URL string

```javascript
let u = new URL('https://example.com');
```

### location

Object with info about current location. Available fields: href

```javascript
navigate('https://example.com');
location.href;
```

### tag_response

Save the response data from a browser request

**Parameters:**
- name: The name of the tagged field
- pattern: The URL pattern to match

```javascript
tag_response(<field>, <pattern>);
tag_response('teams', /\/api\/teams/);
navigate('https://example.com/sports');

let teams = parse().teams;
for (let team of teams) collect(team);
```

### response_header

Returns the response headers of the last page load

```javascript
let headers = response_headers(); 
console.log('content-type', headers['content-type']);
```

### console

Log messages from the interaction code

```javascript
console.log(1, 'luminati', [1, 2], {key: value});
```

### load_more

Scroll to the bottom of a list to trigger loading more items. Useful for lazy-loaded infinite-scroll sites

**Parameters:**
- selector: Element selector

```javascript
load_more(<selector>);
load_more('.search-results');
```

### scroll_to

Scroll the page so that an element is visible

**Parameters:**
- selector: Element selector

```javascript
scroll_to(<selector>);
scroll_to('.author-profile');
```

### $

Helper for jQuery-like expressions

**Parameters:**
- selector: Element selector

```javascript
$(<selector>);
wait($('.store-card'))
```

## IDE Parser Code

These are all of the codes that you can use with the IDE parser:

### input

Global variable available to the parser code

```javascript
let url = input.url;
```

### $

An instance of cheerio. Find more information on the [cheerio website](https://cheerio.js.org/).

```javascript
$('#example').text()
$('#example').attr('href')
```

### location

A global variable available to the parser code. Object with info about current location

```javascript
let current_url = location.href;
```
