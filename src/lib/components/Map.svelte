<script lang="ts">
  import { onMount } from "svelte";
  import mapboxgl from "mapbox-gl";
  import "mapbox-gl/dist/mapbox-gl.css";
  import { initializeMap } from "$lib/map/initializeMap";
  import { addMapLayers } from "$lib/map/addMapLayers";
  import { addMapEventListeners } from "$lib/map/addMapEventListeners";
  import LayerControl from "$lib/components/LayerControl.svelte";
  import Navigation from "$lib/components/Navigation.svelte";
  import type { GeoJSONData } from "$lib/types";

  export let racksData: GeoJSON.FeatureCollection;
  export let fountainsData: GeoJSON.FeatureCollection;
  export let publicToiletsData: GeoJSON.FeatureCollection;
  let map: mapboxgl.Map;
  let showLayerControl = false;

  let layers = [
    { id: "racks", name: "Bike Racks", visible: true },
    { id: "drinking-fountains", name: "Drinking Fountains", visible: true },
    { id: "public-toilets", name: "Public Toilets", visible: true },
  ];

  function toggleLayerVisibility(event: CustomEvent) {
    const { layerId } = event.detail;
    const layer = layers.find(l => l.id === layerId);
    if (layer) {
      layer.visible = !layer.visible;
      layers = layers;  // Trigger reactivity

      const visibility = layer.visible ? "visible" : "none";
      map.setLayoutProperty(`${layerId}-circle`, "visibility", visibility);
      map.setLayoutProperty(`${layerId}-symbol`, "visibility", visibility);
      map.setLayoutProperty(layerId, "visibility", visibility);
    }
  }

  function toggleLayerControl() {
    showLayerControl = !showLayerControl;
  }

  function closeLayerControl() {
    showLayerControl = false;
  }

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
<Navigation on:toggleLayerControl={toggleLayerControl} />
{#if showLayerControl}
  <div class="layer-control-overlay">
    <LayerControl {layers} on:toggleLayer={toggleLayerVisibility} on:close={closeLayerControl} />
  </div>
{/if}

<style>
  #map {
    width: 100%;
    height: 100%;
  }

  .layer-control-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1001;
  }

  :global(.layer-control-overlay .layer-control) {
    position: relative;
    top: auto;
    right: auto;
    max-width: 300px;
    width: 90%;
  }
</style>
