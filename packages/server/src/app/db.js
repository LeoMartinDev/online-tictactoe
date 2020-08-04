import mongoose from 'mongoose';
import plugin from 'fastify-plugin';

export default plugin(async (instance, config) => {
  const { uri, ...options } = config;

  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 8000,
    ...options,
  });

  mongoose.connection.on('error', (err) => {
    instance.log.error({ err }, 'mongoose - connection error');
  });

  instance
    .decorate('db', mongoose.connection)
    .addHook('onClose', (_instance, next) => {
      mongoose.connection.close(next);
    });

  instance.log.info({ uri, ...options }, 'mongoose - connected to DB');
});
