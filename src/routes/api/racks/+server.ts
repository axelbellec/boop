import { json } from '@sveltejs/kit';

const racksUrl = 'https://opendata.bordeaux-metropole.fr/api/explore/v2.1/catalog/datasets/st_arceau_p/exports/geojson?lang=fr&timezone=Europe%2FBerlin';

async function fetchRacks() {
  const response = await fetch(racksUrl, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
  if (!response.ok) {
    console.error({response})
    throw new Error('Failed to fetch racks data, response: ' + response.statusText);
  }
  return await response.json()
}

export async function GET(event) {
  try {
    const racks = await fetchRacks();
    return json(racks)
  } catch (error) {
    return new Response('Failed to fetch racks data, error: ' + error, { status: 500 });
  }
}
