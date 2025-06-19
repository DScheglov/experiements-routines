export class Routine<A, T> {
  #base: (impl: A) => T;

  private constructor(base: (impl: A) => T) {
    this.#base = base;
  }

  static of<A, T>(base: (impl: A) => T): Routine<A, T> {
    return new Routine(base);
  }

  with<B = A>(middleware: (impl: B) => A): Routine<B, T> {
    return new Routine((impl) => {
      return this.#base(middleware(impl));
    });
  }
  impl(impl: A): T & { impl?: A } {
    return this.#base(impl) as T & { impl?: A };
  }
}
