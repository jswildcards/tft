<script setup lang="ts">
import { ref } from 'vue'

import { useStaticDataStore } from '../stores/StaticData'

const staticDataStore = useStaticDataStore()
staticDataStore.initialize()

const showModal = ref(false)

function setActiveLocale(localeCode: string) {
  return staticDataStore.selectedLocale === localeCode ? 'header__modal__button-group__button--active' : ''
}

function closeModal() {
  showModal.value = false
}

function openModal() {
  showModal.value = true
}

function updateSelectedLocale(localeCode: string) {
  staticDataStore.updateSelectedLocale(localeCode)
  closeModal()
}
</script>

<template>
  <div v-if="showModal" class="fixed top-0 left-0 w-screen p-4 h-screen bg-slate-900/90 z-50 flex justify-center items-center">
    <div class="bg-slate-800 rounded p-4 shadow-2xl max-h-full overflow-y-auto w-5/6">
      <div class="flex justify-end mb-1">
        <button class="w-8 h-8 rounded-full hover:bg-slate-900" @click="closeModal()">×</button>
      </div>

      <div class="header__modal__button-group">
        <button v-for="localeCode in staticDataStore.availableLocales" :key="localeCode" @click="updateSelectedLocale(localeCode)" :class="`header__modal__button-group__button ${setActiveLocale(localeCode)}`">
          {{ staticDataStore.availableLocaleDisplays?.[localeCode] }}
        </button>
      </div>
    </div>
  </div>

  <div class="header">
    <div class="header__links">
      <router-link to="/" class="header__btn-link">
        <img src="/images/logo.png" class="w-8 h-8" />
        <span>TFT Fan</span>
      </router-link>
      <router-link to="/build" class="header__btn-link">
        Build
      </router-link>
      <router-link to="/champions" class="header__btn-link">
        Champions
      </router-link>
      <router-link to="/traits" class="header__btn-link">
        Traits
      </router-link>
      <router-link to="/items" class="header__btn-link">
        Items
      </router-link>
      <router-link to="/augments" class="header__btn-link">
        Augments
      </router-link>
    </div>

    <div>
      <button v-if="staticDataStore.isInitialized" class="header__option-locale" @click="openModal()">
        <div>🌐</div>
        <div class="ml-2">
          {{ staticDataStore.availableLocaleDisplays?.[staticDataStore.selectedLocale ?? ""] }}
        </div>
      </button>
    </div>
  </div>
</template>

<style scoped>
.header {
  @apply container mx-auto flex justify-between items-center;
}

.header__links {
  @apply flex;
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

.header__option-locale {
  @apply flex justify-between bg-slate-700 px-4 py-2 rounded;
}

.header__modal__button-group {
  @apply grid gap-2 justify-center;
  grid-template-columns: repeat(auto-fit, 288px);
}

.header__modal__button-group__button {
  @apply px-4 py-2 w-72 duration-75 rounded hover:bg-slate-700;
}

.header__modal__button-group__button--active {
  @apply bg-slate-900;
}
</style>
