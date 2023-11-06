<script setup lang="ts">
import { computed, ref, toRefs } from 'vue'

import SquareImage from '../components/SquareImage.vue'

interface Props {
  src: string
  cost: number
  size?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: "md"
})

const { src, cost } = toRefs(props)
</script>

<template>
  <SquareImage :size="size" :src="src" :class="`champion-icon champion-icon--cost-${cost}`" />
</template>

<style scoped>
.champion-icon {
  @apply border-2;
}

.champion-icon--cost-1 {
  @apply border-gray-500;
}

.champion-icon--cost-2 {
  @apply border-green-500;
}

.champion-icon--cost-3 {
  @apply border-blue-500;
}

.champion-icon--cost-4 {
  @apply border-fuchsia-500;
}

.champion-icon--cost-5 {
  @apply border-yellow-500;
}
</style>
