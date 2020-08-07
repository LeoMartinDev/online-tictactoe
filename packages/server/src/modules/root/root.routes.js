import {
  registerRoute,
  loginRoute,
} from './root.methods.js';

export default async (instance) => {
  instance.route(registerRoute(instance));
  instance.route(loginRoute(instance));
};
