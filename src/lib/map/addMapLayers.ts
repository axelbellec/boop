import mapboxgl from "mapbox-gl";
import type { GeoJSONData } from "$lib/types";


export function addMapLayers(
    map: mapboxgl.Map,
    racksData: GeoJSON.FeatureCollection,
    fountainsData: GeoJSON.FeatureCollection,
    publicToiletsData: GeoJSON.FeatureCollection
) {
    addRacksLayer(map, racksData);
    addDrinkingFountainsLayer(map, fountainsData);
    addPublicToiletsLayer(map, publicToiletsData);
}

function addRacksLayer(map: mapboxgl.Map, data: GeoJSON.FeatureCollection) {
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

    // Load the bike image
    map.loadImage('/assets/images/bike.png', (error, image) => {
        if (error) throw error;

        // Add the image to the map's style
        if (image) {
            map.addImage('bike', image);
        }

        // Modify the unclustered-point layer
        // map.addLayer({
        //     id: "unclustered-point",
        //     type: "symbol",
        //     source: "racks",
        //     filter: ["!", ["has", "point_count"]],
        //     layout: {
        //         "icon-image": "bike",
        //         "icon-size": 0.06, // Adjust this value to change the size of the icon
        //         "icon-allow-overlap": true,
        //     },
        //     paint: {
        //         "icon-color": [
        //             "match",
        //             ["get", "rackTypology"],
        //             "Motorbike", "#FFC4DB",
        //             "Bike", "#993D51",
        //             "Bike + Cargo", "#BF6076",
        //             /* other */ "#ccc",
        //         ],
        //     },
        // });


        map.addLayer({
            id: "bikes-circle",
            type: "circle",
            source: "racks",
            filter: ["!", ["has", "point_count"]],
            paint: {
                "circle-color": "#FFE8C2",
                "circle-radius": 16,
            },
        });

        // Add the symbol layer
        map.addLayer({
            id: "bikes",
            type: "symbol",
            source: "racks",
            filter: ["!", ["has", "point_count"]],
            layout: {
                "icon-image": "bike",
                "icon-size": 0.06,
                "icon-allow-overlap": true,
            },
        });

    });
}


function addDrinkingFountainsLayer(
    map: mapboxgl.Map,
    data: GeoJSON.FeatureCollection
) {
    // Load the drinking fountain image
    map.loadImage('/assets/images/drinking-fountain.png', (error, image) => {
        if (error) throw error;

        // Add the image to the map's style
        if (image) {
            map.addImage('drinking-fountain', image);
        }

        // Add the GeoJSON source
        map.addSource("drinking-fountains", {
            type: "geojson",
            data: data,
        });

        // Add circle layer around drinking fountains
        map.addLayer({
            id: "drinking-fountains-circle",
            type: "circle",
            source: "drinking-fountains",
            paint: {
                "circle-color": "#9CC2E6",
                "circle-radius": 16,
            },
        });

        // Add the symbol layer
        map.addLayer({
            id: "drinking-fountains",
            type: "symbol",
            source: "drinking-fountains",
            layout: {
                "icon-image": "drinking-fountain",
                "icon-size": 0.07,
                "icon-allow-overlap": true,
            },
        });


    });
}

function addPublicToiletsLayer(
    map: mapboxgl.Map,
    data: GeoJSON.FeatureCollection
) {
    // Load the public toilet image
    map.loadImage('/assets/images/toilet.png', (error, image) => {
        if (error) throw error;

        // Add the image to the map's style
        if (image) {
            map.addImage('public-toilet', image);
        }

        // Add the GeoJSON source
        map.addSource("public-toilets", {
            type: "geojson",
            data: data,
        });

        // Add circle layer around public toilets
        map.addLayer({
            id: "public-toilets-circle",
            type: "circle",
            source: "public-toilets",
            paint: {
                "circle-color": "#E6AAB7", // Light pink color
                "circle-radius": 16,
            },
        });

        // Add the symbol layer
        map.addLayer({
            id: "public-toilets",
            type: "symbol",
            source: "public-toilets",
            layout: {
                "icon-image": "public-toilet",
                "icon-size": 0.07,
                "icon-allow-overlap": true,
            },
        });
    });
}
