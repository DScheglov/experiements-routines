import { Impl, MaybePromise } from './types';

export const errorHandler =
  <Input, Context, Output, ErrorOutput>(
    handler: (
      error: unknown,
      input: Input,
      context: Context,
    ) => MaybePromise<ErrorOutput>,
  ) =>
  (
    impl: Impl<Input, Context, Output>,
  ): Impl<Input, Context, Output | ErrorOutput> =>
  async (input, context) => {
    try {
      return await impl(input, context);
    } catch (error) {
      return handler(error, input, context);
    }
  };
