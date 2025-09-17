import {
  string,
  struct,
  value,
} from 'castage';
import { compose } from 'resultage/fn';
import { scopeGranted } from './domain/User';
import {
  jsonApiEndpoint,
  jsonApiRoutine,
} from './jsonApiRoutine';
import { input } from './routines/input';
import { output } from './routines/output';
import { json } from './routines/responses';
import {
  inputValidationError,
  internalServerError,
  outputValidationError,
} from './shared/errors';
import {
  GenericHeadersDTO,
  toValidator,
} from './shared/validations';
import { authorizeIf } from './shared/authorizeIf';
import {
  InputOf,
  OutputOf,
} from './routines/types';
import { Routine } from './routines/Routine';
import jsonRoutine from './express/jsonRoutine';
import { userService } from './services/userService';
import { greetingsService } from './services/greetingsService';
import { errorHandler } from './routines/errorHandler';
import { context } from './routines/context';
import { authenticateWithToken } from './custom-middlewares/auth';
import { readHeader } from './shared/utils';

const GreetingsInputDTO = toValidator(
  struct({
    body: struct({ name: string }),
  }),
);

const GreetingsOutputDTO = toValidator(
  struct({
    status: value(200),
    headers: GenericHeadersDTO,
    body: struct({
      success: value(true),
      data: struct({
        greeting: string,
        from: string,
      }),
    }),
  }),
);

export const postGreetings = jsonApiRoutine
  .with(
    authorizeIf(
      scopeGranted('greetings:call'),
    ),
  )
  .with(
    input(
      GreetingsInputDTO,
      inputValidationError,
    ),
  )
  .with(
    output(
      GreetingsOutputDTO,
      outputValidationError('postGreetings'),
    ),
  )
  .impl(
    (
      { body },
      { user, greetingsService },
    ) => {
      const { name } = body;
      return json(200, {
        success: true as const,
        data: {
          greeting: greetingsService.great(
            name,
            user,
          ),
          from: user.name,
        },
      });
    },
  );

export const postGreetings2 = Routine.of(
  jsonRoutine,
)
  .with(errorHandler(internalServerError))
  .with(
    context((_, ctx) => ({
      ...ctx,
      userService,
      greetingsService,
    })),
  )
  .with(
    authenticateWithToken(
      ({ headers }) =>
        readHeader(
          headers,
          'authorization',
        )?.replace(/^Bearer\s+/i, '') ||
        null,
      (token, { userService }) =>
        userService.authenticate(token),
    ),
  )
  .with(
    authorizeIf(
      scopeGranted('greetings:call'),
    ),
  )
  .with(
    input(
      GreetingsInputDTO,
      inputValidationError,
    ),
  )
  .with(
    output(
      GreetingsOutputDTO,
      outputValidationError('postGreetings'),
    ),
  )
  .impl(
    (
      { body },
      { user, greetingsService },
    ) => {
      const { name } = body;
      return json(200, {
        success: true as const,
        data: {
          greeting: greetingsService.great(
            name,
            user,
          ),
          from: user.name,
        },
      });
    },
  );

export const postGreetings1 = compose(
  jsonApiEndpoint,
  authorizeIf(
    scopeGranted('greetings:call'),
  ),
  input(
    GreetingsInputDTO,
    inputValidationError,
  ),
  output(
    GreetingsOutputDTO,
    outputValidationError('postGreetings'),
  ),
)(({ body }, { user, greetingsService }) => {
  const { name } = body;
  return json(200, {
    success: true as const,
    data: {
      greeting: greetingsService.great(
        name,
        user,
      ),
      from: user.name,
    },
  });
});

export type PostGreetingsInput = InputOf<
  typeof postGreetings
>;
export type PostGreetingsOutput = OutputOf<
  typeof postGreetings
>;
