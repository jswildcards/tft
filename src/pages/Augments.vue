<script setup lang="ts">
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'

import { useStaticDataStore } from '../stores/StaticData'

import SquareImage from '../components/SquareImage.vue'
import LoadPage from '../components/LoadPage.vue'
import Augment from '../models/tft/Augment'

const staticDataStore = useStaticDataStore()
const { getChampion, getTrait } = storeToRefs(staticDataStore)
staticDataStore.loadData()

const targetAugmentId = ref(null)

const targetAugment = computed(() => {
  if(targetAugmentId.value === null)
    return null

  return staticDataStore.augments[targetAugmentId.value]
})

function setTargetAugmentId(augmentId: string) {
  targetAugmentId.value = augmentId
}

const randomAugmentName = computed(() => {
  const augmentsArray = Object.values(staticDataStore.augments) as Augment[]
  const randomIndex = Math.floor(Math.random() * augmentsArray.length)
  return augmentsArray[randomIndex].name
})

const searchText = ref("")

function setSearchText(text: string) {
  searchText.value = text
}

const augments = computed(() => {
  return Object.values(staticDataStore.augments)
    .filter((augment: Augment) => {
      return augment.name.toLowerCase().includes(searchText.value.toLowerCase())
    })
})
</script>

<template>
  <LoadPage :isLoaded="staticDataStore.isDataLoaded">
    <div v-if="targetAugment" class="fixed top-0 left-0 w-screen h-screen bg-slate-900/90 z-50 flex justify-center items-center">
      <div class="bg-slate-800 rounded p-4 shadow-2xl w-5/6 max-w-md">
        <div class="flex justify-between mb-1">
          <div class="flex">
            <SquareImage :src="targetAugment.icon" />
            <div class="ml-2 flex flex-col justify-between">
              <div class="text-xl font-semibold">{{ targetAugment.name }}</div>
            </div>
          </div>
          <button class="w-8 h-8 rounded-full hover:bg-slate-900" @click="setTargetAugmentId(null)">×</button>
        </div>

        <div v-html="targetAugment.getAdjustedDescription()" class="text-secondary text-sm"></div>
      </div>
    </div>

    <div class="flex mb-6 text-sm text-secondary">
      <router-link to="/" class="underline text-sky-500">Home</router-link>
      <div class="mx-2">/</div>
      <div>Augments</div>
    </div>

    <div class="flex mb-4">
      <div class="flex bg-slate-700 rounded mr-2 pl-4 h-10">
        <div class="py-1.5 -scale-x-100">⌕</div>
        <input class="bg-slate-700 ml-3 rounded focus:outline-none" v-model="searchText" :placeholder="randomAugmentName" />
        <button class="w-8 h-8 rounded-full hover:bg-slate-800 my-auto mx-1.5" @click="setSearchText('')">×</button>
      </div>
    </div>

    <div class="augments__augment-list">
      <button v-for="augment in augments" :key="augment.id" class="augments__augment-list__augment" @click="setTargetAugmentId(augment.id)">
        <SquareImage :src="augment.icon" />
        <div class="mt-1 text-sm">{{ augment.name }}</div>
      </button>
    </div>
  </LoadPage>
</template>

<style scoped>
.augments__button-group {
  @apply absolute mt-1 flex-col bg-slate-700 rounded;
}

.augments__button-group__button {
  @apply px-4 py-2 duration-75 hover:bg-slate-800;
}

.augments__button-group__button:first-child {
  @apply rounded-t;
}

.augments__button-group__button:last-child {
  @apply rounded-b;
}

.augments__button-group__button--active {
  @apply bg-slate-800;
}

.augments__augment-list {
  @apply rounded grid gap-2 p-4 justify-center bg-slate-900;
  grid-template-columns: repeat(auto-fit, 112px);
}

.augments__augment-list__augment {
  @apply rounded w-28 flex flex-col items-center py-3 px-1 text-center duration-75 hover:bg-slate-700;
}
</style>

