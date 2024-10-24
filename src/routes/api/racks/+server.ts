import { json } from '@sveltejs/kit';

const racksUrl = 'https://opendata.bordeaux-metropole.fr/api/explore/v2.1/catalog/datasets/st_arceau_p/exports/geojson?lang=fr&timezone=Europe%2FBerlin';

// Cache object to store the racks data and last fetch time
interface Cache {
  data: any | null;
  lastFetch: Date | null;
}

let cache: Cache = {
  data: null,
  lastFetch: null
};

async function fetchRacks() {
  const now = new Date();
  
  // Check if cache is valid (less than 24 hours old)
  if (cache.data && cache.lastFetch && (now.getTime() - cache.lastFetch.getTime() < 24 * 60 * 60 * 1000)) {
    console.log('Returning cached data');
    return cache.data;
  }

  console.log('Fetching fresh data');
  const response = await fetch(racksUrl, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
  if (!response.ok) {
    console.error({response})
    throw new Error('Failed to fetch racks data, response: ' + response.statusText);
  }
  const data = await response.json();
  
  // Update cache
  cache.data = data;
  cache.lastFetch = now;
  
  return data;
}

export async function GET(event) {
  try {
    const racks = await fetchRacks();
    return json(racks)
  } catch (error) {
    return new Response('Failed to fetch racks data, error: ' + error, { status: 500 });
  }
}
