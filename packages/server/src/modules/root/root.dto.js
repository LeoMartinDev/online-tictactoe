export const registerRouteBodySchema = {
  type: 'object',
  required: ['email', 'username', 'password'],
  properties: {
    email: {
      type: 'email',
    },
    username: {
      type: 'string',
      minLength: 5,
      maxLenght: 20,
    },
    password: {
      type: 'string',
    },
  },
};

export const registerRouteResponseSchemas = {
  200: {
    type: 'object',
    properties: {
      email: { type: 'email' },
    },
  },
};
