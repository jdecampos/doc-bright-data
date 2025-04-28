# Web Scraper IDE FAQs

Find answers to common questions about Bright Data's Web Scraper IDE, including setup, troubleshooting, and best practices for developing custom data scrapers.

## General Questions

### What is a Bright Data Web Scraper?

Bright Data Web Scrapers are automated tools that enable businesses to automatically collect all types of public online data on a mass scale, while heavily reducing in-house expenses on proxy maintenance and development.

The Web Scraper delivers enormous amounts of raw data in a structured format, and integrates with existing systems, for immediate use in competitive data-driven decisions.

Bright Data has developed hundreds of Web Scrapers customized to popular platforms.

### What is Web Scraper IDE?

Web Scraper IDE is an integrated development environment. The IDE is a Public web data on any scale at your fingertips, you can:

- Build your scraper in minutes
- Debug and diagnose with ease
- Bring to production quickly
- Browser scripting in simple Javascript

### What is an "input" when using a Web Scraper?

When collecting data, your "input" are the parameters you'll enter to run your collection with. This can include keywords, URL, search items, product ID, ASIN, profile name, check in and check out dates, etc.

### What is an "output" when using a Web Scraper?

The output is the data that you've collected from a platform based on your input parameters. You'll receive your data as JSON/NDJSON/CSV/XLSX.

## Usage and Limitations

### How many free records are included with my free trial?

Each free trial includes 100 records (note: 100 records does not mean 100 page loads).

### Why did I receive more statistic records than inputs?

You'll always receive a higher number of records than the inputs you've requested.

### What are the most frequent data points collected from social media?

Number of followers, average number of likes for posts, level of engagement, account theme, social and demographic portrait of the audience, social listening: keywords/ brand mentions, sentiments, viral trends.

### Can I collect data from multiple platforms?

Yes, we can collect data from large numbers of websites at the same time.

### Can I add additional information to my Web Scraper?

Yes you can, you can ask your account manager for help, or you can open a ticket related to the specific Web Scraper by selecting 'Report an issue.' Then request that fields be added or removed from your Web Scraper.

### Any system limitations?

We have a limitation of 100 parallel-running jobs. When more than 100 jobs are triggered, the additional jobs are placed in a queue and wait until the earlier ones finish.

## Types of Scrapers

### What is a search scraper?

In cases where you don't know a specific URL, you can search for a term and get data based on that term.

### What is a discovery scraper?

With a discovery scraper, you enter a URL(s) and collect all data from that page(s). You'll receive data without having to specify a specific product or keyword.

### What is a Data Collector?

In the past, we referred to all of our scraping tools as "Collectors." A Collector is essentially a web scraper that consists of both interaction code and parser code. It can operate as an HTTP request or in a real browser, with all requests routed through our unlocker network to prevent blocking.

Over time, we developed a Dataset Unit that builds on top of one or more Collectors. For example, with a single Collector (direct request), you can scrape a specific URL—such as a product page from an e-commerce site—and receive the parsed data. In more complex scenarios, multiple Collectors can work together, such as when discovering and scraping categories, followed by collecting data on every product within those categories.

## Getting Started

### How to start using the Web Scraper?

There are two ways to use the data collection tool:

1. Develop a self-managed scraper on your own
2. Request a custom dataset

