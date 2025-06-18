import { type Caster, record, string, oneOf, array, undef } from 'castage';

export const toValidator = <T>(caster: Caster<T>) =>
  caster.match(
    (result) => ({ ok: true as const, result }),
    (error) => ({ ok: false as const, error }),
  );

export const GenericHeadersDTO = record(
  string,
  oneOf(string, array(string), undef),
);
