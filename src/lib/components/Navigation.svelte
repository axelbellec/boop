<script lang="ts">
  import { goto } from "$app/navigation";

  function handleAboutClick() {
    goto("/about");
  }
</script>

<nav>
  <div class="nav-content">
    <a href="/" class="logo">Boop</a>
    <button class="about-btn" on:click={handleAboutClick}>About</button>
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
