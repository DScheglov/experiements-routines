export type User = {
  id: string;
  name: string;
  permissions: string[];
};

export const scopeGranted = (scope: string) => (user: User) =>
  user.permissions.includes(scope);
