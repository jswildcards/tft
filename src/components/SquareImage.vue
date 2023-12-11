<script setup lang="ts">
import { toRefs } from 'vue'

interface Props {
  src: string
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl"
}

const props = withDefaults(defineProps<Props>(), {
  size: "md"
})

const { size, src } = toRefs(props)
</script>

<template>
  <img :class="`image-${size}`" :src="src" />
</template>

<style scoped>
.image-xs {
  @apply w-4 h-4;
}

.image-sm {
  @apply w-8 h-8;
}

.image-md {
  @apply w-12 h-12;
}

.image-lg {
  @apply w-16 h-16;
}

.image-xl {
  @apply w-24 h-24;
}

.image-2xl {
  @apply w-32 h-32;
}

.image-3xl {
  @apply w-48 h-48;
}
</style>
