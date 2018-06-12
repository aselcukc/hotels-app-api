const redis = require('redis');
const { query } = require('../db');

const redisClient = redis.createClient();

module.exports = app => {
  app.post('/hotels', async (req, res) => {
    redisClient.get(`${req.body.email}:hotelsData`, async (err, hotelsData) => {
      if (err) {
        return res.status(500).send(err.message);
      }

      if (hotelsData && JSON.parse(hotelsData).length) {
        return res.status(200).send(JSON.parse(hotelsData));
      } else {
        try {
          const { rows } = await query(
            'select * from hotels inner join users_hotels on hotels.hotel_id = users_hotels.hotel_id inner join users on users.user_email = $1',
            [req.body.email],
          );
          
          redisClient.setex(
            `${req.body.email}:hotelsData`,
            900,
            JSON.stringify(rows),
          );
          return res.status(200).send(rows);
        } catch (err) {
          return res.status(500).send(err.message);
        }
      }
    });
  });
};
