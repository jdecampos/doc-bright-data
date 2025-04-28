# Get to Know the IDE Interface

This article reviews the interface components of our IDE that is especially designed for web scraping purposes, and the interface components of the control panel (dashboard) from which you can manage your scrapers.

## The IDE

This is where you write your JavaScript code. Learn more about [The basics of Web Scraping](basic.md).

![IDE Interface](https://mintlify.s3.us-west-1.amazonaws.com/brightdata/images/scraping-automation/web-scraping-ide/get-to-know-the-IDE-interface/ide-interface.png)

### A: See more examples

Examples of template code that our scraper engineers built.

### B: Add another step (stage)

It is useful to add stages when you want to collect data from multiple pages. For example, in case you want to collect all products from Amazon search result page and details of all collected products. You can navigate the search result page on 1st stage to collect all product URLs and pass them to 2nd stage to navigate each product page.

`next_stage`, `run_stage` commands are available to interact between stages.

### C: Help

List of available functions, functions explanation and examples of usage. Learn more about Interaction functions and Parser functions.

### D: Debugging Tabs

- **Input**: Define your input parameters and run a test (preview) with an input set
- **Output**: List of collected data
- **Children**: List of children which will be input sets of the next stage
- **Run log**: Code execution log
- **Browser console**: scraper browser console logs [browser > developer tool > 'console tab']
- **Browser network**: scraper browser network logs [browser > developer tool > 'network tab']
- **Last errors**: List of latest error information

### E: Input

- **Add input parameter**: Define an input parameter including its name and type
- **Add another input**: Add the value of an input set to test
- **Preview**: Run a test with a selected input set

### F: Code settings

- **Error mode**: Set a code behavior of the scraper error case
- **Take screenshot**: Take screenshots during preview test. You will be able to check loaded pages during the test.

## Dashboard - Scraper Action Menu

The scraper action menu allows performing different actions with the scraper.

- **Initiate by API** - start a data collection without having to enter the control panel
- **Initiate manually** - Bright Data's control panel makes it easy to get started collecting data
- **Run on schedule** - select precisely when to collect the data you need
- **Versions** - review the modified versions of the scraper
- **Report an issue** - You can use this form to communicate any problems you have with the platform, the scraper, or the dataset results
- **Copy link** - copy the link of the scraper to share it with your colleagues
- **Tickets** - view the status of your tickets

### Advanced options:
- **Edit the code** - edit the scraper's code within the IDE.
- **Disable scraper** - temporarily disable the scraper, but you can reactivate it if needed.
- **Delete scraper** - permanently delete the scraper.
![IDE Interface](https://mintlify.s3.us-west-1.amazonaws.com/brightdata/images/scraping-automation/web-scraping-ide/get-to-know-the-IDE-interface/dashboard-action-menu.png)