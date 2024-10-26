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
    <a href="/" class="logo"><b>boop</b>.beta</a>
    <div class="nav-buttons">
      <button class="nav-btn" on:click={handleLayerClick}>Layers</button>
      <button class="nav-btn" on:click={handleAboutClick}>About</button>
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
    font-family: 'Gelasio', Arial, sans-serif;
  }

  .nav-buttons {
    display: flex;
    align-items: center;
  }

  .nav-btn {
    background-color: #faf7f5;
    color: #732232;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 0.25rem;
    cursor: pointer;
    font-size: 1rem;
    font-family: 'Gelasio', Arial, sans-serif;
    font-weight: bold;
    margin-left: 0.5rem;
  }

  .nav-btn:hover {
    background-color: #732232;
    color: #faf7f5;
  }
</style>
