# Functions

## Interaction Functions

This article lists and explains the available commands within the Interaction code for writing a scraper using the IDE.

Commands marked with a star ⭐ are proprietary functions developed by Bright Data.

### bad_input

Mark the scraper input as bad. Will prevent any crawl retries error_code=bad_input

```javascript
bad_input();
bad_input('Missing search term');
```

### blocked

Mark the page as failed because of the website refusing access (error_code=blocked)

```javascript
blocked();
blocked('Login page was shown');
```

### ⭐ bounding_box

The box of coordinates that describes the area of an element (relative to the page, not the browser viewport). Only the first element matched will be measured

**Parameters:**
- selector: A valid CSS selector for the element

```javascript
let box = bounding_box('.product-list');
// box == {
//   top: 10,
//   right: 800,
//   bottom: 210,
//   left: 200,
//   x: 200,
//   y: 10,
//   width: 600,
//   height: 200,
// }
```

### ⭐ browser_size

Returns current browser window size

```javascript
TBD
```

### ⭐ capture_graphql

Capture and replay graphql requests with changed variables

**Parameters:**
- options: Params to control graphql request to capture
  - url
  - payload

Example #1:

```javascript
let q = capture_graphql({
    payload: {id: 'ProfileQuery'},
    // you may need to pass url opt as RegExp in case when 
    // graphql endpoint is not "*/graphql" which is default value
    // url: /\bgraphql\b/ // default
});

navigate('https://example.com');

let [first_query, first_response] = q.wait_captured();

collect(first_response.data.profile);

let second = q.replay({
    variables: {other_id: 2},
});

collect(second.data.profile);
```

Example #2:
```javascript
let q = capture_graphql({
    payload: {id: 'ProfileQuery'},
    // you may need to pass url opt as RegExp in case when 
    // graphql endpoint is not "*/graphql" which is default value
    // url: /\bgraphql\b/ // default
});

navigate('https://example.com');

if (!q.is_captured())
    click('#load_more');

let [first_query, first_response] = q.wait_captured();

collect(first_response.data.profile);

let second = q.replay({
    variables: {other_id: 2},
});

collect(second.data.profile);

```

### ⭐ click

Click on an element (will wait for the element to appear before clicking on it)

**Parameters:**
- selector: Element selector

```javascript
click('#show-more');
$('#show-more').click()
// Click the closest match to the passed coordinates
// (relative to the page).
// For example, clicking the center pin in a map
let box = bounding_box('#map')
let center = {x: (box.left+box.right)/2, y: (box.top+box.bottom)/2};
click('.map-pin', {coordinates: center});
```

### ⭐ close_popup

Popups can appear at any time during a crawl and it's not always clear when you should be waiting for or closing them. Add close_popup() at the top of your code to add a background watcher that will close the popup when it appears. If a popup appears multiple times, it will always be closed

**Parameters:**
- popup selector: A valid CSS selector
- close selector: A valid CSS selector
- options: click_inside: selector of parent iframe which contains close button selector

```javascript
close_popup('.popup', '.popup_close');
close_popup('iframe.with-popup', '.popup_close', {click_inside: 'iframe.with-popup'});
```

### collect

Adds a line of data to the dataset created by the crawler

**Syntax:** collect(<data_line>[, <validate_fn>]);

**Parameters:**
- data_line: A object with the fields you want to collect
- validate_fn: Optional function to check that the line data is valid

```javascript
collect({price: data.price});
collect(product, p=>{
    if (!p.title)
        throw new Error('Product is missing a title');
})
```

### console

Log messages from the interaction code

```javascript
console.log(1, 'brightdata', [1, 2], {key: value});
console.error(1, 'brightdata', [1, 2], {key: value});
```

### country

Configure your crawl to run from a specific country 

**Syntax:** country(<code>);

**Parameters:**
- code: 2-character ISO country code

```javascript
country('us');
```

### dead_page

Mark a page as a dead link so you can filter it from your future collections error_code=dead_page

```javascript
dead_page();
dead_page('Product was removed');
```

### ⭐ detect_block

Detects a block on the page

**Parameters:**
- resource: An object specifying the resource required for the detection
  - selector
- condition: An object specifying how the resource should be processed for detection
  - exists
  - has_text

```javascript
detect_block({selector: '.foo'}, {exists: true});
detect_block({selector: '.bar'}, {has_text: 'text'});
detect_block({selector: '.baz'}, {has_text: /regex_pattern/});
```

### ⭐ disable_event_listeners

Stop all event listeners on the page from running. track_event_listeners() must have been called first

**Parameters:**
- event_types: Specific event types that should be disabled

```javascript
disable_event_listeners();
disable_event_listeners(['hover', 'click']);
```

### el_exists

Check if an element exists on page, and return a boolean accordingly

**Parameters:**
- selector: Valid CSS selector
- timeout: Timeout duration to wait for the element to appear on the page

```javascript
el_exists('#example'); // => true
el_exists('.does_not_exist'); // => false
el_exists('.does_not_exist', 5e3); // => false (after 5 seconds)
```

### el_is_visible

Check if element is visible on page

**Parameters:**
- selector: Valid CSS selector
- timeout: Timeout duration to wait for the element to be visible on the page

```javascript
el_is_visible('#example');
el_is_visible('.is_not_visible', 5e3); // false (after 5 seconds)
```

### embed_html_comment

Add a comment in the page HTML. Can be used to embed metadata inside HTML snapshots.

**Parameters:**
- comment: Body of the comment

```javascript
embed_html_comment('trace-id: asdf123');
```

### ⭐ font_exists

Assert the capability of the browser to render the given font family on the page 

**Syntax:** font_exists(<font-family>);

```javascript
font_exists('Liberation Mono');
```

### ⭐ freeze_page

Force the page to stop making changes. This can be used to save the page in a particular state so page snapshots that run after crawl won't see a different page state than you see now. This command is experimental. If you see problems, please report them to support

```javascript
freeze_page();
```
