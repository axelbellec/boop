import mapboxgl from "mapbox-gl";
import type { MapMouseEvent } from "mapbox-gl";
import { createRackPopupDescription, createFountainPopupDescription, createPublicToiletPopupDescription } from "$lib/utils";

export function addMapEventListeners(map: mapboxgl.Map) {
    // Create a popup, but don't add it to the map yet.
    const popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false,
        maxWidth: "300px",
    });

    // Add event listeners for bike racks
    map.on("mouseenter", "bikes-circle", (e) => {
        map.getCanvas().style.cursor = "pointer";
        handlePointInteraction(e, map, popup, "bikes", createRackPopupDescription);
    });

    map.on("mouseleave", "bikes-circle", () => {
        map.getCanvas().style.cursor = "";
        popup.remove();
    });

    map.on("click", "bikes-circle", (e) => {
        handlePointInteraction(e, map, popup, "bikes", createRackPopupDescription);
    });

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

    // Add touch event for mobile devices
    map.on("click", "unclustered-point-circle", (e) => {
        handlePointInteraction(e, map, popup, "unclustered-point", createRackPopupDescription);
    });

    // Add event listeners for drinking fountains
    map.on("mouseenter", "drinking-fountains-circle", (e) => {
        map.getCanvas().style.cursor = "pointer";
        handlePointInteraction(e, map, popup, "drinking-fountains", createFountainPopupDescription);
    });

    map.on("mouseleave", "drinking-fountains-circle", () => {
        map.getCanvas().style.cursor = "";
        popup.remove();
    });

    map.on("click", "drinking-fountains-circle", (e) => {
        handlePointInteraction(e, map, popup, "drinking-fountains", createFountainPopupDescription);
    });

    // Add event listeners for public toilets
    map.on("mouseenter", "public-toilets-circle", (e) => {
        map.getCanvas().style.cursor = "pointer";
        handlePointInteraction(e, map, popup, "public-toilets", createPublicToiletPopupDescription);
    });

    map.on("mouseleave", "public-toilets-circle", () => {
        map.getCanvas().style.cursor = "";
        popup.remove();
    });

    map.on("click", "public-toilets-circle", (e) => {
        handlePointInteraction(e, map, popup, "public-toilets", createPublicToiletPopupDescription);
    });
}

function handleClusterClick(e: MapMouseEvent, map: mapboxgl.Map) {
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
    e: MapMouseEvent,
    map: mapboxgl.Map,
    popup: mapboxgl.Popup
) {
    const coordinates = e.features?.[0].geometry?.coordinates.slice() as [
        number,
        number,
    ];
    const { rackTypology, rackCount } = e.features?.[0].properties || {};

    const description = createRackPopupDescription(rackTypology, rackCount);

    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }

    popup.setLngLat(coordinates).setHTML(description).addTo(map);
}

function handlePointInteraction(
    e: MapMouseEvent,
    map: mapboxgl.Map,
    popup: mapboxgl.Popup,
    sourceId: string,
    createDescription: (properties: any) => string
) {
    const features = map.queryRenderedFeatures(e.point, {
        layers: [`${sourceId}-circle`],
    });

    if (!features.length) return;

    const feature = features[0];
    const coordinates = feature.geometry.type === "Point" ? feature.geometry.coordinates.slice() as [number, number] : [0, 0];

    const description = createDescription(feature.properties);

    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }

    popup.setLngLat(coordinates).setHTML(description).addTo(map);
}
