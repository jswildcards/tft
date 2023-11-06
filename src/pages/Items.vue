<script setup lang="ts">
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'

import { useStaticDataStore } from '../stores/staticData'

import ChampionIcon from '../components/ChampionIcon.vue'
import SquareImage from '../components/SquareImage.vue'
import LoadPage from '../components/LoadPage.vue'

const staticDataStore = useStaticDataStore()
const { getChampion, getTrait } = storeToRefs(staticDataStore)
staticDataStore.initialize()

const FILTER_ALL_ITEMS = 'All'
const FILTER_BASE_ITEMS = 'Base'
const FILTER_COMPOSABLE_ITEMS = 'Composable'
const FILTER_EMBLEM_ITEMS = 'Emblem'
const FILTER_RADIANT_ITEMS = 'Radiant'
const FILTER_SUPPORT_ITEMS = 'Support'
const FILTER_ORNN_ITEMS = 'Ornn'
const FILTER_OTHER_ITEMS = 'Other'

const allFilterOptions = [
  FILTER_ALL_ITEMS,
  FILTER_BASE_ITEMS,
  FILTER_COMPOSABLE_ITEMS,
  FILTER_EMBLEM_ITEMS,
  FILTER_RADIANT_ITEMS,
  FILTER_SUPPORT_ITEMS,
  FILTER_ORNN_ITEMS,
  FILTER_OTHER_ITEMS,
]

const searchText = ref("")

const filterButton = ref(null)

const targetItemId = ref(null)

const filterOption = ref(FILTER_ALL_ITEMS)
const showFilterOptions = ref(false)
const items = computed(() => {
  if(filterOption.value === FILTER_BASE_ITEMS)
    return staticDataStore.getAllBaseItems

  if(filterOption.value === FILTER_COMPOSABLE_ITEMS)
    return staticDataStore.getAllComposableItems

  if(filterOption.value === FILTER_EMBLEM_ITEMS)
    return staticDataStore.getAllEmblemItems

  if(filterOption.value === FILTER_RADIANT_ITEMS)
    return staticDataStore.getAllRadiantItems

  if(filterOption.value === FILTER_SUPPORT_ITEMS)
    return staticDataStore.getAllSupportItems

  if(filterOption.value === FILTER_ORNN_ITEMS)
    return staticDataStore.getAllOrnnItems

  if(filterOption.value === FILTER_OTHER_ITEMS)
    return staticDataStore.getAllOtherItems

  return staticDataStore.items
})

const targetItem = computed(() => {
  if(targetItemId.value === null)
    return null

  return staticDataStore.items[targetItemId.value]
})

const randomItemName = computed(() => {
  const itemsArray = Object.values(items.value)
  const randomIndex = Math.floor(Math.random() * itemsArray.length)
  return itemsArray[randomIndex].name
})

function setFilterOption(option: string) {
  filterOption.value = option
}

function setTargetItemId(itemId: string) {
  targetItemId.value = itemId
}

function setSearchText(text: string) {
  searchText.value = text
}

function setActiveFilterOption(option: string) {
  return filterOption.value === option ? 'items__button-group__button--active' : ''
}

function toggleShowFilterOptions(e) {
  if(e.target === filterButton.value || e.target.parentNode === filterButton.value)
    showFilterOptions.value = !showFilterOptions.value
  else
    showFilterOptions.value = false
}
</script>

