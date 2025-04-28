# Initiate Data Collection & Delivery with IDE Scraper

Learn how to initiate data collection and set up delivery options using the IDE Scraper. Explore manual, API, and scheduled methods for efficient data scraping.

When writing a scraper code on the IDE, the system auto-saves the scraper as a draft to the development environment. From inside the IDE, you can run one page at a time to sample how your scraper will behave. To get a full production run, you need to save scraper to production by clicking the 'Save to production' button at the top right corner of the IDE screen. All scrapers will appear under the My scrapers tab in the control panel. Any inactive scraper will be shown in a faded state.

![Save to production](https://mintlify.s3.us-west-1.amazonaws.com/brightdata/images/scraping-automation/web-scraping-ide/initiate-collection-and-delivery-options/my-scrapers.png)

## Initiate Scraper

To start collecting the data, choose one of three options:

1. Initiate by API

You can start a data collection through API without accessing the Bright Data control panel: [Getting started with API documentation](#)

Before initiating an API request, please create an API token. To create an API token, go to:
Dashboard side menu settings > account settings > API tokens

![API token](https://mintlify.s3.us-west-1.amazonaws.com/brightdata/images/scraping-automation/web-scraping-ide/initiate-collection-and-delivery-options/initiate-manually.png)

### Set Up Inputs Manually

- **Provide input manually or through the API request**
- **Trigger behavior** - you can add several requests in parallel that are activated according to the order they're defined. You can add another job run to the queue and run more than two jobs simultaneously.
- **Preview of the API Request** - Bright Data provides you with a REST API call to initiate the scraper. Please select the "Linux Bash" viewer for CURL commands. As soon as you send the request, you will receive a job id.

You will receive the data according to the delivery preferences defined earlier.

> **Note**: Receive data API call is required in order to receive data when delivery preferences is set to API download



2. Initiate manually

Bright Data’s control panel makes it easy to get started collecting data.

![API token](https://mintlify.s3.us-west-1.amazonaws.com/brightdata/images/scraping-automation/web-scraping-ide/initiate-collection-and-delivery-options/initiate-manually.png)

- **Trigger behavior** - you can add several requests in parallel that are activated according to the order they’re defined. You can add another job run to the queue and run more than two jobs simultaneously.
- **Set up inputs manually** - If you’d like to add a large amount of input, the easiest way is to add them to a CSV file and upload it to the system. For example, a list of URLs.
- **Upload CSV file** - If you’d like to add a large amount of input, the easiest way is to add them to a CSV file and upload it to the system. For example, a list of URLs.
See the example provided for reference.


3. Schedule a scraper

Choose when to initiate the scraper.

Step One:

- **Choose a date and time for the scraper to start**
- **Select the frequency it will run (hourly, daily, weekly, etc.)**
- **Set a deadline for when a scraper is complete**
- **Review your setup**

![API token](https://mintlify.s3.us-west-1.amazonaws.com/brightdata/images/scraping-automation/web-scraping-ide/initiate-collection-and-delivery-options/schedule-configuration.png)

Step Two :

- **Add a large number of inputs to a CSV file**. For instance, a list of URLs. To upload easily without errors, you can download a template of a CSV structure example.
- **Set up Inputs manually**

![API token](https://mintlify.s3.us-west-1.amazonaws.com/brightdata/images/scraping-automation/web-scraping-ide/initiate-collection-and-delivery-options/enter-input.png)



## Delivery Options

You can set your delivery preferences for the dataset. To do that simply click on the scraper row from the 'My scrapers' tab and then click on 'Delivery preferences'

![Delivery preferences](https://mintlify.s3.us-west-1.amazonaws.com/brightdata/images/scraping-automation/web-scraping-ide/initiate-collection-and-delivery-options/enter-input.png)

### Choose when to get the data

![When to get data](https://mintlify.s3.us-west-1.amazonaws.com/brightdata/images/scraping-automation/web-scraping-ide/initiate-data-collection-delivery/when-to-get-data.png)

### Choose file format

![File format](https://mintlify.s3.us-west-1.amazonaws.com/brightdata/images/scraping-automation/web-scraping-ide/initiate-data-collection-delivery/file-format.png)

### Choose how to receive the data

![How to receive data](https://mintlify.s3.us-west-1.amazonaws.com/brightdata/images/scraping-automation/web-scraping-ide/initiate-data-collection-delivery/how-to-receive-data.png)

### Choose result format

![Result format](https://mintlify.s3.us-west-1.amazonaws.com/brightdata/images/scraping-automation/web-scraping-ide/initiate-data-collection-delivery/result-format.png)

### Define notifications

![Notifications](https://mintlify.s3.us-west-1.amazonaws.com/brightdata/images/scraping-automation/web-scraping-ide/initiate-data-collection-delivery/notifications.png)

## Output Schema

Schema defines the data point structure and how the data will be organized. You can change the schema structure and modify the data points to suit your needs, re-order, set default values, and add additional data to your output configuration. You can add new field names by going into the advanced settings and editing the code.

![Output schema](https://mintlify.s3.us-west-1.amazonaws.com/brightdata/images/scraping-automation/web-scraping-ide/initiate-data-collection-delivery/output-schema.png)

- **Input / Output schema** - choose the tab you'd like to configure
- **Custom validation** - validate the schema
- **Parsed data** - data points collected by the scraper
- **Add new field** - if you need additional data point, you can add fields and define field name and type
- **Additional data** - additional information you can add to the schema (timestamp, screenshot, etc.)
