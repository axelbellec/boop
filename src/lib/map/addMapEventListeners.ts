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
    map.on("mouseenter", "racks-circle", (e) => {
        map.getCanvas().style.cursor = "pointer";
        handlePointInteraction(e, map, popup, "racks", createRackPopupDescription);
    });

    map.on("mouseleave", "racks-circle", () => {
        map.getCanvas().style.cursor = "";
        popup.remove();
    });

    map.on("click", "racks-circle", (e) => {
        handlePointInteraction(e, map, popup, "racks", createRackPopupDescription);
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
