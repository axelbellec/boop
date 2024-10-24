mapboxgl.accessToken =
  "pk.eyJ1IjoiYmVsbGVjb29vIiwiYSI6ImNtMm5nODgyczA2b2cyaXNja2lvemZrYjUifQ.EaLPV2FXjpbys9194nYW4Q";

// Initialize the map centered on Bordeaux
const map = new mapboxgl.Map({
  container: "map",
  center: [-0.5792, 44.8378],
  zoom: 13,
});

// Function to get typology text
function getTypologyText(typologie) {
  const typologyMap = {
    ARCEAU_MOTO: "Motorbike",
    ARCEAU_VELO: "Bike",
    ARCEAU_VELO_CARGO: "Bike + Cargo",
  };
  return typologyMap[typologie] || "Unknown";
}

// Function to map feature properties to new names
function mapFeatureProperties(feature) {
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
function createPopupDescription(rackTypology, rackCount) {
  return `
    <strong>Rack Type</strong><br> 
    ${rackTypology}<br><br>
    <strong>Racks Available</strong><br>
    ${rackCount || "N/A"}
  `;
}

// Function to handle cluster click
function handleClusterClick(e) {
  const features = map.queryRenderedFeatures(e.point, {
    layers: ["clusters"],
  });
  const clusterId = features[0].properties.cluster_id;
  map.getSource("racks").getClusterExpansionZoom(clusterId, (err, zoom) => {
    if (err) return;

    map.easeTo({
      center: features[0].geometry.coordinates,
      zoom: zoom,
    });
  });
}

// Function to handle unclustered point interaction
function handleUnclusteredPointInteraction(e, popup) {
  const coordinates = e.features[0].geometry.coordinates.slice();
  const { rackTypology, rackCount } = e.features[0].properties;

  const description = createPopupDescription(rackTypology, rackCount);

  while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
    coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
  }

  popup.setLngLat(coordinates).setHTML(description).addTo(map);
}

// Function to add map layers
function addMapLayers(data) {
  map.addSource("racks", {
    type: "geojson",
    data: data,
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

// Load GeoJSON data
fetch("opendata-bordeaux-st_arceau_p.geojson")
  .then((response) => response.json())
  .then((data) => {
    // Use the modular function to map the properties
    data.features = data.features.map(mapFeatureProperties);

    map.on("style.load", () => {
      map.setConfigProperty("lightPreset", "dusk");
    });

    map.on("load", () => {
      addMapLayers(data);

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
    });

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
  })
  .catch((error) => console.error("Error loading GeoJSON data:", error));
