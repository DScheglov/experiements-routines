import { compose } from 'resultage/fn';
import { authenticateWithToken } from './custom-middlewares/auth';
import jsonRoutine from './express/jsonRoutine';
import { context } from './routines/context';
import { errorHandler } from './routines/errorHandler';
import { Routine } from './routines/Routine';
import { internalServerError } from './shared/errors';
import { readHeader } from './shared/utils';
import { userService } from './services/userService';
import { greetingsService } from './services/greetingsService';

export const jsonApiRoutine = Routine.of(jsonRoutine)
  .with(errorHandler(internalServerError))
  .with(context((_, ctx) => ({ ...ctx, userService, greetingsService })))
  .with(
    authenticateWithToken(
      ({ headers }) =>
        readHeader(headers, 'authorization')?.replace(/^Bearer\s+/i, '') ||
        null,
      (token, { userService }) => userService.authenticate(token),
    ),
  );

export const jsonApiEndpoint = compose(
  jsonRoutine,
  errorHandler(internalServerError),
  context((_, ctx) => ({ ...ctx, userService, greetingsService })),
  authenticateWithToken(
    ({ headers }) =>
      readHeader(headers, 'authorization')?.replace(/^Bearer\s+/i, '') || null,
    (token, { userService }) => userService.authenticate(token),
  ),
);
