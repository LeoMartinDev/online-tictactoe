import auth from './middlewares/auth.js';
import roomsRoutes from '../modules/rooms/rooms.routes.js';

export default async (instance) => {
  // Auth middleware
  instance.register(auth);

  instance.register(roomsRoutes);
};
