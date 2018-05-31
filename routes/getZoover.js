const ZooverScraper = require('../components/ZooverScraper');
const { queryArray } = require('../db');
const redis = require('redis');

const redisClient = redis.createClient();
const scraper = new ZooverScraper();

module.exports = app => {
  app.post('/getZoover', async (req, res) => {
    redisClient.get(`${req.body.id}:zooverData`, async (err, zooverData) => {
      if (err) {
        return res.status(500).send(err.message);
      }
      if (zooverData && JSON.parse(zooverData).length) {
        return res.status(200).send(JSON.parse(zooverData));
      } else {
        try {
          const { rows } = await queryArray(
            `select urls->'Zoover' from hotels where hotel_id = ${req.body.id}`,
          );
          const firstUrl = rows[0][0][0];
          const firstVal = await scraper.scrape(firstUrl);
          redisClient.setex(
            `${req.body.id}:zooverData`,
            900,
            JSON.stringify(firstVal),
          );
          return res.status(200).send(firstVal);
        } catch (err) {
          return res.status(500).send(err.message);
        }
      }
    });
  });
};
