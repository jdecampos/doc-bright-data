# Complete Web Scraper IDE Examples

Explore comprehensive examples of web scraping using the Web Scraper IDE, including code for interaction, parsing, handling multiple results, and advanced techniques.

## Introduction

The collect and parse commands have been removed. The data will be returned from parser code as an object or array, and it will be automatically saved to the output.

#### Interaction code


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
New commands have been added to provide access to the data from the interaction code: tag_html, tag_request, tag_graphql

In addition, some existing commands have been updated: tag_response, tag_sitemap, tag_all_responses. See IDE documentation for more details.

When using any tag commands, you can provide a custom name. You can then access the data using this name in the parser code under parser.YOUR_KEY.

For tag_html, current browser location URL will be saved under parser.YOUR_KEY_url.

For simple cases when only a single tag_html is needed, it can be skipped, and it will be automatically saved under parser.page.

#### Interaction code


```javascript
navigate("https://example.com/1");
tag_html("page1");
navigate("https://example.com/2");
tag_html("page2");
navigate("https://example.com/3");
tag_html("page3");
```

#### Parser code
```javascript
{page1, page1_url, page2, page2_url, page3, page3_url} = parser;
let $ = html_load(page2);
return {
  title2: $('h1').text(),
};
```

Sometimes, it’s necessary to get parsed data within the interaction code and use it to make request. See examples how to do it:

#### Interaction code
```javascript
navigate("https://example.com/1");
tag_html("page1");
let page_html = html();
let page_html2 = wait_for_parser_value("page1"); // the same
let $ = load_html(page_html);
let req_id = $('.product-id').text();
tag_request("product_json", {url: "https://example.com/product/"+req_id});
```

#### Parser code
```javascript
{product_json} = parser;
return product_json;
```

## Multiple results

To collect multiple results, array can be returned from the parser code.

#### Interaction code
```javascript
navigate("https://example.com/products");
```

#### Parser code
```javascript
let items = $(".product").toArray().map(v=>$(v)).map(v=>({
  title: v.find(".title").text(),
  price: v.find(".price").text(),
  url: new URL(v.find("a").attr("href")),
}));
return items;
```

### Reparse

Reparse is a new feature that allows to reparse the data that was already collected. It can be useful when you want to change the parser code without rerunning the entire interaction code:

#### next_stage and rerun_stage

When scraper has more than one step, the parser code is only available in the last step. All other steps can only have next_stage calls. To parse something from the page, load_html should be used:

#### Interaction code 1
```javascript
return $('a[data-qa-action="product-click"]').toArray()
  .map(v => ({url: new URL($(v).attr('href'))}));
```

#### Interaction code 2
```javascript
block(['*.ico', '*.png', '*.jpg', '/images/', '*gif']);
navigate(input.url);
wait('.view-option-selector-button, .product-groups_empty-list');
if(el_exists('.product-groups_empty-list'))
  dead_page('There are no products in this category')
wait('[aria-describedby="onetrust-policy-text"]');
click('button#onetrust-reject-all-handler');
wait_hidden('[aria-describedby="onetrust-policy-text"]');
$('.view-option-selector-button').eq(2).click();
wait_page_idle(2000);
scroll_to('bottom');
wait_page_idle(2000);
```

#### Parser code
```javascript
return $('a[data-qa-action="product-click"]').toArray()
  .map(v => ({url: new URL($(v).attr('href'))}));
```

### Basic PDP scraper

#### Interaction code
```javascript
let url = new URL(input.url.replace('https://www.slintel.com','https://6sense.com'));
url = new URL(url.pathname, 'https://6sense.com');
navigate(url);
if (location.href === 'https://6sense.com/company')
  dead_page(`Page not found`);
tag_html('html');
```

