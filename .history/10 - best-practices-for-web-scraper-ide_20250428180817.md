# Best Practices for Web Scraper IDE

Learn the best practices for using Web Scraper IDE, including optimizing performance, handling errors, managing retries, and writing efficient scraper code.

## Missing dead_page condition

When using navigate command, a 'dead_page' condition should be added to check if the page is not found. This will prevent automatic retries. While we automatically handle this when the response status is 404, in some cases, the website may respond with various other status codes.

Here are good and bad practices examples:
