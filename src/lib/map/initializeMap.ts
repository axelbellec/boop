import mapboxgl from "mapbox-gl";

export function initializeMap(): mapboxgl.Map {
  mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

  const map = new mapboxgl.Map({
    container: "map",
    center: [-0.5792, 44.8378],
    zoom: 13,
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

  return map;
}
