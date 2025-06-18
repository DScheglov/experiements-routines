import { InputValidationError } from './RoutineError';
import { Impl, MaybePromise, Validator } from './types';

export const input =
  <
    Input,
    Context,
    Output,
    ValidatedInput,
    ValidationError,
    InvalidInputOutput = never,
  >(
    parseInput: Validator<ValidatedInput, ValidationError>,
    onError?: (error: ValidationError) => MaybePromise<InvalidInputOutput>,
  ) =>
  (
    impl: Impl<ValidatedInput, Context, Output>,
  ): Impl<Input, Context, Output | InvalidInputOutput> =>
  (input, context) => {
    const result = parseInput(input);
    if (result.ok) {
      return impl(result.result, context);
    }

    if (onError) {
      return onError(result.error as ValidationError);
    }

    if (result.error instanceof Error) {
      throw result.error;
    }

    throw new InputValidationError(result.error);
  };
