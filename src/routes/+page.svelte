<script lang="ts">
  import mapboxgl from "mapbox-gl";
  import { onMount } from "svelte";
  import type { MapMouseEvent } from "mapbox-gl";
  import "mapbox-gl/dist/mapbox-gl.css";
  import { browser } from "$app/environment";
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";

  let map: mapboxgl.Map;

  function handleAboutClick() {
    goto("/about");
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

    // Wait for map to load and data to be fetched
    Promise.all([
      new Promise((resolve) => map.on("load", resolve)),
      fetch("/api/racks")
        .then((response) => response.json())
        .then((data: GeoJSONData) => {
          data.features = data.features.map(mapFeatureProperties);
          return data;
        }),
      fetch("/api/drinking-fountains")
        .then((response) => response.json())
        .then((data: GeoJSON.FeatureCollection) => {
          data.features = data.features.map(mapFountainProperties);
          return data;
        }),
    ])
      .then(([_, racksData, fountainsData]) => {
        handleLoadedData(racksData, fountainsData);
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

  function handleLoadedData(
    racksData: GeoJSONData,
    fountainsData: GeoJSON.FeatureCollection
  ) {
    console.log("Data loaded");
    addMapLayers(racksData);
    addDrinkingFountainsLayer(fountainsData);
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

  function mapFountainProperties(feature: Feature): Feature {
    const { nom_fontaine, adresse, hivernage, date_dernier_controle, ...rest } = feature.properties;
    return {
      ...feature,
      properties: {
        ...rest,
        fountainName: nom_fontaine,
        fountainAddress: adresse,
        fountainInWinterization: hivernage,
        fountainLastControlDate: date_dernier_controle,
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

  function addDrinkingFountainsLayer(data: GeoJSON.FeatureCollection) {
    map.loadImage('/assets/images/drinking-fountain.png', (error, image) => {
      if (error) throw error;
      
      if (image) {
        map.addSource("drinking-fountains", {
          type: "geojson",
          data: data,
        });
        
        map.addImage('drinking-fountain', image);
        
        // Add white circle layer
        map.addLayer({
          id: "drinking-fountains-circle",
          type: "circle",
          source: "drinking-fountains",
          paint: {
            "circle-radius": 14,
            "circle-color": "#BEE2FF",
            "circle-opacity": 0.9,
            "circle-stroke-width": 1,
            "circle-stroke-color": "#10244A",
            "circle-stroke-opacity": 0.8,
          }
        });

        // Add fountain icon layer
        map.addLayer({
          id: "drinking-fountains-icon",
          type: "symbol",
          source: "drinking-fountains",
          layout: {
            "icon-image": "drinking-fountain",
            "icon-size": 0.06, // Adjust this value to change the size of the icon
            "icon-allow-overlap": true
          }
        });

        // Add popup for drinking fountains
        const fountainPopup = new mapboxgl.Popup({
          closeButton: false,
          closeOnClick: false,
        });

        // Update event listeners to work with both layers
        ["drinking-fountains-circle", "drinking-fountains-icon"].forEach(layerId => {
          map.on("mouseenter", layerId, (e) => {
            if (e.features && e.features.length > 0) {
              map.getCanvas().style.cursor = "pointer";
              const coordinates = e.features[0].geometry.coordinates.slice() as [number, number];
              const properties = e.features[0].properties;

              const description = `
                <strong>Drinking Fountain</strong><br>
                ${properties?.fountainName || "Unnamed"}<br>
                ${properties?.fountainAddress || "No address available"}<br><br>
                ${properties?.fountainInWinterization ? "In winterization " : "Not in winterization"}<br>
                ${properties?.fountainLastControlDate ? `Last control date: ${properties.fountainLastControlDate}` : ""}<br>
              `;

              fountainPopup.setLngLat(coordinates).setHTML(description).addTo(map);
            }
          });

          map.on("mouseleave", layerId, () => {
            map.getCanvas().style.cursor = "";
            fountainPopup.remove();
          });
        });
      }
    });
  }
</script>

<svelte:head>
  <title>Boop - Bordeaux Bike Rack Finder</title>
  <meta
    name="description"
    content="Find bike racks in Bordeaux easily with Boop. Locate standard, cargo, and motorbike parking spots across the city."
  />
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
    background-color: #faf7f5;
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
    background-color: #faf7f5;
    color: #732232;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 0.25rem;
    cursor: pointer;
    font-size: 1rem;
    font-weight: bold;
  }
</style>
