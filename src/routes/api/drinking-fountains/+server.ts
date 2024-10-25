import { json } from '@sveltejs/kit';
import { fetchAndCache } from '$lib/utils/fetchAndCache';

const fountainsUrl = 'https://opendata.bordeaux-metropole.fr/api/explore/v2.1/catalog/datasets/bor_fontaines_eau_potable/exports/geojson?lang=fr&timezone=Europe%2FBerlin';

export async function GET() {
  try {
    const fountains = await fetchAndCache(fountainsUrl, 'drinking-fountains');
    return json(fountains);
  } catch (error) {
    return new Response('Failed to fetch fountains data: ' + error, { status: 500 });
  }
}
