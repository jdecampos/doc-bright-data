# Functions

This article lists and explains the available commands within the Web Scraper IDE for writing scrapers.

## Function Reference Sections

Due to the extensive number of functions available, the complete reference has been divided into four parts:

1. [Functions Part 1](09%20-%20functions-part1.md) - Basic interaction functions (bad_input through freeze_page)
2. [Functions Part 2](09%20-%20functions-part2.md) - More interaction functions (hover through request)
3. [Functions Part 3](09%20-%20functions-part3.md) - Advanced interaction functions (right_click through track_event_listeners)
4. [Functions Part 4](09%20-%20functions-part4.md) - Final interaction functions and Parser functions

## Overview

The Web Scraper IDE provides two main types of functions:

### Interaction Functions

These functions are used in the Interaction code section of the IDE to navigate websites, interact with elements, and collect data. Commands marked with a star ⭐ are proprietary functions developed by Bright Data.

Key interaction function categories:
- Navigation and page control (navigate, click, type)
- Data collection (collect, parse)
- Multi-stage scraping (next_stage, run_stage)
- Waiting and timing (wait, wait_for_text)
- Special utilities (tag_response, solve_captcha)

### Parser Functions

These functions are used in the Parser code section of the IDE to extract and process data from the page HTML.

Key parser function categories:
- DOM selection and manipulation ($)
- Data extraction and formatting
- Special data types (Image, Video, Money)

## Browser Worker Compatibility

Note that some functions are only available when using Browser Workers. For a complete list of functions that are limited to Browser Workers, refer to the [Worker Types](07%20-%20worker-types.md#align-your-code-with-worker-type) documentation.

## Further Resources

For more information about how to use these functions effectively in your scraping projects, refer to:
- [The Basics of Web Scraping](02%20-%20basic.md)
- [Develop a Self-Managed Scraper](05%20-%20develop-a-self-managed-scraper-with-the-ide.md)
- [Worker Types](07%20-%20worker-types.md)
