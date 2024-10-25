# Boop: Bordeaux Bike Rack Finder

<img src="https://boop-bay.vercel.app/assets/images/twitter-preview.png" alt="Boop Twitter Preview" style="width: 20%;">

Boop (short for **B**ordeaux bike h**oop**s) is a sleek web application that helps cyclists in Bordeaux locate available bike racks. Leveraging the power of Mapbox GL and the Bordeaux Metropole Open Data API, Boop provides an interactive map interface to visualize various types of bike racks across the city.

## 🚀 Live Demo

Experience **Boop** in action: [https://boop-bay.vercel.app/](https://boop-bay.vercel.app/)

## 🎯 Purpose

As cycling gains popularity in urban areas, finding secure parking spots for bikes becomes crucial. While Bordeaux generally has an abundance of bike racks with one usually in sight, Boop provides a helpful tool for those times when you need specific information. 

Boop addresses this need by offering:
- Up-to-date visualization of bike rack locations
- Information on rack types (standard, cargo, or motorbike)
- Number of available hoops at each location (capacity)

This app is particularly useful when you need to find a specific type of rack or want to plan ahead for areas you're less familiar with.

## 🛠 Tech Stack

Boop is built with these technologies:

- [SvelteKit](https://kit.svelte.dev/): for building a fast, efficient, and SEO-friendly web application
- [Mapbox GL JS](https://docs.mapbox.com/mapbox-gl-js/): for rendering interactive maps (this library is awesome, check it out!)
- [Vite](https://vitejs.dev/): as the build tool and development server 
- [TypeScript](https://www.typescriptlang.org/): for type-safe JavaScript development
- [Vercel](https://vercel.com/): for seamless deployment and hosting


## 🗺 Features

- Interactive map interface
- Cluster view for dense areas
- Detailed information on click/tap
- Responsive design for mobile and desktop
- Geolocation support
- Server-side caching for improved performance

Here's what's planned for future development:

- [ ] Add an "About" section to explain the project's approach and purpose in more detail
- [ ] Fix styling glitches 
- [ ] Implement a feature to highlight the closest bike racks to the user's location
- [ ] Enhance the user interface for a more visually appealing experience


## 🚴‍♂️ Types of Bike Racks

Boop visualizes three types of bike racks:

- 🚲 Standard bicycle racks
- 🚚 Cargo bicycle racks 
- 🏍 Motorbike racks (there are only a few of them)

> Each rack type is color-coded on the map for easy identification.

## 🛠 Development

To set up the project locally:

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with your Mapbox access token:
   ```
   VITE_MAPBOX_ACCESS_TOKEN=your_mapbox_token_here
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## 🤝 Contributing

Contributions to Boop are welcome! Whether it's bug fixes, feature additions, or documentation improvements, feel free to open a pull request.

## 📄 License

Boop is open-source software licensed under the MIT license.

## 🙏 Acknowledgements

- Bordeaux Metropole for providing the open data API
- Mapbox for their excellent mapping platform
- The Svelte and SvelteKit communities for their fantastic tools and support

---

Happy cycling, Bordeaux! 🚴‍♂️🇫🇷
