import cache from 'memory-cache';

export const serverRequestCache = async (
  key: string,
  timeout: number,
  callback: (x: any) => any
) => {
  let data = cache.get(key);
  if (!data) {
    data = await callback(data);
    cache.put(key, data, timeout);
  }
  return data;
};
