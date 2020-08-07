import fastify from 'fastify';
import fastifySensible from 'fastify-sensible';
import fastifyJwt from 'fastify-jwt';

import db from './db.js';

import routes from './routes.js';
import publicRoutes from './routes.public.js';

export default (config) => {
  const app = fastify({
    ignoreTrailingSlash: true,
    disableRequestLogging: true,
    logger: true,
  });

  app.decorate('config', config);

  app.register(fastifySensible);

  app.register(db, config.db);
  
  app.register(fastifyJwt, {
    secret: config.app.secret,
  });

  app.register(publicRoutes, { prefix: '/api' });
  app.register(routes, { prefix: '/api' });
  app.all('*', async () => {
    throw app.httpErrors.notFound();
  });

  return app;
};