<template>
  <LoadPage :isLoaded="staticDataStore.isInitialized" @click="toggleShowFilterOptions">
    <div v-if="targetItem" class="fixed top-0 left-0 w-screen h-screen bg-slate-900/90 z-50 flex justify-center items-center">
      <div class="bg-slate-800 rounded p-4 shadow-2xl w-5/6 max-w-md">
        <div class="flex justify-between mb-1">
          <div class="flex">
            <SquareImage :src="targetItem.icon" />
            <div class="ml-2 flex flex-col justify-between">
              <div class="text-xl font-semibold">{{ targetItem.name }}</div>
              <div class="flex flex-wrap">
                <div v-for="baseStat in targetItem.getBaseStatsWithIcon()" :key="baseStat.id" class="flex mr-1">
                  <SquareImage :src="`/images/scales/${baseStat.iconName}.png`" size="xs" />
                  <div class="text-xs text-secondary">{{ baseStat.value }}</div>
                </div>
              </div>
            </div>
          </div>
          <button class="w-8 h-8 rounded-full hover:bg-slate-900" @click="setTargetItemId(null)">×</button>
        </div>

        <div v-html="targetItem.getAdjustedDescription()" class="text-secondary text-sm"></div>

        <div v-if="targetItem.base()" class="mt-2">
          <div class="text-sm font-bold mb-1">Composable Items</div>
          <div class="flex flex-wrap">
            <button v-for="item in targetItem.composableItemIds.map(itemId => staticDataStore.items[itemId])" :key="item.id" @click="setTargetItemId(item.id)">
              <SquareImage :src="item.icon" size="sm" />
            </button>
          </div>
        </div>

        <div v-if="targetItem.composable()" class="mt-2">
          <div class="text-sm font-bold mb-1">Recipes</div>
          <div class="flex flex-wrap">
            <button v-for="item in targetItem.composition.map(itemId => staticDataStore.items[itemId])" :key="item.id" @click="setTargetItemId(item.id)">
              <SquareImage :src="item.icon" size="sm" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="flex mb-6 text-sm text-secondary">
      <router-link to="/" class="underline text-sky-500">Home</router-link>
      <div class="mx-2">/</div>
      <div>Items</div>
    </div>

    <div class="relative">
      <div class="flex mb-4">
        <div class="flex bg-slate-700 rounded mr-2 pl-4">
          <div class="py-1.5 -scale-x-100">⌕</div>
          <input class="bg-slate-700 ml-3 rounded focus:outline-none" v-model="searchText" :placeholder="randomItemName" />
          <button class="w-8 h-8 rounded-full hover:bg-slate-800 my-auto mx-1.5" @click="setSearchText('')">×</button>
        </div>
        <div>
          <div class="flex justify-between bg-slate-700 px-4 py-2 w-36 rounded" ref="filterButton">
            <div>{{ filterOption }}</div>
            <div>▼</div>
          </div>
          <div :class="`items__button-group ${showFilterOptions ? 'flex' : 'hidden'}`">
            <button v-for="filterOption in allFilterOptions" :key="filterOption" @click="setFilterOption(filterOption)" :class="`items__button-group__button ${setActiveFilterOption(filterOption)}`">
              {{ filterOption }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="items__item-list">
      <button v-for="item in Object.values(items).filter(item => item.name.toLowerCase().includes(searchText.toLowerCase())).sort((a, b) => a.name < b.name ? -1 : (a.name > b.name ? 1 : 0))" :key="item.id" class="items__item-list__item" @click="setTargetItemId(item.id)">
        <SquareImage :src="item.icon" />
        <div class="mt-1 text-sm">{{ item.name }}</div>

        <div class="flex mt-1">
          <SquareImage v-for="(item, index) in item.composition.map(baseItemId => staticDataStore.items[baseItemId])" :key="item.id" :src="item.icon" size="xs" :class="index === 0 ? '' : 'ml-1'" />
        </div>
      </button>
    </div>
  </LoadPage>
</template>

<style scoped>
.items__button-group {
  @apply absolute mt-1 flex-col bg-slate-700 rounded;
}

.items__button-group__button {
  @apply px-4 py-2 duration-75 hover:bg-slate-800;
}

.items__button-group__button:first-child {
  @apply rounded-t;
}

.items__button-group__button:last-child {
  @apply rounded-b;
}

.items__button-group__button--active {
  @apply bg-slate-800;
}

.items__item-list {
  @apply rounded grid gap-2 p-4 justify-center bg-slate-900;
  grid-template-columns: repeat(auto-fit, 112px);
}

.items__item-list__item {
  @apply rounded w-28 flex flex-col items-center py-3 px-1 text-center duration-75 hover:bg-slate-700;
}
</style>
