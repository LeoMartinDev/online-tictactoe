import _ from 'lodash';
import plugin from 'fastify-plugin';

import User from '../../models/User.js';

export async function authenticateUser({ authorization, verifyToken, httpErrors }) {
  const authorizationHeader = _.trim(authorization);

  if (!authorizationHeader || !authorizationHeader.startsWith('Bearer')) {
    throw new httpErrors.unauthorized('Invalid authorization format');
  }

  const [token] = authorizationHeader.split(' ').reverse();
  let decodedToken;

  try {
    decodedToken = verifyToken(token);
  } catch (error) {
    throw new httpErrors.unauthorized('Invalid token');
  }

  const user = await User.findOne({ _id: decodedToken.userId });

  if (!user) {
    throw new httpErrors.forbidden();
  }

  return user;
}

export const authMiddleware = (instance) => async (request) => {
  const authorizationHeader = request.headers.authorization;

  const user = await authenticateUser({
    authorization: authorizationHeader,
    verifyToken: instance.jwt.decode,
    httpErrors: instance.httpErrors,
  });

  request.userId = user._id;
};

export default plugin(async (instance) => {
  instance.decorateRequest('userId', '');
  instance.addHook('onRequest', authMiddleware(instance));
});
