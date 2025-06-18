export const readHeader = (
  headers: Record<string, string | string[] | undefined>,
  name: string,
): string | null => {
  const value = headers[name.toLowerCase()];
  if (Array.isArray(value)) {
    return value[0] || null;
  }
  return typeof value === 'string' ? value : null;
};
