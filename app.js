const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');

const app = express();
app.enable('trust proxy');
app
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: true }))
  .use(helmet())
  .use(cors());

require('./routes/denemeque')(app);
require('./routes/getHotels')(app);
require('./routes/getTripAdvisor')(app);
require('./routes/getZoover')(app);
require('./routes/getTrustYou')(app);
require('./routes/getHolidayCheck')(app);

module.exports = app;
