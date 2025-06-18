import { Impl, MaybePromise } from './types';

export const context =
  <Input, Context, Output, NContext>(
    createContext: (input: Input, context: Context) => MaybePromise<NContext>,
  ) =>
  (impl: Impl<Input, NContext, Output>): Impl<Input, Context, Output> =>
  async (input: Input, context: Context) => {
    const newContext = await createContext(input, context);
    return impl(input, newContext);
  };
