<script lang="ts">
  import { onMount } from "svelte";
  import mapboxgl from "mapbox-gl";
  import "mapbox-gl/dist/mapbox-gl.css";
  import { initializeMap } from "$lib/map/initializeMap";
  import { addMapLayers } from "$lib/map/addMapLayers";
  import { addMapEventListeners } from "$lib/map/addMapEventListeners";
  import type { GeoJSONData } from "$lib/types";

  export let racksData: GeoJSON.FeatureCollection;
  export let fountainsData: GeoJSON.FeatureCollection;
  export let publicToiletsData: GeoJSON.FeatureCollection;
  let map: mapboxgl.Map;

  onMount(() => {
    map = initializeMap();

    map.on("load", () => {
      addMapLayers(map, racksData, fountainsData, publicToiletsData);
      addMapEventListeners(map);
    });

    return () => {
      map.remove();
    };
  });
</script>

<div id="map"></div>

<style>
  #map {
    width: 100%;
    height: 100%;
  }
</style>
