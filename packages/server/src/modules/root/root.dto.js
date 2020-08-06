import S from 'fluent-schema';

import { responseSchemas } from '../core/schemas.js';

export const registerRouteBodySchema = S.object()
  .prop('email', S.string().format(S.FORMATS.EMAIL).required())
  .prop('username', S.string().minLength(5).maxLength(20).required())
  .prop('password', S.string().required());

export const registerRouteResponseSchemas = {
  200: S.object()
    .prop('email', S.string().format(S.FORMATS.EMAIL).required()),
  ...responseSchemas,
};
