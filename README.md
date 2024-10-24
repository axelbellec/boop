Boop → (B)ordeaux bike (hoop)s = racks

I want to create a very simple website that displays the Boops on a map.

The data is in the `opendata-bordeaux-st_arceau_p.geojson` GeoJSON file.


Access GeoJSON:

```bash
curl -H "Content-Type: application/json" \
    -X GET "https://opendata.bordeaux-metropole.fr/api/explore/v2.1/catalog/datasets/st_arceau_p/exports/geojson?lang=fr&timezone=Europe%2FBerlin" | jq > opendata-bordeaux-st_arceau_p.geojson
```

There are 3 types of Boops in the datafile (`.features[].properties.typologie`)
- `ARCEAU_MOTO`: motorbikes racks
- `ARCEAU_VELO`: standard bicycles racks
- `ARCEAU_VELO_CARGO`: cargo bicycles racks

For each rack, I want to display the number of hoops on click (`.features[].properties.nombre`)
