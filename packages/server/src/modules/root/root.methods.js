import bcrypt from 'bcrypt';
import _ from 'lodash';

import {
  registerRouteBodySchema,
  registerRouteResponseSchemas,
} from './root.dto.js';

import User from '../../models/User.js';

export const registerRoute = () => ({
  method: 'POST',
  path: '/register',
  schemas: {
    body: registerRouteBodySchema,
    response: registerRouteResponseSchemas,
  },
  handler: async (request) => {
    const { email, username, password } = request.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    let user;

    try {
      user = await User.create({
        email,
        username,
        hashedPassword,
      });
    } catch (error) {
      if (error.name === 'ValidationError') {
        const errors = _.mapValues(error.errors, (errorData) =>
          _.pick(errorData, ['message', 'path', 'value']));

        throw new instance.httpErrors.conflict(errors)
      }
      throw error;
    }

    return {
      email: user.email,
    };
  },
});
