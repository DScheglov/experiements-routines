import { Impl } from './types';

export class Routine<Input, Context, Output, T> {
  #base: (impl: Impl<Input, Context, Output>) => T;

  private constructor(base: (impl: Impl<Input, Context, Output>) => T) {
    this.#base = base;
  }

  static of<Input, Context, Output, T>(
    base: (impl: Impl<Input, Context, Output>) => T,
  ): Routine<Input, Context, Output, T> {
    return new Routine(base);
  }

  with<NInput = Input, NContext = Context, NOutput = Output>(
    middleware: (
      impl: Impl<NInput, NContext, NOutput>,
    ) => Impl<Input, Context, Output>,
  ): Routine<NInput, NContext, NOutput, T> {
    return new Routine((impl) => {
      return this.#base(middleware(impl));
    });
  }
  impl(
    impl: Impl<Input, Context, Output>,
  ): T & { impl?: Impl<Input, Context, Output> } {
    return this.#base(impl) as T & { impl?: Impl<Input, Context, Output> };
  }
}
