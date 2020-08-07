import bcrypt from 'bcrypt';
import _ from 'lodash';

import User from '../../models/User.js';

import {
  registerRouteBodySchema,
  registerRouteResponseSchemas,
  loginRouteBodySchema,
  loginRouteResponseSchemas,
} from './root.dto.js';

export {
  registerRoute,
  loginRoute,
};

function registerRoute() {
  return {
    method: 'POST',
    path: '/register',
    schema: {
      body: registerRouteBodySchema,
      response: registerRouteResponseSchemas,
    },
    handler: async (request, response) => {
      const { email, username, password } = request.body;
  
      let user;
      const hashedPassword = await bcrypt.hash(password, 10);
  
      try {
        user = await User.create({
          email,
          username,
          hashedPassword,
        });
      } catch (error) {
        if (error.name === 'ValidationError') {
          return response
            .status(409)
            .send({
              statusCode: 409,
              error: 'Conflict',
              message: error.message,
              details: error.errors,
            });
        }
        throw error;
      }
  
      return {
        email: user.email,
      };
    },
  };
};

function loginRoute(instance) {
  return {
    method: 'POST',
    path: '/login',
    schema: {
      body: loginRouteBodySchema,
      response: loginRouteResponseSchemas,
    },
    handler: async (request, response) => {
      const { email, password } = request.body;

      const userFromEmail = await User.findOne({ email });

      if (!userFromEmail) {
        throw new instance.httpErrors.unauthorized();
      }

      try {
        await bcrypt.compare(password, userFromEmail.hashedPassword);
      } catch (error) {
        throw new instance.httpErrors.unauthorized();
      }

      const accessToken = await response.jwtSign({ userId: userFromEmail._id }, {
        expiresIn: instance.config.app.accessTokenExpiry,
      });

      return {
        accessToken,
      };
    },
  };
};
