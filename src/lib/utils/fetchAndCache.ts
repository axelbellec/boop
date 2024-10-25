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
  
  // Check if cache is valid (less than 24 hours old)
  if (cacheStore[cacheKey]?.data && cacheStore[cacheKey]?.lastFetch && 
      (now.getTime() - cacheStore[cacheKey].lastFetch!.getTime() < 24 * 60 * 60 * 1000)) {
    console.log(`Returning cached data for ${cacheKey}`);
    return cacheStore[cacheKey].data;
  }

  console.log(`Fetching fresh data for ${cacheKey}`);
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
  if (!response.ok) {
    console.error({ response });
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
