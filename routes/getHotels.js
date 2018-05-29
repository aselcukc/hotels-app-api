const { query } = require('../db');

module.exports = app => {
  app.post('/hotels', async (req, res) => {
    try {
      const { rows } = await query(
        'select * from hotels inner join users_hotels on hotels.hotel_id = users_hotels.hotel_id inner join users on users.user_email = $1',
        [req.body.email],
      );

      return res.status(200).send(rows);
    } catch (err) {
      return res.status(500).send(err.message);
    }
  });
};
