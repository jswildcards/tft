<script setup lang="ts">
import { useStaticDataStore } from './stores/StaticData'

import Header from './components/Header.vue'
import LoadPage from './components/LoadPage.vue'

const staticDataStore = useStaticDataStore()
staticDataStore.initialize()
</script>

<template>
  <LoadPage :isLoaded="staticDataStore.isInitialized">
    <div class="page-container">
      <div class="header-container">
        <Header />
      </div>

      <router-view class="main-container" />
    </div>
  </LoadPage>
</template>

<style scoped>
.page-container {
  @apply flex flex-col min-h-screen bg-slate-950 text-primary;
}

.header-container {
  @apply bg-slate-900 shadow;
}

.main-container {
  @apply container mx-auto mb-16 p-4 grow;
  /* FIX: unexpected appearance showing different colors in background */
  @apply border border-slate-950;
}
</style>
