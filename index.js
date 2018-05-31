const dotenv = require('dotenv');

dotenv.config();
const http = require('http');
const app = require('./app');

function normalizePort(val) {
  const port = typeof val === 'string' ? parseInt(val, 10) : val;
  if (isNaN(port)) {
    return val;
  } else if (port >= 0) {
    return port;
  }
  return false;
}

const PORT = normalizePort(process.env.PORT || 5000);

app.set('port', PORT);
const server = http.createServer(app);
server.listen(PORT);

server.on('listening', () => {
  console.log(`Server listening on: ${PORT}`);
});
