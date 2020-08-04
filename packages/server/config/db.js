export default {
  uri: process.env.MONGO_URI || 'mongodb://db:27017',
  dbName: process.env.MONGO_DB_NAME || 'tictactoe',
};
