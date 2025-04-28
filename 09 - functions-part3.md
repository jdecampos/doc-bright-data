# Functions (Continued)

## Interaction Functions (Continued)

### ⭐ right_click

The same as click but use right mouse button instead (will wait for the element to appear before clicking on it) 

**Syntax:** right_click(<selector>);

**Parameters:**
- selector: Element selector

```javascript
right_click('#item');
```

### run_stage

Run a specific stage of the crawler with a new browser session

**Parameters:**
- stage: Which stage to run (1 is first stage)
- input: Input object to pass to the next browser session

```javascript
run_stage(2, {url: 'http://example.com', page: 1});
```

### ⭐ scroll_to

Scroll the page so that an element is visible. If you're doing this to trigger loading some more elements from a lazy loaded list, use load_more(). Defaults to scrolling in a natural way, which may take several seconds. If you want to jump immediatley, use {immediate: true} 

**Syntax:** scroll_to(<selector>);

**Parameters:**
- selector: Selector of the element you want to scroll to

```javascript
scroll_to('.author-profile');
scroll_to('top'); // scroll to the top of the page
scroll_to('bottom'); // scroll to the bottom of the page
scroll_to('top', {immediate: true}); // jump to top of page immediately
```

### ⭐ scroll_to_all

Scroll through the page so that all the elements matching the selector will be visible on screen 

**Syntax:** scroll_to_all(<selector>);

**Parameters:**
- selector: Selector of the elements you want to scroll through

```javascript
scroll_to_all('.author-profiles');
```

### ⭐ select

Pick a value from a select element 

**Syntax:** select(<select>, <value>);

**Parameters:**
- selector: Element selector

```javascript
select('#country', 'Canada');
```

### set_lines

An array of lines to add to your dataset at the end of this page crawl. Each call to set_lines() will override previous ones, and only the last set of lines will be added into the dataset (tracked per page crawl). This is a good fit when the scraper is set to collect partial on errors. You can keep calling set_lines() with the data you gathered so far, and the last call will be used if the page crawl throws an error 

**Syntax:** set_lines(<data_line>[, <validate_fn>]);

**Parameters:**
- lines: An array of data lines to add to your final dataset
- validate_fn: Optional function to check that the line data is valid (run once per line)

```javascript
set_lines(products_so_far);
set_lines(products_so_far, i=>{
    if (!i.price)
        throw new Error('Missing price');
});
```

### set_session_cookie

Sets a cookie with the given cookie data; may overwrite equivalent cookies if they exist

```javascript
set_session_cookie(`domain`, `name`, `value`);
```

### set_session_headers

Set extra headers for all the HTTP requests

**Parameters:**
- headers: Object with extra headers in key-value format

```javascript
set_session_headers({'HEADER_NAME': 'HEADER_VALUE'});
```

### ⭐ solve_captcha

Solve any captchas shown on the page

```javascript
solve_captcha();
solve_captcha({type: 'simple', selector: '#image', input: '#input'});
```

### status_code

Returns the status code of the last page load

```javascript
collect({status_code: status_code()});
```

### ⭐ tag_all_responses

Save the responses from all browser request that match

**Parameters:**
- field: The name of the tagged field
- pattern: The URL pattern to match
- options: Set options.jsonp=true to parse response bodies that are in jsonp format. This will be automatically detected when possible

```javascript
tag_all_responses(<field>, <pattern>, <options>);
tag_all_responses('resp', /url/, {jsonp: true});
tag_all_responses('resp', /url/, {allow_error: true});
tag_all_responses('profiles', /\/api\/profile/);
navigate('https://example.com/sports');
let profiles = parse().profiles;
for (let profile of profiles)
    collect(profile);
```

### ⭐ tag_download

Allows to get files downloaded by browser

**Parameters:**
- url: A pattern or a string to match requests against

```javascript
let SEC = 1000;
let download = tag_download(/example.com\/foo\/bar/);
click('button#download');
let file1 = download.next_file({timeout: 10*SEC});
let file2 = download.next_file({timeout: 20*SEC});
collect({file1, file2});
```

### ⭐ tag_image

Save the image url from an element

**Parameters:**
- field: The name of the tagged field
- selector: A valid CSS selector

```javascript
tag_image(field, selector);
tag_image('image', '#product-image');
```

### ⭐ tag_response

Save the response data from a browser request 

**Syntax:** tag_response(<field>, <pattern>, <options>);

**Parameters:**
- name: The name of the tagged field
- pattern: The URL pattern to match
- options: Set options.jsonp=true to parse response bodies that are in jsonp format. This will be automatically detected when possible

```javascript
tag_response('resp', /url/, {jsonp: true});
tag_response('resp', /url/, {allow_error: true});
tag_response('resp', (req, res)=>{
            if (req.url.includes('/api/'))
            {
                let request_body = req.body;
                let request_headers = req.headers;
                let response_body = res.body;
                let response_headers = res.headers;
            }
        });

tag_response('teams', /\/api\/teams/);
navigate('https://example.com/sports');
let teams = parse().teams;
for (let team of teams)
    collect(team);
```

### ⭐ tag_screenshot

Save a screenshot of the page HTML 

**Syntax:** tag_screenshot(<field>, <options>);

**Parameters:**
- field: The name of the tagged field
- options: Download options (see example)

```javascript
tag_screenshot('html_screenshot', {filename: 'screen'});
tag_screenshot('view', {full_page: false}); // full_page defaults to true
```

### ⭐ tag_script

Extract some JSON data saved in a script on the page

**Syntax:** tag_script(<field>, <selector>);

**Parameters:**
- name: The name of the tagged script
- selector: The selector of the script to tag

```javascript
tag_script('teams', '#preload-data');
tag_script('ssr_state', '#__SSR_DATA__');
navigate('https://example.com/');
collect(parse().ssr_state);
```

### ⭐ tag_serp

Parse the current page as a search engine result page

**Parameters:**
- field: The name of the tagged field
- type: Parser type: (e.g. bing, google)

```javascript
tag_serp('serp_bing_results', 'bing')
tag_serp('serp_google_results', 'google')
```

### ⭐ tag_video

Save the video url from an element

**Parameters:**
- field: The name of the tagged field
- selector: A valid CSS selector
- opt: download options (see example)

```javascript
tag_video(field, selector);
tag_video('video', '#product-video', {download: true});
```

### ⭐ tag_window_field

Tag a js value from the browser page

**Parameters:**
- field: The path to the relevant data

```javascript
tag_window_field(field, key);
tag_window_field('initData', '__INIT_DATA__');
```

### ⭐ track_event_listeners

Start tracking the event listeners that the browser creates. It's needed to run disable_event_listeners() later

```javascript
track_event_listeners();
```
