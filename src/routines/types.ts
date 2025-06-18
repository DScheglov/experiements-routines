export type MaybePromise<T> = T | Promise<T>;

export type ValidationResult<T, E = unknown> =
  | { ok: true; result: T }
  | { ok: false; error: E };

export type Validator<T, E = unknown, I = unknown> = (
  input: I,
) => ValidationResult<T, E>;

export type GenericHeaders = Record<string, string | string[] | undefined>;
export type GenericCookies = Record<string, string | undefined>;
export type GenericParameters = Record<string, string | string[]>;

export type ParsedRequest = Readonly<{
  url: URL;
  headers: GenericHeaders;
  cookies: GenericCookies;
  parameters: GenericParameters;
  body: unknown;
}>;

export type TypedResponse<Status extends number, B> = Readonly<{
  status: Status;
  headers: GenericHeaders;
  body: B;
}>;

export type GenericResponse = TypedResponse<number, unknown>;

export type ResponseValidationSchema<Output extends GenericResponse> =
  Readonly<{
    status?: Validator<Output['status']>;
    headers?: Validator<Output['headers']>;
    body?: Validator<Output['body']>;
  }>;

export type RequestHandler<
  Context = {},
  Input = ParsedRequest,
  Response extends GenericResponse = GenericResponse,
> = (input: Input, context: Context) => MaybePromise<Response>;

export type Impl<Input, Context, Output> = {
  (input: Input, context: Context): MaybePromise<Output>;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type InputOf<T> = T extends { impl?: Impl<infer I, any, any> }
  ? I
  : never;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type OutputOf<T> = T extends { impl?: Impl<any, any, infer O> }
  ? O
  : never;
