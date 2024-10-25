import { json } from '@sveltejs/kit';

const publicToiletsUrl = 'https://opendata.bordeaux-metropole.fr/api/explore/v2.1/catalog/datasets/bor_sigsanitaire/exports/geojson?lang=fr&timezone=Europe%2FBerlin';

// Cache object to store the fountains data and last fetch time
interface Cache {
  data: any | null;
  lastFetch: Date | null;
}

let cache: Cache = {
  data: null,
  lastFetch: null
};

async function fetchPublicToilets() {
  const now = new Date();
  
  // Check if cache is valid (less than 24 hours old)
  if (cache.data && cache.lastFetch && (now.getTime() - cache.lastFetch.getTime() < 24 * 60 * 60 * 1000)) {
    console.log('Returning cached public toilets data');
    return cache.data;
  }

  console.log('Fetching fresh public toilets data');
  const response = await fetch(publicToiletsUrl, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
  if (!response.ok) {
    console.error({response})
    throw new Error('Failed to fetch public toilets data, response: ' + response.statusText);
  }
  const data = await response.json();
  
  // Update cache
  cache.data = data;
  cache.lastFetch = now;
  
  return data;
}

export async function GET(event) {
  try {
    const publicToilets = await fetchPublicToilets();
    return json(publicToilets)
  } catch (error) {
    return new Response('Failed to fetch public toilets data, error: ' + error, { status: 500 });
  }
}
