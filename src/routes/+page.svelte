<script lang="ts">
  import mapboxgl from "mapbox-gl";
  import { onMount } from "svelte";
  import type { MapMouseEvent } from "mapbox-gl";
  import 'mapbox-gl/dist/mapbox-gl.css';
  import { browser } from '$app/environment';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';

  let map: mapboxgl.Map;

  function handleAboutClick() {
    goto('/about');
  }

  onMount(() => {
    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

    map = new mapboxgl.Map({
      container: "map", // container ID
      center: [-0.5792, 44.8378],
      zoom: 13,
    });

    // Initialize map controls here
    initializeMapControls();

    // Wait for both map to load and data to be fetched
    Promise.all([
      new Promise((resolve) => map.on("load", resolve)),
      fetch("/api/racks")
        .then((response) => response.json())
        .then((data: GeoJSONData) => {
          // Use the modular function to map the properties
          data.features = data.features.map(mapFeatureProperties);
          return data;
        }),
    ])
      .then(([_, data]) => {
        handleLoadedData(data);
      })
      .catch((error) =>
        console.error("Error loading map or GeoJSON data:", error)
      );
  });

  function initializeMapControls() {
    // Add geolocate control
    const geolocate = new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
      },
      trackUserLocation: true,
    });
    map.addControl(geolocate);

    // Add navigation control
    const nav = new mapboxgl.NavigationControl();
    map.addControl(nav, "top-right");

    // Adjust map size on window resize
    window.addEventListener("resize", () => {
      map.resize();
    });
  }

  function handleLoadedData(data: GeoJSONData) {
    console.log("Data loaded");
    addMapLayers(data);
    // Add event listeners for map interactions
    addMapEventListeners();
  }

  function addMapEventListeners() {
    // Add click event for clusters
    map.on("click", "clusters", handleClusterClick);

    // Change cursor to pointer when hovering over clusters
    map.on("mouseenter", "clusters", () => {
      map.getCanvas().style.cursor = "pointer";
    });

    // Change cursor back when not hovering over clusters
    map.on("mouseleave", "clusters", () => {
      map.getCanvas().style.cursor = "";
    });

    // Create a popup, but don't add it to the map yet.
    const popup = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false,
      maxWidth: "300px",
    });

    map.on("mouseenter", "unclustered-point", (e) => {
      map.getCanvas().style.cursor = "pointer";
      handleUnclusteredPointInteraction(e, popup);
    });

    map.on("mouseleave", "unclustered-point", () => {
      map.getCanvas().style.cursor = "";
      popup.remove();
    });

    // Add touch event for mobile devices
    map.on("click", "unclustered-point", (e) => {
      handleUnclusteredPointInteraction(e, popup);
    });
  }

  // Define types for your data structures
  type FeatureProperties = {
    typologie: string;
    nombre: number;
    [key: string]: any;
  };

  type Feature = {
    properties: FeatureProperties;
    [key: string]: any;
  };

  type GeoJSONData = {
    features: Feature[];
    [key: string]: any;
  };

  // Function to get typology text
  function getTypologyText(typologie: string): string {
    const typologyMap: { [key: string]: string } = {
      ARCEAU_MOTO: "Motorbike",
      ARCEAU_VELO: "Bike",
      ARCEAU_VELO_CARGO: "Bike + Cargo",
    };
    return typologyMap[typologie] || "Unknown";
  }

  // Function to map feature properties to new names
  function mapFeatureProperties(feature: Feature): Feature {
    const { typologie, nombre, ...rest } = feature.properties;
    return {
      ...feature,
      properties: {
        ...rest,
        rackTypology: getTypologyText(typologie),
        rackCount: nombre,
      },
    };
  }

  // Function to create a popup description
  function createPopupDescription(
    rackTypology: string,
    rackCount: number
  ): string {
    return `
              <strong>Rack Type</strong><br> 
              ${rackTypology}<br><br>
              <strong>Racks Available</strong><br>
              ${rackCount || "N/A"}
          `;
  }

  // Function to handle cluster click
  function handleClusterClick(e: MapMouseEvent & EventData) {
    const features = map.queryRenderedFeatures(e.point, {
      layers: ["clusters"],
    }) as mapboxgl.GeoJSONFeature[];

    if (features.length === 0) return;

    const clusterId = features[0].properties?.cluster_id;
    if (!clusterId) return;

    map.getSource("racks")?.getClusterExpansionZoom(clusterId, (err, zoom) => {
      if (err || !zoom) return;

      map.easeTo({
        center: features[0].geometry?.coordinates as mapboxgl.LngLatLike,
        zoom: zoom,
      });
    });
  }

  // Function to handle unclustered point interaction
  function handleUnclusteredPointInteraction(
    e: MapMouseEvent & EventData,
    popup: mapboxgl.Popup
  ) {
    const coordinates = e.features?.[0].geometry?.coordinates.slice() as [
      number,
      number,
    ];
    const { rackTypology, rackCount } = e.features?.[0].properties || {};

    const description = createPopupDescription(rackTypology, rackCount);

    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
      coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }

    popup.setLngLat(coordinates).setHTML(description).addTo(map);
  }

  // Function to add map layers
  function addMapLayers(data: GeoJSONData) {
    map.addSource("racks", {
      type: "geojson",
      data: data as unknown as GeoJSON,
      cluster: true,
      clusterMaxZoom: 16,
      clusterRadius: 50,
    });

    map.addLayer({
      id: "clusters",
      type: "circle",
      source: "racks",
      filter: ["has", "point_count"],
      paint: {
        "circle-color": [
          "step",
          ["get", "point_count"],
          "#993D51",
          100,
          "#732232",
          750,
          "#4A0E18",
        ],
        "circle-radius": ["step", ["get", "point_count"], 20, 100, 30, 750, 40],
      },
    });

    map.addLayer({
      id: "cluster-count",
      type: "symbol",
      source: "racks",
      filter: ["has", "point_count"],
      layout: {
        "text-field": "{point_count_abbreviated}",
        "text-font": ["Rubik Medium", "Arial Unicode MS Bold"],
        "text-size": 12,
      },
      paint: {
        "text-color": "#FAF7F5", // Set text color to white
      },
    });

    map.addLayer({
      id: "unclustered-point",
      type: "circle",
      source: "racks",
      filter: ["!", ["has", "point_count"]],
      paint: {
        "circle-color": [
          "match",
          ["get", "rackTypology"],
          "Motorbike",
          "#FFC4DB",
          "Bike",
          "#993D51",
          "Bike + Cargo",
          "#BF6076",
          /* other */ "#ccc",
        ],
        "circle-radius": 7,
        "circle-stroke-width": 2,
        "circle-stroke-color": "#fff",
      },
    });
  }

  
</script>

<svelte:head>
  <title>Boop - Bordeaux Bike Rack Finder</title>
  <meta name="description" content="Find bike racks in Bordeaux easily with Boop. Locate standard, cargo, and motorbike parking spots across the city." />
</svelte:head>

<nav>
  <div class="nav-content">
    <a href="/" class="logo">Boop</a>
    <button class="about-btn" on:click={handleAboutClick}>About</button>
  </div>
</nav>


<div id="map"></div>

<style>


  nav {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    background-color: #FAF7F5;
    padding: 0.5rem 1rem;
  }

  .nav-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 1200px;
    margin: 0 auto;
  }

  .logo {
    font-size: 1.5rem;
    font-weight: bold;
    color: #732232;
    text-decoration: none;
  }

  .about-btn {
    background-color: #FAF7F5;
    color: #732232;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 0.25rem;
    cursor: pointer;
    font-size: 1rem;
    font-weight: bold;
  }
</style>
