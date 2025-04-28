# Worker Types

This article explains the behavior difference between worker types and how to choose the right one for your project.

Browser worker and code worker are two technical approaches for scraping, and you should choose between them based on your needs and budget, and based on technical challenges you're facing with the website you're scraping.

## Browser Worker vs Code Worker

### Browser Workers:

- Can simulate a user's interaction with the website via a headless browser
- Browser worker is more expensive to use, in terms of CPM (Cost Per Thousand page loads)
- Handles complex scraping tasks like filling forms, and dynamic content loading

### Code Workers:

- Roughly equivalent to doing a curl or python requests.get(url)
- Work by sending HTTP requests to the target website
- Much cheaper
- Can only work in situations that don't require interacting with the website UI

## Choose the Optimal Worker Type

You should choose the right worker type based on the technology used by the website you want to scrape, and the navigation needed for scraping the data you need.

It's good to start with the cheaper code workers and only change if you find that you can't get the data you want.

For example, use Browser Workers if:

- You need to click on elements to load more data
- You need to use scroll to load more elements
- You need to use tag_script, tag_response (capture network traffic from inside the browser)
- You need to type some text to get data on the website to do a search

## Align Your Code with Worker Type

Some functions in our library are only available when using browsers and will throw an error if you try to use them from code workers.

Below is a list of functions that you can only use from browser workers:

- **wait_*** (any wait function)
- **scroll_*** (any scroll function)
- **tag_*** (any tag function)
- **type**
- **browser_size**
- **emulate_device**
- **freeze_page**
- **click**
- **hover**
- **right_click**
- **mouse_to**
- **press_key**
- **solve_captcha**
- **capture_graphql**
- **close_popup**
