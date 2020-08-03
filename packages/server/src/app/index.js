import fastify from 'fastify';
import fastifySensible from 'fastify-sensible';

import db from './db.js';
import routes from './routes.js';

export default () => {
  const app = fastify({
    ignoreTrailingSlash: true,
    disableRequestLogging: true,
    logger: true,
  });

  app.register(fastifySensible);

  app.register(db);


  app.register(routes, { prefix: '/api' });

  return app;
};
