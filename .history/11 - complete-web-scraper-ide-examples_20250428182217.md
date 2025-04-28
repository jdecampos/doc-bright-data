# Complete Web Scraper IDE Examples

Explore comprehensive examples of web scraping using the Web Scraper IDE, including code for interaction, parsing, handling multiple results, and advanced techniques.

## Introduction

The collect and parse commands have been removed. The data will be returned from parser code as an object or array, and it will be automatically saved to the output.

## Interaction code


```javascript

// Old code
navigate("https://example.com");
collect(parse());

// New code

navigate("https://example.com");

// New code alternative
navigate("https://example.com");
tag_html("html_key");
```

#### Parser code
```javascript
// Old code
navigate("https://example.com");
collect(parse());

// New code
navigate("https://example.com");

// New code alternative
navigate("https://example.com");
tag_html("html_key");
```
