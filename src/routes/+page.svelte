<script lang="ts">
  import { onMount } from "svelte";
  import Map from "$lib/components/Map.svelte";
  import { mapRackProperties, mapFountainProperties, mapPublicToiletProperties } from "$lib/utils";

  let racksData: GeoJSON.FeatureCollection;
  let fountainsData: GeoJSON.FeatureCollection;
  let publicToiletsData: GeoJSON.FeatureCollection;

  const fetchAndMapData = async (url: string, mapFunction: (feature: any) => any) => {
    const response = await fetch(url);
    const data: GeoJSON.FeatureCollection = await response.json();
    data.features = data.features.map(mapFunction);
    return data;
  };

  onMount(async () => {
    [racksData, fountainsData, publicToiletsData] = await Promise.all([
      fetchAndMapData("/api/racks", mapRackProperties),
      fetchAndMapData("/api/drinking-fountains", mapFountainProperties),
      fetchAndMapData("/api/public-toilets", mapPublicToiletProperties),
    ]);
  });
</script>

<svelte:head>
  <title>Boop - Bordeaux Bike Rack Finder</title>
  <meta
    name="description"
    content="Find bike racks in Bordeaux easily with Boop. Locate standard, cargo, and motorbike parking spots across the city."
  />
</svelte:head>

{#if racksData && fountainsData && publicToiletsData}
  <Map {racksData} {fountainsData} {publicToiletsData} />
{:else}
  <div>Loading...</div>
{/if}

<style>
  :global(body) {
    margin: 0;
    padding: 0;
  }

  :global(#map) {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100%;
  }
</style>
