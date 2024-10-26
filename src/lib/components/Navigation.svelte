<script lang="ts">
  import { goto } from "$app/navigation";
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  function handleAboutClick() {
    goto("/about");
  }

  function handleLayerClick() {
    dispatch('toggleLayerControl');
  }
</script>

<nav>
  <div class="nav-content">
    <a href="/" class="logo">Boop</a>
    <div class="nav-buttons">
      <button class="icon-btn" on:click={handleLayerClick} aria-label="Toggle Layer Control">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
          <polyline points="2 17 12 22 22 17"></polyline>
          <polyline points="2 12 12 17 22 12"></polyline>
        </svg>
      </button>
      <button class="about-btn" on:click={handleAboutClick}>About</button>
    </div>
  </div>
</nav>

<style>
  nav {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    background-color: #faf7f5;
    padding: 0.5rem 1rem;
  }

  .nav-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 1200px;
    margin: 0 auto;
  }

  .logo {
    font-size: 1.5rem;
    font-weight: bold;
    color: #732232;
    text-decoration: none;
  }

  .nav-buttons {
    display: flex;
    align-items: center;
  }

  .icon-btn {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.5rem;
    margin-right: 1rem;
    color: #732232;
  }

  .about-btn {
    background-color: #faf7f5;
    color: #732232;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 0.25rem;
    cursor: pointer;
    font-size: 1rem;
    font-weight: bold;
  }
</style>
