import fs from 'fs/promises';
import path from 'path';
import fetch from 'node-fetch';

import racks from './racks.json'

const racksUrl = 'https://opendata.bordeaux-metropole.fr/api/explore/v2.1/catalog/datasets/st_arceau_p/exports/geojson?lang=fr&timezone=Europe%2FBerlin';

async function fetchAndCacheRacks() {
  const response = await fetch(racksUrl, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
  if (!response.ok) {
    console.error({response})
    throw new Error('Failed to fetch racks data');
  }
  const data = await response.json();
  // await fs.writeFile(racksFilePath, JSON.stringify(data, null, 2));
  return data;
}

export async function GET(event) {
  // try {
  //   // Check if racks.json exists
  //   await fs.access(racksFilePath);
  //   // If it exists, read from the file
  //   console.log('racks.json exists');
  //   const racks = await fs.readFile(racksFilePath, 'utf-8');
  //   return new Response(racks, { status: 200 });
  // } catch (error) {
    // If it doesn't exist, fetch and cache it
    try {
      console.log('racks.json does not exist, fetching and caching it');
      const racks = await fetchAndCacheRacks();
      return new Response(JSON.stringify(racks), { status: 200 });
    } catch (fetchError) {
      return new Response('Failed to fetch racks data', { status: 500 });
    }
  // }
}
