# Boop

**Boop** stands for **(B)ordeaux bike (hoop)s**, which refers to bike racks. This project aims to create a simple website that displays the Boops on a map using data from the Open Data API of Bordeaux Metropole.

# Purpose

The primary goal of this project is to provide a convenient tool for cyclists in Bordeaux to locate available bike racks. By visualizing the data from the Bordeaux Metropole Open Data platform, users can easily find the nearest bike rack that suits their needs, whether for a standard bike, motorbike, or cargo bike. This project aims to promote cycling as a sustainable mode of transportation by making it easier to secure bikes in the city.

### Accessing GeoJSON Data

To access the GeoJSON data, use the following command:

```bash
curl -H "Content-Type: application/json" \
    -X GET "https://opendata.bordeaux-metropole.fr/api/explore/v2.1/catalog/datasets/st_arceau_p/exports/geojson?lang=fr&timezone=Europe%2FBerlin" | jq > racks.son
```

### Types of Boops

The data file contains three types of Boops, which are identified by the `.features[].properties.typologie` field:

- `ARCEAU_MOTO`: Motorbike racks
- `ARCEAU_VELO`: Standard bicycle racks
- `ARCEAU_VELO_CARGO`: Cargo bicycle racks

### Features

For each rack, the website will display the number of hoops when clicked, which is specified in the `.features[].properties.nombre` field.

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```bash
# create a new project in the current directory
npx sv create

# create a new project in my-app
npx sv create my-app
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.