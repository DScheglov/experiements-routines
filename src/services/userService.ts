import { User } from '../domain/User';

export const userService = {
  async authenticate(token: string): Promise<User | null> {
    switch (token) {
      case 'valid-token':
        return {
          id: '1',
          name: 'Max Green',
          permissions: ['greetings:call'],
        };

      case 'admin-token':
        return {
          id: '2',
          name: 'Admin User',
          permissions: ['admin:call', 'greetings:call'],
        };

      default:
        return null;
    }
  },
};
