import fastify from 'fastify';

import app from './app/index.js';

const server = app();

server.listen(3000, (error, address) => {
  if (error) {
    fastify.log.error(error);
    process.exit(1);
  }
});
