<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let layers: { id: string; name: string; visible: boolean }[];

  const dispatch = createEventDispatcher();

  function toggleLayer(layerId: string) {
    dispatch('toggleLayer', { layerId });
  }

  function closeLayerControl() {
    dispatch('close');
  }
</script>

<div class="layer-control">
  <div class="layer-control-header">
    <h3>Layers</h3>
    <button class="close-btn" on:click={closeLayerControl}>×</button>
  </div>
  {#each layers as layer}
    <div class="layer-item">
      <input
        type="checkbox"
        id={layer.id}
        checked={layer.visible}
        on:change={() => toggleLayer(layer.id)}
      />
      <label for={layer.id}>{layer.name}</label>
    </div>
  {/each}
</div>

<style>
  .layer-control {
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0,0,0,0.1);
  }

  .layer-control-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
  }

  h3 {
    margin: 0;
  }

  .close-btn {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    padding: 0;
    line-height: 1;
  }

  .layer-item {
    margin: 10px 0;
  }
</style>