#### Parser code
```javascript
const $ = html_load(parser.html)
const nextData = JSON.parse($('#__NEXT_DATA__').html());
const pageProps = nextData.props.pageProps;
const companyInfo = pageProps.company_data.companyInfo;

const linkedin = companyInfo.linkedin ?
  (companyInfo.linkedin.includes('http') ? companyInfo.linkedin :
    'https://'+companyInfo.linkedin) : null;
const techCategories = pageProps.company_data?.technologies_mapper_view?.categories
  ? Object.values(pageProps.company_data.technologies_mapper_view.categories).map(v => Object.keys(v)).flat()
  : null;
const pageData = {
    "name": companyInfo.name,
    "about": companyInfo.company_description,
    "num_employees": companyInfo.employee_range,
    "type": companyInfo.company_type,
    "industries": companyInfo.industry_v2_ranked.filter(v=>v),
    "techstack_arr": techCategories,
    "country_code": companyInfo.country,
    "website": companyInfo.display_domain
      ? new URL(companyInfo.display_domain.includes('http')
          ? companyInfo.display_domain
          : 'https://'+companyInfo.display_domain)
      : null,
    "social_media_urls": linkedin,
    "company_news": pageProps.company_data.company_news.map(v=>({
      title: "company_news_data",
      date: "",
      link: "",
    })),
    "last_updated": new Date(companyInfo.last_updated_at*1e3),
    "url": new URL(parser.html_url),
    "logo": companyInfo.logo,
    "location": companyInfo.location,
    "region": [companyInfo.country, companyInfo.state].filter(v=>v).join(', '),
    "id": nextData.query.companyid,
    "slintel_resources": companyInfo.recommended_companies.map(v=>({
      link: v.display_domain ? new URL(v.display_domain.includes('http') ? v.display_domain : 'https://'+v.display_domain) : null,
      title: v.name,
      type: v.company_type,
    })),
    "stock_symbol": companyInfo.stock_symbol,
};
return pageData;
```

### Multiple navigates example

#### Interaction code
```javascript
const tabs = [
  'topactivity',
  'answers',
  'questions',
  'tags',
  'articles',
  'badges',
  'bookmarks',
  'bounties'
];
function loadTab(url, name) {
  return new Promise(async (resolve, reject)=>{
    try {
        const tabUrl = new URL(url);
        tabUrl.searchParams.set('tab', name);
        navigate(tabUrl, { allow_status: [404] });
        const html_ = html();
        tag_html(name);
        resolve(html_);
    } catch(e) { reject(e); }
  });
}
const userIdFromUrl = (input.url && input.url.includes('https://stackoverflow.com/users/'))
    ? input.url.replace('https://stackoverflow.com/users/', '').split('/').shift()
    : null;
const userId = input.user_id || userIdFromUrl || 1;
const userUrl = `https://stackoverflow.com/users/${userId}`;
navigate(userUrl, { allow_status: [404] });
tag_html('user');
Promise.all(tabs.map( async tabName => loadTab(userUrl, tabName)));
```

#### Parser code
```javascript
const steps = [
  'user',
  'topactivity',
  'answers',
  'questions',
  'tags',
  'articles',
  'badges',
  'bookmarks',
  'bounties',
  'finally'
];
const parse = Handlers();
let missed_parser_data = Object.keys(parse)
  .filter(handler_key=>!steps.find(sk=> sk == handler_key));
if (missed_parser_data.length)
    throw new Error('missed parser data')

return steps.reduce((acc, step) => {
    console.log('handling: '+step)
    if (step=='finally')
        return parse.finally(acc);
    let page_source = parser[step];
    console.log(parser[step]);
    console.log('parser[step]');
    if (!page_source)
      throw('unexpected empty data, data not saved')
    const $ = html_load(page_source);
    const data_chunk = parse[step]($);
    acc = { ...acc, ...data_chunk };
    return acc;
}, {});

