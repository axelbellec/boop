import mapboxgl from "mapbox-gl";
import type { MapMouseEvent } from "mapbox-gl";
import { createPopupDescription } from "$lib/utils";

export function addMapEventListeners(map: mapboxgl.Map) {
    // Add click event for clusters
    map.on("click", "clusters", (e) => handleClusterClick(e, map));

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

    map.on("mouseenter", "unclustered-point-circle", (e) => {
        map.getCanvas().style.cursor = "pointer";
        handleUnclusteredPointInteraction(e, map, popup);
    });

    map.on("mouseleave", "unclustered-point-circle", () => {
        map.getCanvas().style.cursor = "";
        popup.remove();
    });

    // Add touch event for mobile devices
    map.on("click", "unclustered-point-circle", (e) => {
        handleUnclusteredPointInteraction(e, map, popup);
    });
}

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
