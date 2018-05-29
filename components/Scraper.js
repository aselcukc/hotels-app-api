const rp = require('request-promise');
const cheerio = require('cheerio');

class Scraper {
  constructor(url) {
    this.urls = url;
    this.count = 1;
  }

  /* scrapeTripAdvisor(url) {
    let arr = [];

    return rp({
      url: url,
    }).then(body => {
      const $ = cheerio.load(body);
      const $wrapper = $('.rev_wrap');

      for (let i = 0; i < 5; i++) {
        const data = {};
        const obj = {};

        obj.reviewer = $wrapper
          .find('.info_text')
          .eq(i)
          .children()
          .text();
        obj.reviewDate = $wrapper
          .find('.ratingDate')
          .eq(i)
          .text();
        obj.reviewHeader = $wrapper
          .find('.noQuotes')
          .eq(i)
          .text();
        obj.reviewBody = $wrapper
          .find('.partial_entry')
          .eq(i)
          .text();

        obj.reviewLink =
          'https://www.tripadvisor.com.tr' +
          $wrapper
            .find('.quote')
            .find('a')
            .attr('href');
        obj.ratingClass = $wrapper.find('.ui_bubble_rating').attr('class');

        data[`review_${this.count}`] = obj;
        arr.push(data);
        this.count++;
      }

      return arr;
    });
  } */

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
            .attr('href');
        data.ratingClass = $wrapper.find('.ui_bubble_rating').attr('class');

        arr.push(data);
      }

      return arr;
    });
  }
}

module.exports = Scraper;
