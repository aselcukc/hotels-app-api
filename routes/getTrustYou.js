const TrustYouScraper = require('../components/TrustYouScraper');
const { queryArray } = require('../db');
const redis = require('redis');

const redisClient = redis.createClient();
const scraper = new TrustYouScraper();

module.exports = app => {
  app.post('/getTrustYou', async (req, res) => {
    redisClient.get(
      `${req.body.id}:trustYouData`,
      async (err, trustYouData) => {
        if (err) {
          return res.status(500).send(err.message);
        }

        if (trustYouData && JSON.parse(trustYouData).length) {
          return res.status(200).send(JSON.parse(trustYouData));
        } else {
          try {
            const { rows } = await queryArray(
              `select urls->'TrustYou' from hotels where hotel_id = ${
                req.body.id
              }`,
            );
            const firstUrl = rows[0][0][0];
            const firstVal = await scraper.scrape(firstUrl);
            redisClient.setex(
              `${req.body.id}:trustYouData`,
              900,
              JSON.stringify(firstVal),
            );
            return res.status(200).send(firstVal);
          } catch (err) {
            return res.status(500).send(err.message);
          }
        }
      },
    );
  });
};
