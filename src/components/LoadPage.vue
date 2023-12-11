<script setup lang="ts">
import { toRefs } from 'vue'

interface Props {
  isLoaded: boolean
}

const props = defineProps<Props>()

const { isLoaded } = toRefs(props)
</script>

<template>
  <div v-if="isLoaded">
    <slot />
  </div>
  <div v-else class="loading">
    <img src="/images/loading.svg" width="48" />
    <div class="loading__text">Loading...</div>
  </div>
</template>

<style scoped>
.loading {
  @apply flex flex-col justify-center items-center;
}

.loading__text {
  @apply mt-1;
}
</style>
