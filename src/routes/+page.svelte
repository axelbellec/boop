<script lang="ts">
  import { onMount } from "svelte";
  import Map from "$lib/components/Map.svelte";
  import Navigation from "$lib/components/Navigation.svelte";
  
  import { mapRackProperties, mapFountainProperties, mapPublicToiletProperties } from "$lib/utils";

  let racksData: GeoJSON.FeatureCollection;
  let fountainsData: GeoJSON.FeatureCollection;
  let publicToiletsData: GeoJSON.FeatureCollection;

  onMount(async () => {
    const [racksResponse, fountainsResponse, publicToiletsResponse] = await Promise.all([
      fetch("/api/racks"),
      fetch("/api/drinking-fountains"),
      fetch("/api/public-toilets"),
    ]);

    racksData = await racksResponse.json();
    racksData.features = racksData.features.map(mapRackProperties);

    fountainsData = await fountainsResponse.json();
    fountainsData.features = fountainsData.features.map(mapFountainProperties);

    publicToiletsData = await publicToiletsResponse.json();
    publicToiletsData.features = publicToiletsData.features.map(mapPublicToiletProperties);
  });
</script>

<svelte:head>
  <title>Boop - Bordeaux Bike Rack Finder</title>
  <meta
    name="description"
    content="Find bike racks in Bordeaux easily with Boop. Locate standard, cargo, and motorbike parking spots across the city."
  />
</svelte:head>

<Navigation />

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
