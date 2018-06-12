const TripAdvisorScraper = require('../components/TripAdvisorScraper');
const { queryArray } = require('../db');
const { createTripAdvisorExcel } = require('../components/ExcelCreator');
const redis = require('redis');

const redisClient = redis.createClient();
const scraper = new TripAdvisorScraper();

module.exports = app => {
  app.post('/getTripAdvisor', async (req, res) => {
    redisClient.get(
      `${req.body.id}:tripAdvisorData`,
      async (err, tripAdvisorData) => {
        if (err) {
          return res.status(500).send(err.message);
        }

        if (tripAdvisorData && JSON.parse(tripAdvisorData).length) {
          return res.status(200).send(JSON.parse(tripAdvisorData));
        } else {
          try {
            const { rows } = await queryArray(
              `select urls->'TripAdvisor' from hotels where hotel_id = ${
                req.body.id
              }`,
            );
            const firstUrl = rows[0][0][0];
            const secondUrl = rows[0][0][1];

            const firstVal = await scraper.scrape(firstUrl);
            const secondVal = await scraper.scrape(secondUrl);
            const results = firstVal.concat(secondVal);
            redisClient.setex(
              `${req.body.id}:tripAdvisorData`,
              900,
              JSON.stringify(results),
            );
            return res.status(200).send(results);
          } catch (err) {
            return res.status(500).send(err.message);
          }
        }
      },
    );
  });

  /* app.post('/makeTripAdvisorExcel', (req, res) => {
    createTripAdvisorExcel(req.body, res);
  }); */

  app.get('/getTripAdvisorExcel/:id', (req, res) => {
    if (req.params.id) {
      redisClient.get(
        `${req.params.id}:tripAdvisorData`,
        async (err, tripAdvisorData) => {
          if (err) {
            return res.status(500).send(err.message);
          }

          createTripAdvisorExcel(JSON.parse(tripAdvisorData), res);
        },
      );
    }
  });
};
