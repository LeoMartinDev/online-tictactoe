import _ from 'lodash';

import { authenticateUser } from '../../app/middlewares/auth.js';
import {
  createRoom,
  joinRoomById,
} from './rooms.service.js';

/* import {
  registerRouteBodySchema,
  registerRouteResponseSchemas,
} from './root.dto.js'; */

export {
  createRoomRoute,
  joinRoomRoute,
};
function createRoomRoute() {
  return {
    method: 'POST',
    path: '/rooms',
    schema: {
/*       body: registerRouteBodySchema,
      response: registerRouteResponseSchemas, */
    },
    handler: async () => {
      const roomId = createRoom();

      return {
        roomId,
      };
    },
  };
};

async function authenticateWebsocketMessage({ message, verifyToken, httpErrors}) {
  console.log(message)
  const accessToken = message.accessToken;

  if (!accessToken) {
    throw new Error('Missing access token!');
  }

  const user = await authenticateUser({
    authorization: accessToken,
    verifyToken,
    httpErrors,
  });

  return user;
}

function joinRoomRoute(instance) {
  return {
    method: 'GET',
    path: '/rooms/:roomId',
    handler: () => {
      throw instance.httpErrors.notFound();
    },
    wsHandler: async (connection, request, params) => {
      const { roomId } = params;

      connection.socket.on('message', async (rawMessage) => {
        const message = JSON.parse(rawMessage);
        let user;
  
        try {
          user = await authenticateWebsocketMessage({
            message,
            verifyToken: instance.jwt.decode,
            httpErrors: instance.httpErrors,
          });
        } catch (error) {
          connection.socket.send(error.message);
          connection.end();
          return;
        }
      });
    }
  }
}
