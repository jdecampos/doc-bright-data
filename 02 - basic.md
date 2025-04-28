# The Basics of Web Scraping

This article describes the basic concepts in web scraping, like Navigation, Parsing, Worker type, and main Challenges.

If you know your way around JS but are new to web data scraping you might need to learn the basic approach and one or two tactics for successful scraping.

The basic idea of web scraping consists of two parts, Navigation and Parsing, and the tactics used to achieve those are depending on the selected technical approach of using Browser worker vs. Code worker.

## Browser Worker vs. Code Worker

Browser worker and code worker are two technical approaches for scraping, and you should choose between them based on your needs and budget, and based on technical challenges you're facing with the website you're scraping.

**Browser Workers** simulates user interactions with websites through a headless browser, capable of handling complex scraping tasks such as user input and dynamic content loading. Running your code with a browser worker involves higher CPM, but in some use cases it is the only feasible solution to get the data.

**Code Workers**, on the other hand, run on the server-side and perform scraping tasks through HTTP requests. A script or program sends requests to the target website, extracts data from the individual responses, and saves it to a file or database. Running your code with a code worker is cheaper and brings faster results.

You can switch between worker types per scraper at any time, so you never commit to any specific worker, but be aware that there are a few functions (like 'wait') that are designed for and limited to work only with a Browser Worker. [Learn more about worker types](#)

## Interaction and Parsing

Interaction and parsing are two key steps in web scraping that involve accessing and manipulating the HTML content of a website.

**Interaction** refers to the process of moving between different pages or sections of a website to locate the data that you want to scrape. This typically involves sending GET or POST requests to the website's URLs, and following links or submitting forms to access different pages or sections. It also involves actions/commands such as click, type, and wait. Once the browser page has the data you want, call `parse()` to get the data - this will trigger the Parser code, then call `collect()` to add a record to your final dataset.

For example:

```javascript
let data = parse();
collect({
    url: new URL(location.href),
    title: data.title,
    links: data.links,
});
```

**Parsing** refers to the process of extracting the relevant data from the HTML content of a website. This involves identifying the HTML elements that contain the data you want to scrape, and using regular expressions or other techniques to extract the data from those elements.

For example:

```javascript
return {
  title: $('h1').text().trim(),
  links: $('a').toArray().map(e=>new URL($(e).attr('href'))),
};
```

For instance, let's say that you would like to scrape an e-commerce website based on a search term, and return the (title, description, price) for each product.

```javascript
let search_url = `https`;
navigate(search_url)
let max_page = parse().max_page
for (let i = 1; i <= max_page; i++)
{
    let search_page = new URL(search_url)
     if (i>1)
          search_page.searchParams.set('page', i)
     next_stage({search_page})
}
```

```javascript
navigate(input.search_page)
let listings = parse().listings
for (let listing_url of listings)
     next_stage({listing_url})
```

```javascript
navigate(input.listing_url)
collect(parse())
```

1. Navigate to the search page of the ecommerce website using a GET or POST request
2. Locate the HTML elements that contain the number of pages
3. Parse the HTML to extract the number of search results pages
4. Navigate to each result page and do the following
5. Locate the HTML elements that contain each search result data
6. Parse the HTML content of each search results to collect the URLs of each product page
7. Navigate to each product page and do the following
8. Locate the HTML elements that contain the desired product data
9. Parse the HTML to extract the desired product data

## The challenges and barriers of scraping at scale

Scraping can be fast and easy when done on a small scale, but in case your project requires a high volume of data there are a few challenges you might have to deal with as some websites implement technical measures such as CAPTCHAs or IP blocking to prevent scraping.

There are ways to overcome those challenges, but doing it by yourself might be too complex and time consuming. To solve those challenges we've built our IDE cloud service on top of our proprietary proxy infrastructure and our Web Unlocker API, so you won't have to face those challenges.
