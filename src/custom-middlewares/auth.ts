import { Impl, MaybePromise } from '../routines/types';

export const authenticateWithToken =
  <Input, Context, Output, User, Token = string>(
    extractAuthToken: (
      input: Input,
      context: Context,
    ) => MaybePromise<Token | null | undefined>,
    resolveUser: (
      token: Token,
      context: Context,
    ) => Promise<User | null | undefined>,
  ) =>
  (impl: Impl<Input, Context & { user: User | null }, Output>) =>
  async (input: Input, context: Context): Promise<Output> => {
    const token = await extractAuthToken(input, context);
    const user = token != null ? await resolveUser(token, context) : null;

    return impl(input, { ...context, user: user ?? null });
  };

export const authorize =
  <ForbiddenOutput, UnauthorizedOutput>(
    onForbidden: () => MaybePromise<ForbiddenOutput>,
    onUnauthorized: () => MaybePromise<UnauthorizedOutput>,
  ) =>
  <Input, Context extends { user: User | null }, Output, User>(
    isAuthorized: (user: User, context: Context) => MaybePromise<boolean>,
  ) =>
  (impl: Impl<Input, Context & { user: User }, Output>) =>
  async (request: Input, context: Context) => {
    const { user } = context;

    if (user == null) return onUnauthorized();

    const authorized = await isAuthorized(user, context);

    if (!authorized) return onForbidden();

    return impl(request, { ...context, user });
  };
