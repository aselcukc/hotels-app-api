const rp = require('request-promise');
const cheerio = require('cheerio');

class TrustYouScraper {
  constructor(url) {
    this.urls = url;
  }

  scrape(url) {
    const arr = [];

    return rp({
      url,
    })
      .then(body => {
        const $ = cheerio.load(body);
        const $iframe = $('#iFrameResizer1');
        const iframeSrc = $iframe.attr('src');

        return iframeSrc;
      })
      .then(src => {
        return rp({
          url: src,
        }).then(body => {
          return {
            src,
            body,
          };
        });
      })
      .then(obj => {
        const { src, body } = obj;
        const $ = cheerio.load(body);
        const $body = $('body');
        const $wrapper = $body.find('.review-highlights').eq(0);

        const data = {};

        data.url = src;
        data.summary = $body
          .find('.summary-sentence')
          .eq(0)
          .text();

        data.rating = parseFloat(
          $body
            .find('.value')
            .eq(0)
            .text()
            .trim(),
          10,
        );

        const $category_1 = $wrapper.find('.category').eq(0);
        const $category_2 = $wrapper.find('.category').eq(1);
        const $category_3 = $wrapper.find('.category').eq(2);
        const $category_4 = $wrapper.find('.category').eq(3);
        const $category_5 = $wrapper.find('.category').eq(4);
        const $category_6 = $wrapper.find('.category').eq(5);
        const $category_7 = $wrapper.find('.category').eq(6);
        const $category_8 = $wrapper.find('.category').eq(7);
        const $category_9 = $wrapper.find('.category').eq(8);

        data.breakfeast = {
          name: 'Kahvaltı',
          reviewName: $category_1
            .find('h2')
            .eq(0)
            .text(),
          reviewRating: parseFloat(
            $category_1
              .find('.text-pos')
              .eq(0)
              .text(),
            10,
          ),
          reviewCount: $category_1
            .find('.review-count')
            .eq(0)
            .text(),
          reviewDetails: $category_1
            .find('.category-details')
            .eq(0)
            .text()
            .trim(),
        };

        data.room = {
          name: 'Oda',
          reviewName: $category_2
            .find('h2')
            .eq(0)
            .text(),
          reviewRating: parseFloat(
            $category_2
              .find('.text-pos')
              .eq(0)
              .text(),
            10,
          ),
          reviewCount: $category_2
            .find('.review-count')
            .eq(0)
            .text(),
          reviewDetails: $category_2
            .find('.category-details')
            .eq(0)
            .text()
            .trim(),
        };

        data.comfort = {
          name: 'Konfor',
          reviewName: $category_3
            .find('h2')
            .eq(0)
            .text(),
          reviewRating: parseFloat(
            $category_3
              .find('.text-pos')
              .eq(0)
              .text(),
            10,
          ),
          reviewCount: $category_3
            .find('.review-count')
            .eq(0)
            .text()
            .replace('reviews', ''),

          reviewDetails: $category_3
            .find('.category-details')
            .eq(0)
            .text()
            .trim(),
        };

        data.location = {
          name: 'Lokasyon',
          reviewName: $category_4
            .find('h2')
            .eq(0)
            .text(),
          reviewRating: parseFloat(
            $category_4
              .find('.text-pos')
              .eq(0)
              .text(),
            10,
          ),
          reviewCount: $category_4
            .find('.review-count')
            .eq(0)
            .text(),
          reviewDetails: $category_4
            .find('.category-details')
            .eq(0)
            .text()
            .trim(),
        };

        data.food = {
          name: 'Yiyecek',
          reviewName: $category_5
            .find('h2')
            .eq(0)
            .text(),
          reviewRating: parseFloat(
            $category_5
              .find('.text-pos')
              .eq(0)
              .text(),
            10,
          ),
          reviewCount: $category_5
            .find('.review-count')
            .eq(0)
            .text(),
          reviewDetails: $category_5
            .find('.category-details')
            .eq(0)
            .text()
            .trim(),
        };

        data.service = {
          name: 'Servis',
          reviewName: $category_6
            .find('h2')
            .eq(0)
            .text(),
          reviewRating: parseFloat(
            $category_6
              .find('.text-pos')
              .eq(0)
              .text(),
            10,
          ),
          reviewCount: $category_6
            .find('.review-count')
            .eq(0)
            .text(),
          reviewDetails: $category_6
            .find('.category-details')
            .eq(0)
            .text()
            .trim(),
        };

        data.amenities = {
          name: 'Kolaylıklar',
          reviewName: $category_7
            .find('h2')
            .eq(0)
            .text(),
          reviewRating: parseFloat(
            $category_7
              .find('.text-pos')
              .eq(0)
              .text(),
            10,
          ),
          reviewCount: $category_7
            .find('.review-count')
            .eq(0)
            .text(),
          reviewDetails: $category_7
            .find('.category-details')
            .eq(0)
            .text()
            .trim(),
        };

        data.wifi = {
          name: 'WiFi',
          reviewName: $category_8
            .find('h2')
            .eq(0)
            .text(),
          reviewRating: parseFloat(
            $category_8
              .find('.text-pos')
              .eq(0)
              .text(),
            10,
          ),
          reviewCount: $category_8
            .find('.review-count')
            .eq(0)
            .text(),
          reviewDetails: $category_8
            .find('.category-details')
            .eq(0)
            .text()
            .trim(),
        };

        data.beach = {
          name: 'Beach',
          reviewName: $category_9
            .find('h2')
            .eq(0)
            .text(),
          reviewRating: parseFloat(
            $category_9
              .find('.text-pos')
              .eq(0)
              .text(),
            10,
          ),
          reviewCount: $category_9
            .find('.review-count')
            .eq(0)
            .text(),
          reviewDetails: $category_9
            .find('.category-details')
            .eq(0)
            .text()
            .trim(),
        };

        arr.push(data);

        return arr;
      });
  }
}

module.exports = TrustYouScraper;
