export default {
  secret: process.env.SECRET || '123',
  accessTokenExpiry: process.env.ACCESS_TOKEN_EXPIRY || 1000 * 60 * 60 * 24 * 30,
};
