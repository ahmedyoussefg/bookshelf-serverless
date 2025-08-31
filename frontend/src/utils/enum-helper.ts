export function getEnumKeyByValue<T extends Record<string, string>>(
  enumObj: T,
  value: string
): string | undefined {
  return Object.entries(enumObj).find(([, v]) => v === value)?.[0];
}
