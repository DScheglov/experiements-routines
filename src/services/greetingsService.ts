import { User } from '../domain/User';

export const greetingsService = {
  great(name: string, from: User): string {
    return `Hello, ${name}! From ${from.name}`;
  },
  farewell(name: string, from: User): string {
    return `Goodbye, ${name}! From ${from.name}`;
  },
};
