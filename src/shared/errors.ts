import { type CastingError } from 'castage';
import { json } from '../routines/responses';

export const internalServerError = (error: unknown) => {
  console.error('Internal Server Error:', error);
  return json(500, { success: false, error: 'Internal server error' });
};

export const inputValidationError = (error: CastingError) =>
  json(400, {
    success: false,
    code: error.code,
    message: error.message,
    path: error.path,
    extra: error.extra,
  });

export const outputValidationError =
  (routine: string) => (error: CastingError) => {
    console.error(`Output Validation Error in ${routine}:`, error);
    return json(500, { success: false, error: 'Internal server error' });
  };
