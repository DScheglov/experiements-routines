export class RoutineError<E = string> extends Error {
  code: E;
  cause?: unknown;
  constructor(code: E, message: string, cause?: unknown) {
    super(message);
    this.code = code;
    this.name = this.constructor.name;
    this.cause = cause;
  }
}

export class InputValidationError extends RoutineError<'ERR_INPUT_VALIDATION_FAILED'> {
  constructor(cause: unknown) {
    super('ERR_INPUT_VALIDATION_FAILED', 'Input validation failed', cause);
  }
}

export class OutputValidationError extends RoutineError<'ERR_OUTPUT_VALIDATION_FAILED'> {
  constructor(cause: unknown) {
    super('ERR_OUTPUT_VALIDATION_FAILED', 'Output validation failed', cause);
  }
}
