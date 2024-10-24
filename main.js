mapboxgl.accessToken = "pk.eyJ1IjoiYmVsbGVjb29vIiwiYSI6ImNtMm5nODgyczA2b2cyaXNja2lvemZrYjUifQ.EaLPV2FXjpbys9194nYW4Q";


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

// Load GeoJSON data
fetch("opendata-bordeaux-st_arceau_p.geojson")
  .then((response) => response.json())
  .then((data) => {
    map.on("style.load", () => {
      map.setConfigProperty("basemap", "lightPreset", "dusk");
    });
    map.on("load", () => {
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
            "#51bbd6",
            100,
            "#f1f075",
            750,
            "#f28cb1",
          ],
          "circle-radius": [
            "step",
            ["get", "point_count"],
            20,
            100,
            30,
            750,
            40,
          ],
        },
      });

      map.addLayer({
        id: "cluster-count",
        type: "symbol",
        source: "racks",
        filter: ["has", "point_count"],
        layout: {
          "text-field": "{point_count_abbreviated}",
          "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
          "text-size": 12,
        },
      });

      map.addLayer({
        id: "unclustered-point",
        type: "circle",
        source: "racks",
        filter: ["!", ["has", "point_count"]],
        paint: {
          "circle-color": ["get", "typologie"],
          "circle-radius": 6,
          "circle-stroke-width": 1,
          "circle-stroke-color": "#fff",
        },
      });

      // Add click event for clusters
      map.on('click', 'clusters', (e) => {
        const features = map.queryRenderedFeatures(e.point, { layers: ['clusters'] });
        const clusterId = features[0].properties.cluster_id;
        map.getSource('racks').getClusterExpansionZoom(
          clusterId,
          (err, zoom) => {
            if (err) return;

            map.easeTo({
              center: features[0].geometry.coordinates,
              zoom: zoom
            });
          }
        );
      });

      // Change cursor to pointer when hovering over clusters
      map.on('mouseenter', 'clusters', () => {
        map.getCanvas().style.cursor = 'pointer';
      });

      // Change cursor back when not hovering over clusters
      map.on('mouseleave', 'clusters', () => {
        map.getCanvas().style.cursor = '';
      });
    });

    // Create a popup, but don't add it to the map yet.
    const popup = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false,
      maxWidth: '300px'
    });

    map.on("mouseenter", "unclustered-point", (e) => {
      map.getCanvas().style.cursor = "pointer";

      const coordinates = e.features[0].geometry.coordinates.slice();
      const { typologie: rackTypology, nombre: rackCount } = e.features[0].properties;

      const description = `
                <strong>Rack Type:</strong> ${getTypologyText(rackTypology)}<br>
                <strong>Racks Available:</strong> ${rackCount || "N/A"}
            `;

      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      }

      popup.setLngLat(coordinates).setHTML(description).addTo(map);
    });

    map.on("mouseleave", "unclustered-point", () => {
      map.getCanvas().style.cursor = "";
      popup.remove();
    });

    // Add touch event for mobile devices
    map.on('click', 'unclustered-point', (e) => {
      const coordinates = e.features[0].geometry.coordinates.slice();
      const { typologie: rackTypology, nombre: rackCount } = e.features[0].properties;

      const description = `
                <strong>Rack Type:</strong> ${getTypologyText(rackTypology)}<br>
                <strong>Racks Available:</strong> ${rackCount || "N/A"}
            `;

      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      }

      popup.setLngLat(coordinates).setHTML(description).addTo(map);
    });
  })
  .catch((error) => console.error("Error loading GeoJSON data:", error));

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
map.addControl(nav, 'top-right');

// Adjust map size on window resize
window.addEventListener('resize', () => {
  map.resize();
});
