import auth from './middlewares/auth.js';

export default async (instance) => {
  // Auth middleware
  instance.register(auth);
};
