<script lang="ts">
  import { goto } from '$app/navigation';

  function handleBackClick() {
    goto('/');
  }
</script>

<div class="about-container">
  <nav>
    <button class="back-btn" on:click={handleBackClick}>⬅ Back to Map</button>
  </nav>
  
  <h2>About Boop</h2>
  
  <p>Boop (short for <strong>B</strong>ordeaux bike h<strong>oop</strong>s) is a web application designed to help cyclists in Bordeaux easily locate available bike racks. Our mission is to promote cycling and make it more convenient for residents and visitors to securely park their bikes throughout the city.</p>

  <h2>Our Approach</h2>
  <p>We leverage the power of modern web technologies and open data to provide an intuitive, user-friendly experience:</p>
  <ul>
    <li>Real-time data: We use the Bordeaux Metropole Open Data API to ensure our information is always up-to-date.</li>
    <li>Interactive mapping: With Mapbox GL, we offer a smooth, responsive map interface that works great on both desktop and mobile devices.</li>
    <li>Efficient development: Built with SvelteKit and TypeScript, Boop is fast, lightweight, and easy to maintain.</li>
  </ul>

  <h2>Features</h2>
  <ul>
    <li>Visualize different types of bike racks (standard, cargo, and motorbike)</li>
    <li>See the capacity of each rack location</li>
    <li>Cluster view for areas with many racks</li>
    <li>Geolocation support to find racks near you</li>
    <li>Responsive design for seamless use on any device</li>
  </ul>

  <h2>Why Boop?</h2>
  <p>While Bordeaux is generally well-equipped with bike racks, there are times when finding the right spot can be challenging. Boop aims to solve this by:</p>
  <ul>
    <li>Helping cyclists plan their routes with parking in mind</li>
    <li>Assisting in finding specific types of racks (e.g., cargo bike racks)</li>
    <li>Providing a useful tool for areas you're less familiar with</li>
    <li>Supporting the city's efforts to promote sustainable transportation</li>
  </ul>

  <p>We're constantly working to improve Boop and welcome feedback from our users. Happy cycling!</p>
</div>

<style>
  .about-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
    line-height: 1.6;
  }

  nav {
    margin-bottom: 2rem;
  }

  .back-btn {
    background-color: #732232;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 0.25rem;
    cursor: pointer;
    font-size: 1rem;
  }

  h1, h2 {
    color: #732232;
  }

  ul {
    padding-left: 1.5rem;
  }
</style>
