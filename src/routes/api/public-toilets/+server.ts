import { json } from '@sveltejs/kit';
import { fetchAndCache } from '$lib/utils/fetchAndCache';

const publicToiletsUrl = 'https://opendata.bordeaux-metropole.fr/api/explore/v2.1/catalog/datasets/bor_sigsanitaire/exports/geojson?lang=fr&timezone=Europe%2FBerlin';

export async function GET() {
  try {
    const publicToilets = await fetchAndCache(publicToiletsUrl, 'public-toilets');
    return json(publicToilets);
  } catch (error) {
    return new Response('Failed to fetch public toilets data: ' + error, { status: 500 });
  }
}
