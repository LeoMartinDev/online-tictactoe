import fastifyWebsocket from 'fastify-websocket';

import {
  createRoomRoute,
  joinRoomRoute,
} from './rooms.methods.js';

export default async (instance) => {
  instance.register(fastifyWebsocket);

  instance.route(createRoomRoute(instance));
  instance.route(joinRoomRoute(instance));
};
