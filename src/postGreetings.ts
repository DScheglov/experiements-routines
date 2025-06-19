import { string, struct, value } from 'castage';
import { compose } from 'resultage/fn';
import { scopeGranted } from './domain/User';
import { jsonApiEndpoint, jsonApiRoutine } from './jsonApiRoutine';
import { input } from './routines/input';
import { output } from './routines/output';
import { json } from './routines/responses';
import { inputValidationError, outputValidationError } from './shared/errors';
import { GenericHeadersDTO, toValidator } from './shared/validations';
import { authorizeIf } from './shared/authorizeIf';
import { InputOf, OutputOf } from './routines/types';

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
      data: struct({ greeting: string, from: string }),
    }),
  }),
);

export const postGreetings = jsonApiRoutine
  .with(authorizeIf(scopeGranted('greetings:call')))
  .with(input(GreetingsInputDTO, inputValidationError))
  .with(output(GreetingsOutputDTO, outputValidationError('postGreetings')))
  .impl(({ body }, { user, greetingsService }) => {
    const { name } = body;
    return json(200, {
      success: true as const,
      data: {
        greeting: greetingsService.great(name, user),
        from: user.name,
      },
    });
  });

export const postGreetings1 = compose(
  jsonApiEndpoint,
  authorizeIf(scopeGranted('greetings:call')),
  input(GreetingsInputDTO, inputValidationError),
  output(GreetingsOutputDTO, outputValidationError('postGreetings')),
)(({ body }, { user, greetingsService }) => {
  const { name } = body;
  return json(200, {
    success: true as const,
    data: {
      greeting: greetingsService.great(name, user),
      from: user.name,
    },
  });
});

export type PostGreetingsInput = InputOf<typeof postGreetings>;
export type PostGreetingsOutput = OutputOf<typeof postGreetings>;
