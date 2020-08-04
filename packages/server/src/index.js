import config from '../config/index.js';
import app from './app/index.js';

const server = app(config);

server.listen(3000, (error) => {
  if (error) {
    server.log.error(error);
    process.exit(1);
  }
});
