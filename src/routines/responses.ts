import { TypedResponse } from './types';

export const json = <T, S extends number = 200>(
  status: S,
  body: T,
  headers: Record<string, string | string[]> | undefined = undefined,
): TypedResponse<S, T> => ({
  status,
  headers: {
    ...headers,
    'Content-Type': 'application/json',
  },
  body,
});

export const text = <T extends string, S extends number = 200>(
  status: S,
  body: T,
  headers: Record<string, string | string[]> | undefined = undefined,
): TypedResponse<S, T> => ({
  status,
  headers: {
    ...headers,
    'Content-Type': 'text/plain',
  },
  body,
});

export const html = <T extends string, S extends number = 200>(
  status: S,
  body: T,
  headers: Record<string, string | string[]> | undefined = undefined,
): TypedResponse<S, T> => ({
  status,
  headers: {
    ...headers,
    'Content-Type': 'text/html',
  },
  body,
});
