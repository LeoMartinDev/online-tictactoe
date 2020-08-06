import bcrypt from 'bcrypt';
import _ from 'lodash';

import User from '../../models/User.js';

import {
  registerRouteBodySchema,
  registerRouteResponseSchemas,
} from './root.dto.js';

export {
  registerRoute,
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
