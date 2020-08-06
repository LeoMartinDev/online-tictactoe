import rootRoutes from '../modules/root/root.routes.js';

export default async (instance) => {
  instance.register(rootRoutes);

  instance.all('*', async () => {
    throw instance.httpErrors.notFound();
  });
};