![Two ways of usage](https://mintlify.s3.us-west-1.amazonaws.com/brightdata/images/scraping-automation/web-scraping-ide/faqs/web-scraper-two-ways-of-usage.png)

### How to Create a Data Collector?

You have a few options to create and configure a Data Collector:

**Using the Web Scraper IDE**: You can design and structure your parser as individual Collectors or as a single Collector with multiple steps. To get started:
- Click on the "Web Data Collection" icon on the right.
- Navigate to the "My Scrapers" tab.
- Select the "Develop a Web Scraper (IDE)" button.
- From here, you can build from scratch or explore available templates for guidance. Start here: Create a Data Collector

**Requesting a Custom Dataset**: If you prefer us to handle it, you can request a custom dataset, and we'll create the Data Collectors needed to deliver it. To do this, click on the "Request Datasets" button under the "My Datasets" tab and choose the option that best suits your needs. Start here: Request a Custom Dataset

### Can I change the code in the IDE by myself?

Yes, the code is in JS, for self-managed scrapers you can change it according to your requirements.

## Running and Managing Scrapers

### What are the options to initiate requests?

We have 3 option to initiate requests:

1. Initiate by API - regular request, queue request and replace request.
2. Initiate manually.
3. Schedule mode

### What is a queue request?

When you are sending more than one API request, a "queue request" means that you'd like your next request to start automatically after your first request is completed, and so on with all other requests.

### What is a CPM?

CPM = 1000 page loads

### When building a scraper, what is considered as a billable event?

Billable events:
- navigate()
- request()
- load_more()
- (later) media file download

### How can I confirm that someone is working on the new Web Scraper I requested?

You'll receive an email that the developer is working on your new Web Scraper, and you will be notified when your scraper is ready.

Status of the request can also be found on your dashboard:

![Web Scraper Status](https://mintlify.s3.us-west-1.amazonaws.com/brightdata/images/scraping-automation/web-scraping-ide/faqs/web-scraper-status.png)

## Troubleshooting

### How to report an issue on the Web scraper IDE?

You can use this form to communicate any issues you have with the platform, the scraper, or the dataset results.

Tickets will be assigned to a different department depending on selected issue type. Please make sure to choose the most relevant type.*

1. Select a job ID: issued Dataset

![Job ID](https://mintlify.s3.us-west-1.amazonaws.com/brightdata/images/scraping-automation/web-scraping-ide/faqs/job-id.png)

2. Select a type of the issue

![Issue Category](https://mintlify.s3.us-west-1.amazonaws.com/brightdata/images/scraping-automation/web-scraping-ide/faqs/issue-category.png)

   - Data
   - Collection and Delivery
   - Other

3. (Parsing issues) Use the "bug" red icon to indicate where the incorrect results are

4. (Parsing issues) Enter the results you expect to receive

5. Write a description of what went wrong and the URL where the data is collected

6. If needed, attach an image to support your report

![Add More Context](https://mintlify.s3.us-west-1.amazonaws.com/brightdata/images/scraping-automation/web-scraping-ide/faqs/add-more-context.png)

### I updated input/output schema of my managed scraper. Can I use it while BrightData updates my scraper?

When input/output schema is updated, the scraper needs to be updated to match new schema. If the scraper is in work and not updated yet, you'll see 'Incompatible input/output schema' error.

![Via UI](https://mintlify.s3.us-west-1.amazonaws.com/brightdata/images/scraping-automation/web-scraping-ide/faqs/via-ui.png)

If you want to initiate it ignoring schema change, you can click 'Trigger anyway' on UI. API, you can add

- output schema incompatible: `override_incompatible_schema=1`
- input schema incompatible: `override_incompatible_input_schema=1`

parameter when triggering the scraper:

```bash
curl "https://api.brightdata.com/dca/trigger?scraper=ID_COLLECTOR&queue_next=1&override_incompatible_schema=1" -H "Content-Type: application/json" -H "Authorization: Bearer API_TOKEN" -d "[{\"url\":\"https://targetwebsite.com/product_id/\"}]"
```

### How can I debug real time scrapers?

We store the last 1000 errors inside the virtual job record so you can see example inputs that were wrong (there's a CP button to view the errors in the IDE).

The customer should already know which inputs were wrong because they got an 'error' response for them. You can re-run these manually in the IDE to see what happened. This is just like providing a CURL request example when the unblocker isn't behaving right.

### What should I do if I face an issue with a Web Scraper?

Select "Report an issue" from the Bright Data Control Panel. Once you report your issue, an automatic ticket will be assigned to one of our 14 developers that monitor all tickets on a daily basis. Make sure to provide details of what the problem is, and if you are not sure, please contact your account manager. Once you report an issue, you don't need to do anything else, and you'll receive an email confirming that the issue was reported.

![Three Dots Report an Issue](https://mintlify.s3.us-west-1.amazonaws.com/brightdata/images/scraping-automation/web-scraping-ide/faqs/three-dots-report-an-issue.png)
![Tabs Report an Issue](https://mintlify.s3.us-west-1.amazonaws.com/brightdata/images/scraping-automation/web-scraping-ide/faqs/tabs-report-an-issue.png)

### When "reporting an issue", what information should I include in my report?

Please provide the following information when reporting an issue:

- Select the type of problem you're facing (for example: getting the wrong results/missing data points/the results never loaded/delivery issue/ UI issue/scraper is slow/IDE issue/other)
- Please describe in detail the problem that you are facing
- You may upload a file that describes the problem

After reporting an issue, we'll automatically open a ticket that will be promptly handled by our R&D Department.
