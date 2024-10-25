import { json } from '@sveltejs/kit';
import { fetchAndCache } from '$lib/utils/fetchAndCache';

const racksUrl = 'https://opendata.bordeaux-metropole.fr/api/explore/v2.1/catalog/datasets/st_arceau_p/exports/geojson?lang=fr&timezone=Europe%2FBerlin';

export async function GET() {
  try {
    const racks = await fetchAndCache(racksUrl, 'racks');
    return json(racks);
  } catch (error) {
    return new Response('Failed to fetch racks data: ' + error, { status: 500 });
  }
}
