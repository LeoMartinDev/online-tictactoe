import {
  registerRoute,
} from './root.methods.js';

export default async (instance) => {
  instance.route(registerRoute(instance));
}