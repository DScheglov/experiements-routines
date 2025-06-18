import type { Impl, MaybePromise, Validator } from './types';
import { OutputValidationError } from './RoutineError';

export const output =
  <
    Input,
    Context,
    ValidatedOutput,
    InvalidOutputError = unknown,
    InvalidOutputOutput = never,
  >(
    validateOutput: Validator<ValidatedOutput, InvalidOutputError>,
    onError?: (error: InvalidOutputError) => MaybePromise<InvalidOutputOutput>,
  ) =>
  (impl: Impl<Input, Context, ValidatedOutput>) =>
  async (input: Input, context: Context) => {
    const output = await impl(input, context);

    const validationResult = validateOutput(output);
    if (validationResult.ok) {
      return validationResult.result;
    }
    if (onError) {
      return onError(validationResult.error);
    }

    if (validationResult.error instanceof Error) {
      throw validationResult.error;
    }

    throw new OutputValidationError(validationResult.error);
  };
