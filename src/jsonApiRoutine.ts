import { authenticateWithToken } from './custom-middlewares/auth';
import jsonRoutine from './express/jsonRoutine';
import { context } from './routines/context';
import { errorHandler } from './routines/errorHandler';
import { Routine } from './routines/Routine';
import { ParsedRequest } from './routines/types';
import { internalServerError } from './shared/errors';
import { readHeader } from './shared/utils';
import { userService } from './services/userService';
import { greetingsService } from './services/greetingsService';

export const jsonApiRoutine = Routine.of(jsonRoutine)
  .with(errorHandler(internalServerError))
  .with(
    context(({ headers }, ctx) => ({
      ...ctx,
      token:
        readHeader(headers, 'authorization')?.replace(/^Bearer\s+/i, '') ||
        null,
    })),
  )
  .with(context((_, ctx) => ({ ...ctx, userService, greetingsService })))
  .with(
    authenticateWithToken(
      (_: ParsedRequest, { token }) => token,
      (token, { userService }) => userService.authenticate(token),
    ),
  );