function Handlers() {
  return {
    'finally': (res) =>{
      res.url = new URL(res.url);
      res.answers.map(v => v.tags = res.tags);
      res.answers.map(v => v.url = new URL(v.url));
      res.questions.map(v => v.url = new URL(v.url));
      res.top_posts.map(v => v.date = new Date(v.date));
      res.active_from = new Date(res.active_from)
      return res;
    },
    'user': ($)=>{
      const grid = $('#main-content .d-grid > .grid--item')
        .toArray().map(v=>$(v));
      let collectives = grid.find(v=>v.find('> div').text()
        .includes('Collectives'));
      if (collectives?.length) {
          collectives = collectives.find('.fl1').toArray()
          .map(v=>({
              name: $(v).find('.fs-body2').text_sane() || null,
              text: $(v).find('.fs-caption').text_sane() || null,
          }));
      }
      else
        collectives = [];
      let communities = grid.find(v=>v.find('> div').text()
        .includes('Communities'));
      if (communities?.length) {
          communities = communities.find('li.flex--item')
            .toArray().map(v=>({
              name: $(v).find('.fl-grow1').text_sane() || null,
              score: $(v).find('.fl-shrink0').text_sane()
                .replace(/,/gm, '') || null,
            }));
      }
      else
        communities = [];
      let badges = $('.flex__fl-equal > .flex--item').toArray()
        .map(v=>{
          let $v = $(v);
          return {
              badge_type: $v.find('.mr12 .fc-gold').length
                ? 'gold'
                : $v.find('.mr12 .fc-silver').length
                    ? 'silver'
                    : $v.find('.mr12 .fc-bronze').length
                        ? 'bronze'
                        : 'unknown',
              badge_name: $v.find('.fs-caption').text_sane()
                .replace(' badges', '') || null,
              number_of_badges: $v.find('.fs-title').text()
                .replace(/,/gm, '') || null,
              badges: $v.find('a.badge').toArray().map(b=>({
                  name: $(b).text_sane() || null,
                  description: $(b).attr('title') || null
              }))
          };
      });
      return {
        url: new URL(parser.user_url),
        id: parser.user_url.split('/').pop(),
        'id#': (input.url && input.url
            .includes('https://stackoverflow.com/users/'))
            ? input.url?.match(/https:\/\/stackoverflow.com/users/(d{1,15}).*/)?.[1]/gm)
            : input.user_id
          || 1,
        user_id: +$('[property="og:url"]').attr('content')
          .match(/https:\/\/stackoverflow.com/users/(d{1,15}).*/)?.[1]/)/gm
            || +input.url?.match(/https:\/\/stackoverflow.com/users/(d{1,15}).*/)?.[1]/gm)
            || +input.user_id
            || null,
        name: $('.fs-headline2').text_sane() || null,
        type: $('#mainbar-full > div:first-child .s-badge')
          .text_sane() || null,
        title: $('#mainbar-full > div:first-child .fs-title')
          .text_sane() || null,
        active_from: new Date(
          $('#mainbar-full > div:first-child .list-reset span[title]').attr('title')),
        last_seen: $('#mainbar-full > div:first-child .fs-title + ul li:last-child')
          .text_sane() || null,
        linkes: $('#mainbar-full > div:first-child ul.list-reset:last-child a')
          .toArray().map(v => $(v).attr('href')),
        location: $('#mainbar-full > div:first-child ul.list-reset:last-child li:last-child div[title]')
          .attr('title') || null,
        stats: $('#stats .flex--item').toArray()
          .map(v => $(v).text_sane()).filter(v => v),
        about: $('#main-content .s-prose p').toArray()
          .map(v => $(v).text_sane()) || null, //.join('\r'),
        collectives,
        communities,
        badges,
        top_tags: $('#top-tags .p12').toArray().map(v=>({
            name: $(v).find('.s-tag').text_sane() || null,
            score: $(v).find('.d-flex > .d-flex:nth-child(1)')
              .text_sane().replace(' Score', '')
              .replace(/,/gm, '') || null,
            posts: $(v).find('.d-flex > .d-flex:nth-child(2)')
              .text_sane().replace(' Posts', '')
              .replace(/,/gm, '') || null,
            posts_percent: $(v).find('.d-flex > .d-flex:nth-child(3)')
              .text_sane().replace(' Posts %', '').replace(/,/gm, ''),
        })),
        top_posts: $('#js-top-posts .p12 .d-flex').toArray().map(v=>({
            type: $(v).find('.iconQuestion').length ? 'question'
              : ($(v).find('.iconAnswer').length ? 'answer' : 'none'),
            score: $(v).find('.s-badge').text_sane()
              .replace(/,/gm, '') || null,
            text: $(v).find('a.d-table')
              .text_sane() || null,
            date: new Date($(v).find('.relativetime')
              .attr('title')),
        })),
        top_meta_posts: $('#js-top-posts + div .p12 .d-flex')
          .toArray().map(v=>({
            score: $(v).find('.s-badge').text_sane()
              .replace(/,/gm, '') || null,
            text: $(v).find('a.d-table').text_sane() || null,
        })),
        top_network_posts: $('#js-top-posts + div + div .p12 .d-flex')
          .toArray().map(v=>({
            score: $(v).find('.s-badge').text_sane()
              .replace(/,/gm, '') || null,
            text: $(v).find('a.d-table').text_sane() || null,
        }))
      };
    },
    'topactivity': ($) => {
        let summary_graph_data;
        try {
            summary_graph_data = JSON.parse(
              /graphDatas[^[]+([[^]]+])/gm.exec(
                $('*').first().html())?.[1]);
        } catch(e) {
            console.log('graphData not found')
        }
        let [summary_people_reached, summary_posts_edited,
          summary_helpful_flags, summary_votes_cast] =
          $('div:not(.js-highlight-box-reputation) > h1.flex--item + div .flex--item .fs-body3')
            .toArray().map(v=>$(v).text_sane().replace(/,/gm, '') || null);
        return {
            summary_reputation: +$('#top-cards h4.fs-headline1')
              .text().replace(/D+/gm, ''),
            summary_top_overall: $('a[href*="alltime"]')
              .first().text_sane() || null,
            summary_next_tag_badge: $('#rep-card-next-tag-badge a')
              .text_sane() || null,
            summary_graph_data,
            summary_next_tag_score:
              $('div.fl-shrink1 + div.fl-grow1 .fs-fine')
                .first().text_sane().replace(/,/gm, '') || null,
            summary_next_tag_answers:
              $('div.fl-shrink1 + div.fl-grow1 .fs-fine')
                .last().text_sane().replace(/,/gm, '') || null,
            summary_badges: $('h3 +div .s-badge').toArray()
              .map(v => $(v).attr('title')).join(', '),
            summary_last_badge: $('#badge-card-last').text_sane() || null,
            summary_next_badge: {
                name: $('#js-badge-card-next').text_sane() || null,
                progress: $('h4.flex--item.ws-nowrap + span')
                  .text_sane() || null
            },
            summary_people_reached,
            summary_posts_edited,
            summary_helpful_flags,
            summary_votes_cast,
        };
    },
    'answers': ($) => {
        return {
            answers: $('#js-post-summaries .s-post-summary')
              .toArray().map(p=>{
                let $p = $(p);
                return {
                    id: $p.attr('data-post-id') || null,
                    votes: $p.find('.s-post-summary--stats-item-number')
                      .text().replace(/,/gm, '') || null,
                    accepted: !!$p.find('svg.iconCheckmarkSm').length,
                    url: new URL($p.find('.answer-hyperlink')
                      .attr('href'), location.href),
                    text: $p.find('.answer-hyperlink').text_sane() || null,
                    tags: $p.find('.post-tag').toArray()
                      .map(v => $(v).text_sane() || null ).map(name=>({name}))
                };
            }),
        }
    },
    'questions': ($) => {
        return {
            questions: $('#js-post-summaries .s-post-summary')
              .toArray().map(p=>{
                let $p = $(p);
                return {
                    id: $p.attr('data-post-id') || null,
                    votes: $p.find('.s-post-summary--stats-item-number')
                      .text().replace(/,/gm, '') || null,
                    accepted: !!$p.find('svg.iconCheckmarkSm').length,
                    answer_count:
                      $p.find('.s-post-summary--stats-item:nth-child(2) .s-post-summary--stats-item-number')
                      .text_sane().replace(/,/gm, '') || null,
                    url: new URL($p.find('.s-link').attr('href'),
                      location.href),
                    text: $p.find('.s-link').text_sane() || null,
                    tags: $p.find('.post-tag').toArray()
                      .map(v => $(v).text_sane() || null)
                };
            }),
        };
    },
    'tags': ($) => {
        return {
            tags: $('#user-tab-tags .ba .p12').toArray()
              .map(v=>$(v)).map(v=>({
                name: v.find('.post-tag').text_sane() || null,
                badge: v.find('.badge-tag').attr('title') || null,
                description: v.attr('title') || null,
                score: v.find('.flex--item:first-child > .fs-body3')
                  .text_sane().replace(/,/gm, '') || null,
                posts: v.find('.flex--item:last-child > .fs-body3')
                  .text_sane().replace(/,/gm, '') || null,
            })),
        };
    },
    'articles': ($) => {
        return {
            articles_count: $('h2.fs-title').text()
              .replace(/D+/gm, '') || null
        };
    },
    'badges': ($) => {
        return {
            badges: $('#user-tab-badges .grid--item').toArray()
              .map(v => ({
                name: $(v).find('.mbn4').text_sane() || null,
                count: $(v).find('.ml4').text_sane()
                  .replace(/D+/gm, '') || 0
              })),
        };
    },
    'bookmarks': ($) => {
        return {
            bookmarks: $('#js-post-summaries .s-post-summary')
              .toArray().map(p=>{
                let $p = $(p);
                return {
                    id: $p.attr('data-post-id'),
                    votes:
                      $p.find('.s-post-summary--stats-item__emphasized .s-post-summary--stats-item-number')
                        .text_sane().replace(/,/gm, '') || null,
                    views: $p.find('.is-supernova .s-post-summary--stats-item-number')
                      .text_sane().replace(/,/gm, '') || null,
                    accepted: !!$p.find('svg.iconCheckmarkSm').length,
                    answer_count: $p.find('.s-post-summary--stats-item:nth-child(2) .s-post-summary--stats-item-number')
                      .text_sane().replace(/,/gm, '') || null,
                    url: new URL($p.find('.s-link').attr('href'),
                      location.href).href,
                    text: $p.find('.s-link').text_sane() || null,
                    tags: $p.find('.post-tag').toArray()
                      .map(v => $(v).text_sane() || null)
                };
            })
        };
    },
    'bounties': ($) => {
        return {
            bounties_count: $('h2.fs-title').text()
              .replace(/D+/gm, '') || null
        };
    },
  }
}
```

### Multiple tag_response commands

#### Interaction code 

```javascript
close_popup('._1piuevz', '._1piuevz');
tag_response('stay', /\/StaysPdpSections/);
tag_response('calendar', /\/PdpAvailabilityCalendar/);
tag_response('reviews', /api\/v3\/StaysPdpReviews/);
navigate(input.url+'?enable_auto_translate=false#availability-calendar');
if (el_exists('img[src*="error_pages/404"]'))
  return dead_page('Page not found');
