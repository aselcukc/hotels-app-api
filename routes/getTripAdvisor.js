const Scraper = require('../components/Scraper');
const { queryArray } = require('../db');
const scraper = new Scraper();

module.exports = app => {
  app.post('/getTripAdvisor', async (req, res) => {
    try {
      const { rows } = await queryArray(
        `select urls->'TripAdvisor' from hotels where hotel_id = ${
          req.body.id
        }`,
      );
      const url = rows[0][0][0];
      scraper.scrapeTripAdvisor(url).then(val => {
        return res.status(200).send(val);
      });
    } catch (err) {
      return res.status(500).send(err.message);
    }
  });
};
