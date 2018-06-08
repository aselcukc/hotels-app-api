const HolidayCheckScraper = require('../components/HolidayCheckScraper');
const { queryArray } = require('../db');
const redis = require('redis');

const redisClient = redis.createClient();
const scraper = new HolidayCheckScraper();

module.exports = app => {
  app.post('/getHolidayCheck', async (req, res) => {
    redisClient.get(
      `${req.body.id}:holidayCheckData`,
      async (err, holidayCheckData) => {
        if (err) {
          return res.status(500).send(err.message);
        }

        if (holidayCheckData && JSON.parse(holidayCheckData).length) {
          return res.status(200).send(JSON.parse(holidayCheckData));
        } else {
          try {
            const { rows } = await queryArray(
              `select urls->'HolidayCheck' from hotels where hotel_id = ${
                req.body.id
              }`,
            );
            const firstUrl = rows[0][0][0];
            const firstVal = await scraper.scrape(firstUrl);
            redisClient.setex(
              `${req.body.id}:holidayCheckData`,
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
