<script setup lang="ts">
import SquareImage from '../components/SquareImage.vue'
</script>

<template>
  <div class="search-empty">
    <SquareImage size="xl" src="/images/blitzcrank_sad_confused_inventory.png" />
    <div class="text-secondary">Nothing's here...</div>
  </div>
</template>

<style scoped>
.search-empty {
  @apply flex flex-col items-center;
}
</style>
