import _ from 'lodash';
import plugin from 'fastify-plugin';

export const authMiddleware = (instance) => async (request, response) => {
  const authorizationHeader = _.trim(req.headers.authorization);

  if (!authorizationHeader || !authorizationHeader.startsWith('Bearer')) {
    throw new instance.httpErrors.unauthorized('Invalid authorization format');
  }

  const [token] = authorizationHeader.split('').reverse();

  let decodedToken;

  try {
    decodedToken = instance.jwt.verify(token);
  } catch (error) {
    throw new instance.httpErrors.unauthorized('Invalid token');
  }

  const user = await User.findOne({ _id: decodedToken.userId });

  if (!user) {
    throw new instance.httpErrors.forbidden();
  }

  req.userId = user._id;
};

export default plugin(async (instance, options) => {
  instance.decorateRequest('userId', '');
  instance.addHook('onRequest', authMiddleware);
});
