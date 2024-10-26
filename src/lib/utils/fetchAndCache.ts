import logger from './logger';

interface Cache {
  data: any | null;
  lastFetch: Date | null;
}

interface CacheStore {
  [key: string]: Cache;
}

const cacheStore: CacheStore = {};

export async function fetchAndCache(url: string, cacheKey: string) {
  const now = new Date();
  
  const cache = cacheStore[cacheKey];
  const cacheAge = cache?.lastFetch ? now.getTime() - cache.lastFetch.getTime() : Infinity;
  const cacheIsValid = cacheAge < 24 * 60 * 60 * 1000; // 24 hours in milliseconds

  if (cache?.data && cacheIsValid) {
    logger.info(`Returning cached data for ${cacheKey}`);
    return cache.data;
  }

  logger.info(`Fetching fresh data for ${cacheKey}`);
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
  if (!response.ok) {
    logger.error('Failed to fetch data', { cacheKey, statusText: response.statusText });
    throw new Error(`Failed to fetch ${cacheKey} data, response: ${response.statusText}`);
  }
  const data = await response.json();
  
  // Update cache
  cacheStore[cacheKey] = {
    data: data,
    lastFetch: now
  };
  
  return data;
}
