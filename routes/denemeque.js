const { query } = require('../Db');

module.exports = app => {
  app.get('/denemeque', async (req, res) => {
    const { rows } = await query('SELECT * FROM hotels');
    return res.send(rows);
  });
};
