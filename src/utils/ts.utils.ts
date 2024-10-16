export const getKeys = <T extends Record<PropertyKey, any>>(
  obj: T
): (keyof T)[] => {
  return Object.keys(obj) as (keyof T)[];
};

export const fromEntries = <T extends PropertyKey, K>(
  entries: Iterable<readonly [T, K]>
): Record<T, K> => {
  return Object.fromEntries(entries) as Record<T, K>;
};
