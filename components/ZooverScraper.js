const rp = require('request-promise');
const cheerio = require('cheerio');

class ZooverScraper {
  constructor(url) {
    this.urls = url;
  }

  scrape(url) {
    const arr = [];

    return rp({
      url,
    }).then(body => {
      const $ = cheerio.load(body);
      const $wrapper = $('.review');

      for (let i = 0; i < 10; i++) {
        const data = {};

        data.reviewer = $wrapper
          .find('.reviewDate')
          .eq(i)
          .prev()
          .text();
        data.reviewDate = $wrapper
          .find('.reviewDate')
          .eq(i)
          .text();
        data.reviewHeader = $wrapper
          .find('.qaReviewTitle')
          .eq(i)
          .text();
        data.reviewBody = $wrapper
          .eq(i)
          .find('div')
          .eq(0)
          .next()
          .next()
          .find('div')
          .text();
        data.isReplied = $wrapper
          .find('div')
          .eq(3)
          .eq(i).length;
        data.reviewLink =
          'https://www.zoover.nl' +
          $wrapper
            .eq(i)
            .find('a')
            .eq(0)
            .attr('href');
        data.rating = parseInt(
          $wrapper
            .find('div[data-qa]')
            .find('span')
            .eq(i)
            .text(),
        );

        arr.push(data);
      }

      return arr;
    });
  }
}

module.exports = ZooverScraper;
