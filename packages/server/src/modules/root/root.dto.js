import S from 'fluent-schema';

import { responseSchemas } from '../core/core.schemas.js';

export const registerRouteBodySchema = S.object()
  .prop('email', S.string().format(S.FORMATS.EMAIL).required())
  .prop('username', S.string().minLength(5).maxLength(20).required())
  .prop('password', S.string().minLength(6).maxLength(64).required());

export const registerRouteResponseSchemas = {
  200: S.object()
    .prop('email', S.string().format(S.FORMATS.EMAIL).required()),
  ...responseSchemas,
};

export const loginRouteBodySchema = S.object()
  .prop('email', S.string().format(S.FORMATS.EMAIL).required())
  .prop('password', S.string().minLength(6).maxLength(64).required());

export const loginRouteResponseSchemas = {
  200: S.object()
    .prop('accessToken', S.string().required()),
  ...responseSchemas,
};
