import S from 'fluent-schema';

export const clientErrorResponseSchema = S.object()
  .prop('statusCode', S.number().required())
  .prop('error', S.string().required())
  .prop('message', S.string().required())
  .prop('details');

export const responseSchemas = {
  '4xx': clientErrorResponseSchema,
};
