<script setup lang="ts">
import SquareImage from './SquareImage.vue'
</script>

<template>
  <div class="header">
    <router-link to="/" class="header__btn-link">
      <SquareImage src="/images/logo.png" size="sm" />
      <span>TFT Fan</span>
    </router-link>
    <router-link to="/champions" class="header__btn-link">
      Champions
    </router-link>
  </div>
</template>

<style scoped>
.header {
  @apply container mx-auto flex;
}

.header__btn-link {
  @apply inline-flex items-center p-4 duration-100 hover:bg-slate-700;
}

.header__btn-link > * {
  @apply mr-2;
}

.header__btn-link > *:last-child {
  @apply mr-0;
}
</style>