const room_id = /\/(\d+)(?:\?|$)/.exec(input.url)?.[1];
if (el_exists('._wgmchy ._1qx9l5ba'))
  click('._wgmchy ._1qx9l5ba');
wait('#data-state, #data-deferred-state',{timeout: 6e4});
wait_for_parser_value('stay');
wait_for_parser_value('calendar');
wait_for_parser_value('reviews');
tag_html('html');
```

#### Parser code

```javascript
const steps = [
  'user',
  'topactivity',
  'answers',
  'questions',
  'tags',
  'articles',
  'badges',
  'bookmarks',
  'bounties',
  'finally'
];
const parse = Handlers();
let missed_parser_data = Object.keys(parse)
  .filter(handler_key=>!steps.find(sk=> sk == handler_key));
if (missed_parser_data.length)
    throw new Error('missed parser data')

return steps.reduce((acc, step) => {
    console.log('handling: '+step)
    if (step=='finally')
        return parse.finally(acc);
    let page_source = parser[step];
    console.log(parser[step]);
    console.log('parser[step]');
    if (!page_source)
      throw('unexpected empty data, data not saved')
    const $ = html_load(page_source);
    const data_chunk = parse[step]($);
    acc = { ...acc, ...data_chunk };
    return acc;
}, {});

function Handlers() {
  return {
    'finally': (res) =>{
      res.url = new URL(res.url);
      res.answers.map(v => v.tags = res.tags);
      res.answers.map(v => v.url = new URL(v.url));
      res.questions.map(v => v.url = new URL(v.url));
      res.top_posts.map(v => v.date = new Date(v.date));
      res.active_from = new Date(res.active_from)
      return res;
    },
    'user': ($)=>{
      const grid = $('#main-content .d-grid > .grid--item')
        .toArray().map(v=>$(v));
      let collectives = grid.find(v=>v.find('> div').text()
        .includes('Collectives'));
      if (collectives?.length) {
          collectives = collectives.find('.fl1').toArray()
          .map(v=>({
              name: $(v).find('.fs-body2').text_sane() || null,
              text: $(v).find('.fs-caption').text_sane() || null,
          }));
      }
      else
        collectives = [];
      let communities = grid.find(v=>v.find('> div').text()
        .includes('Communities'));
      if (communities?.length) {
          communities = communities.find('li.flex--item')
            .toArray().map(v=>({
              name: $(v).find('.fl-grow1').text_sane() || null,
              score: $(v).find('.fl-shrink0').text_sane()
                .replace(/,/gm, '') || null,
            }));
      }
      else
        communities = [];
      let badges = $('.flex__fl-equal > .flex--item').toArray()
        .map(v=>{
          let $v = $(v);
          return {
              badge_type: $v.find('.mr12 .fc-gold').length
                ? 'gold'
                : $v.find('.mr12 .fc-silver').length
                    ? 'silver'
                    : $v.find('.mr12 .fc-bronze').length
                        ? 'bronze'
                        : 'unknown',
              badge_name: $v.find('.fs-caption').text_sane()
                .replace(' badges', '') || null,
              number_of_badges: $v.find('.fs-title').text()
                .replace(/,/gm, '') || null,
              badges: $v.find('a.badge').toArray().map(b=>({
                  name: $(b).text_sane() || null,
                  description: $(b).attr('title') || null
              }))
          };
      });
      return {
        url: new URL(parser.user_url),
        id: parser.user_url.split('/').pop(),
        'id#': (input.url && input.url
            .includes('https://stackoverflow.com/users/'))
            ? input.url?.match(/https:\/\/stackoverflow.com/users/(d{1,15}).*/)?.[1]/gm)
            : input.user_id
          || 1,
        user_id: +$('[property="og:url"]').attr('content')
          .match(/https:\/\/stackoverflow.com/users/(d{1,15}).*/)?.[1]/)/gm
            || +input.url?.match(/https:\/\/stackoverflow.com/users/(d{1,15}).*/)?.[1]/gm)
            || +input.user_id
            || null,
        name: $('.fs-headline2').text_sane() || null,
        type: $('#mainbar-full > div:first-child .s-badge')
          .text_sane() || null,
        title: $('#mainbar-full > div:first-child .fs-title')
          .text_sane() || null,
        active_from: new Date(
          $('#mainbar-full > div:first-child .list-reset span[title]').attr('title')),
        last_seen: $('#mainbar-full > div:first-child .fs-title + ul li:last-child')
          .text_sane() || null,
        linkes: $('#mainbar-full > div:first-child ul.list-reset:last-child a')
          .toArray().map(v => $(v).attr('href')),
        location: $('#mainbar-full > div:first-child ul.list-reset:last-child li:last-child div[title]')
          .attr('title') || null,
        stats: $('#stats .flex--item').toArray()
          .map(v => $(v).text_sane()).filter(v => v),
        about: $('#main-content .s-prose p').toArray()
          .map(v => $(v).text_sane()) || null, //.join('\r'),
        collectives,
        communities,
        badges,
        top_tags: $('#top-tags .p12').toArray().map(v=>({
            name: $(v).find('.s-tag').text_sane() || null,
            score: $(v).find('.d-flex > .d-flex:nth-child(1)')
              .text_sane().replace(' Score', '')
              .replace(/,/gm, '') || null,
            posts: $(v).find('.d-flex > .d-flex:nth-child(2)')
              .text_sane().replace(' Posts', '')
              .replace(/,/gm, '') || null,
            posts_percent: $(v).find('.d-flex > .d-flex:nth-child(3)')
              .text_sane().replace(' Posts %', '').replace(/,/gm, ''),
        })),
        top_posts: $('#js-top-posts .p12 .d-flex').toArray().map(v=>({
            type: $(v).find('.iconQuestion').length ? 'question'
              : ($(v).find('.iconAnswer').length ? 'answer' : 'none'),
            score: $(v).find('.s-badge').text_sane()
              .replace(/,/gm, '') || null,
            text: $(v).find('a.d-table')
              .text_sane() || null,
            date: new Date($(v).find('.relativetime')
              .attr('title')),
        })),
        top_meta_posts: $('#js-top-posts + div .p12 .d-flex')
          .toArray().map(v=>({
            score: $(v).find('.s-badge').text_sane()
              .replace(/,/gm, '') || null,
            text: $(v).find('a.d-table').text_sane() || null,
        })),
        top_network_posts: $('#js-top-posts + div + div .p12 .d-flex')
          .toArray().map(v=>({
            score: $(v).find('.s-badge').text_sane()
              .replace(/,/gm, '') || null,
            text: $(v).find('a.d-table').text_sane() || null,
        }))
      };
    },
    'topactivity': ($) => {
        let summary_graph_data;
        try {
            summary_graph_data = JSON.parse(
              /graphDatas[^[]+([[^]]+])/gm.exec(
                $('*').first().html())?.[1]);
        } catch(e) {
            console.log('graphData not found')
        }
        let [summary_people_reached, summary_posts_edited,
          summary_helpful_flags, summary_votes_cast] =
          $('div:not(.js-highlight-box-reputation) > h1.flex--item + div .flex--item .fs-body3')
            .toArray().map(v=>$(v).text_sane().replace(/,/gm, '') || null);
        return {
            summary_reputation: +$('#top-cards h4.fs-headline1')
              .text().replace(/D+/gm, ''),
            summary_top_overall: $('a[href*="alltime"]')
              .first().text_sane() || null,
            summary_next_tag_badge: $('#rep-card-next-tag-badge a')
              .text_sane() || null,
            summary_graph_data,
            summary_next_tag_score:
              $('div.fl-shrink1 + div.fl-grow1 .fs-fine')
                .first().text_sane().replace(/,/gm, '') || null,
            summary_next_tag_answers:
              $('div.fl-shrink1 + div.fl-grow1 .fs-fine')
                .last().text_sane().replace(/,/gm, '') || null,
            summary_badges: $('h3 +div .s-badge').toArray()
              .map(v => $(v).attr('title')).join(', '),
            summary_last_badge: $('#badge-card-last').text_sane() || null,
            summary_next_badge: {
                name: $('#js-badge-card-next').text_sane() || null,
                progress: $('h4.flex--item.ws-nowrap + span')
                  .text_sane() || null
            },
            summary_people_reached,
            summary_posts_edited,
            summary_helpful_flags,
            summary_votes_cast,
        };
    },
    'answers': ($) => {
        return {
            answers: $('#js-post-summaries .s-post-summary')
              .toArray().map(p=>{
                let $p = $(p);
                return {
                    id: $p.attr('data-post-id') || null,
                    votes: $p.find('.s-post-summary--stats-item-number')
                      .text().replace(/,/gm, '') || null,
                    accepted: !!$p.find('svg.iconCheckmarkSm').length,
                    url: new URL($p.find('.answer-hyperlink')
                      .attr('href'), location.href),
                    text: $p.find('.answer-hyperlink').text_sane() || null,
                    tags: $p.find('.post-tag').toArray()
                      .map(v => $(v).text_sane() || null ).map(name=>({name}))
                };
            }),
        }
    },
    'questions': ($) => {
        return {
            questions: $('#js-post-summaries .s-post-summary')
              .toArray().map(p=>{
                let $p = $(p);
                return {
                    id: $p.attr('data-post-id') || null,
                    votes: $p.find('.s-post-summary--stats-item-number')
                      .text().replace(/,/gm, '') || null,
                    accepted: !!$p.find('svg.iconCheckmarkSm').length,
                    answer_count:
                      $p.find('.s-post-summary--stats-item:nth-child(2) .s-post-summary--stats-item-number')
                      .text_sane().replace(/,/gm, '') || null,
                    url: new URL($p.find('.s-link').attr('href'),
                      location.href),
                    text: $p.find('.s-link').text_sane() || null,
                    tags: $p.find('.post-tag').toArray()
                      .map(v => $(v).text_sane() || null)
                };
            }),
        };
    },
    'tags': ($) => {
        return {
            tags: $('#user-tab-tags .ba .p12').toArray()
              .map(v=>$(v)).map(v=>({
                name: v.find('.post-tag').text_sane() || null,
                badge: v.find('.badge-tag').attr('title') || null,
                description: v.attr('title') || null,
                score: v.find('.flex--item:first-child > .fs-body3')
                  .text_sane().replace(/,/gm, '') || null,
                posts: v.find('.flex--item:last-child > .fs-body3')
                  .text_sane().replace(/,/gm, '') || null,
            })),
        };
    },
    'articles': ($) => {
        return {
            articles_count: $('h2.fs-title').text()
              .replace(/D+/gm, '') || null
        };
    },
    'badges': ($) => {
        return {
            badges: $('#user-tab-badges .grid--item').toArray()
              .map(v => ({
                name: $(v).find('.mbn4').text_sane() || null,
                count: $(v).find('.ml4').text_sane()
                  .replace(/D+/gm, '') || 0
              })),
        };
    },
    'bookmarks': ($) => {
        return {
            bookmarks: $('#js-post-summaries .s-post-summary')
              .toArray().map(p=>{
                let $p = $(p);
                return {
                    id: $p.attr('data-post-id'),
                    votes:
                      $p.find('.s-post-summary--stats-item__emphasized .s-post-summary--stats-item-number')
                        .text_sane().replace(/,/gm, '') || null,
                    views: $p.find('.is-supernova .s-post-summary--stats-item-number')
                      .text_sane().replace(/,/gm, '') || null,
                    accepted: !!$p.find('svg.iconCheckmarkSm').length,
                    answer_count: $p.find('.s-post-summary--stats-item:nth-child(2) .s-post-summary--stats-item-number')
                      .text_sane().replace(/,/gm, '') || null,
                    url: new URL($p.find('.s-link').attr('href'),
                      location.href).href,
                    text: $p.find('.s-link').text_sane() || null,
                    tags: $p.find('.post-tag').toArray()
                      .map(v => $(v).text_sane() || null)
                };
            })
        };
    },
    'bounties': ($) => {
        return {
            bounties_count: $('h2.fs-title').text()
              .replace(/D+/gm, '') || null
        };
    },
  }
}
```
