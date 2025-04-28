# Develop a Self-Managed Scraper with the IDE

Learn how to create a self-managed data scraper using the Web Scraper IDE. Follow steps to write interaction and parser code, preview, save, and initiate your custom scraper.

To develop a custom scraper using our Integrated Development Environment (IDE), you will need to insert a URL and start interacting with the development environment using Javascript language.

## Step-by-Step Guide

### 1. Start from scratch/choose a template

You can start from scratch or use a code template to get started with the development.

![Start from scratch or template](https://mintlify.s3.us-west-1.amazonaws.com/brightdata/images/scraping-automation/web-scraping-ide/develop-a-self-managed-scraper-with-the-ide/start-from-scratch.png)

### 2. Write the interaction code

Using the interaction code window, you can interact with the elements of the target website.

```javascript
// Example interaction code
navigate(input.url);
wait('.product-list');
let data = parse();
collect(data);
```

### 3. Write the parser code

Parse the HTML results you gathered from the interaction window.

```javascript
// Example parser code
return {
  products: $('.product-list .item').map(function() {
    return {
      title: $(this).find('.title').text().trim(),
      price: $(this).find('.price').text().trim(),
      url: new URL($(this).find('a').attr('href'), location.href).href
    };
  }).get()
};
```

### 4. Run preview

Preview your interaction and collection flow. To test your code, click the play icon.

![Run preview](https://mintlify.s3.us-west-1.amazonaws.com/brightdata/images/scraping-automation/web-scraping-ide/develop-a-self-managed-scraper-with-the-ide/run-preview.png)

### 5. Save your code

Save and complete your own data scraper once you've finished editing.

![Save code](https://mintlify.s3.us-west-1.amazonaws.com/brightdata/images/scraping-automation/web-scraping-ide/develop-a-self-managed-scraper-with-the-ide/save-code.png)

### 6. Set your delivery preference

Set up your preferred delivery settings.

![Delivery preferences](https://mintlify.s3.us-west-1.amazonaws.com/brightdata/images/scraping-automation/web-scraping-ide/develop-a-self-managed-scraper-with-the-ide/delivery-preferences.png)

### 7. Initiate the scraper run

Initiate your scraper and get collection results.

![Initiate scraper](https://mintlify.s3.us-west-1.amazonaws.com/brightdata/images/scraping-automation/web-scraping-ide/develop-a-self-managed-scraper-with-the-ide/initiate-scraper.png)

## Summary

Create a Data scraper by writing code in the IDE. The development environment provides all the tools you need to create your own data scraper.

For more detailed information about the available functions and commands, refer to the [Coding Environment & Tutorials](04%20-%20coding-environment-tutorials.md) documentation.
