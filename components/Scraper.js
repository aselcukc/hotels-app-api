const rp = require('request-promise');
const cheerio = require('cheerio');

class Scraper {
  constructor(url) {
    this.urls = url;
    this.count = 1;
  }

  scrapeTripAdvisor(url) {
    let arr = [];

    return rp({
      url: url,
    }).then(body => {
      const $ = cheerio.load(body);
      const $wrapper = $('.rev_wrap');

      for (let i = 0; i < 5; i++) {
        const data = {};

        data.reviewer = $wrapper
          .find('.info_text')
          .eq(i)
          .children()
          .text();
        data.reviewDate = $wrapper
          .find('.ratingDate')
          .eq(i)
          .text();
        data.reviewHeader = $wrapper
          .find('.noQuotes')
          .eq(i)
          .text();
        data.reviewBody = $wrapper
          .find('.partial_entry')
          .eq(i)
          .text();

        data.reviewLink =
          'https://www.tripadvisor.com.tr' +
          $wrapper
            .find('.quote')
            .find('a')
            .eq(i)
            .attr('href');

        const ratingVal = parseInt(
          $wrapper
            .find('.ui_bubble_rating')
            .eq(i)
            .attr('class')
            .split(' ')[1]
            .split('_')[1],
          10,
        );

        data.rating = ratingVal / 10;

        arr.push(data);
      }

      return arr;
    });
  }
}

module.exports = Scraper;
