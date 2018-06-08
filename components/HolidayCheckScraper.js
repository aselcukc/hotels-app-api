const rp = require('request-promise');
const cheerio = require('cheerio');

class HolidayCheckScraper {
  constructor(url) {
    this.urls = url;
  }

  async scrape(url) {
    try {
      const arr = [];
      const body = await rp({ url });
      const $ = cheerio.load(body);
      const $wrapper = $('.hotel-review-item');

      for (let i = 0; i < 10; i++) {
        const data = {};

        data.reviewLink = url;
        data.reviewer = $wrapper
          .find('.hotelReviewHeader-firstName')
          .eq(i)
          .text();
        data.reviewDate = $wrapper
          .find('.travel-info')
          .eq(i)
          .find('span')
          .eq(0)
          .next()
          .find('span')
          .text();
        data.reviewHeader = $wrapper
          .find('.hotelReviewHeader-title')
          .eq(i)
          .text();
        data.reviewBody = $wrapper
          .find('.clamping-text-content')
          .eq(i)
          .text();
        data.isReplied = $wrapper
          .find('.hotel-review-header')
          .eq(i)
          .find('.hotelReviewHeader-ownerCommentLink').length;
        data.rating = parseInt(
          $wrapper
            .find('span[itemprop=ratingValue]')
            .eq(i)
            .text(),
          10,
        );

        arr.push(data);
      }

      return arr;
    } catch (err) {
      console.log(err.message);
    }
  }
}

module.exports = HolidayCheckScraper;
