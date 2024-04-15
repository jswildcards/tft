<script setup lang="ts">
import { computed, ref } from 'vue'

import { useStaticDataStore } from '../stores/StaticData'

import SquareImage from '../components/SquareImage.vue'
import LoadPage from '../components/LoadPage.vue'
import SearchEmpty from '../components/SearchEmpty.vue'
import Item from '../models/tft/Item'

const baseURL = import.meta.env.BASE_URL

const staticDataStore = useStaticDataStore()
staticDataStore.loadData()

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

const targetItemId = ref<string | null>(null)

const filterOption = ref(FILTER_ALL_ITEMS)
const showFilterOptions = ref(false)

const items = computed(() => {
  const filterItemsMap: Record<string, Item[]> = {
    [FILTER_ALL_ITEMS]:        Object.values(staticDataStore.items),
    [FILTER_BASE_ITEMS]:       staticDataStore.getAllBaseItems,
    [FILTER_COMPOSABLE_ITEMS]: staticDataStore.getAllComposableItems,
    [FILTER_EMBLEM_ITEMS]:     staticDataStore.getAllEmblemItems,
    [FILTER_RADIANT_ITEMS]:    staticDataStore.getAllRadiantItems,
    [FILTER_SUPPORT_ITEMS]:    staticDataStore.getAllSupportItems,
    [FILTER_ORNN_ITEMS]:       staticDataStore.getAllOrnnItems,
    [FILTER_OTHER_ITEMS]:      staticDataStore.getAllOtherItems,
  }

  return filterItemsMap[filterOption.value].filter(item =>
    item.name.toLowerCase().includes(searchText.value.toLowerCase())
  )
})

const targetItem = computed(() => {
  if(targetItemId.value === null)
    return null

  return staticDataStore.items[targetItemId.value]
})

const randomItemName = computed(() => {
  const itemsArray = Object.values(staticDataStore.items)
  const randomIndex = Math.floor(Math.random() * itemsArray.length)
  return itemsArray[randomIndex].name
})

function setFilterOption(option: string) {
  filterOption.value = option
}

function setTargetItemId(itemId: string | null) {
  targetItemId.value = itemId
}

function setSearchText(text: string) {
  searchText.value = text
}

function setActiveFilterOption(option: string) {
  return filterOption.value === option ? 'items__button-group__button--active' : ''
}

function toggleShowFilterOptions(e: MouseEvent) {
  if(e.target === filterButton.value || (e.target as HTMLElement)?.parentNode === filterButton.value)
    showFilterOptions.value = !showFilterOptions.value
  else
    showFilterOptions.value = false
}
</script>

<template>
  <LoadPage :isLoaded="staticDataStore.isDataLoaded" @click="toggleShowFilterOptions">
    <div v-if="targetItem" class="fixed top-0 left-0 w-screen h-screen bg-slate-900/90 z-50 flex justify-center items-center">
      <div class="bg-slate-800 rounded p-4 shadow-2xl w-5/6 max-w-md">
        <div class="flex justify-between mb-1">
          <div class="flex">
            <SquareImage :src="targetItem.icon" />
            <div class="ml-2 flex flex-col justify-between">
              <div class="text-xl font-semibold">{{ targetItem.name }}</div>
              <div class="flex flex-wrap">
                <div v-for="baseStat in targetItem.getBaseStatsWithIcon()" :key="baseStat.id" class="flex mr-1">
                  <img :src="`${baseURL}images/scales/${baseStat.iconName}.png`" class="w-4 h-4" />
                  <div class="text-xs text-secondary">{{ baseStat.value }}</div>
                </div>
              </div>
            </div>
          </div>
          <button class="w-8 h-8 rounded-full hover:bg-slate-900" @click="setTargetItemId(null)">×</button>
        </div>

        <div class="ml-14">
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

    <div class="items__item-container">
        <div v-if="items.length > 0" class="items__item-list">
        <button v-for="item in items" :key="item.id" class="items__item-list__item" @click="setTargetItemId(item.id)">
          <SquareImage :src="item.icon" />
          <div class="mt-1 text-sm">{{ item.name }}</div>

          <div class="flex mt-1">
            <SquareImage v-for="(baseItem, index) in item.composition.map(baseItemId => staticDataStore.items[baseItemId])" :key="baseItem.id" :src="baseItem.icon" size="xs" :class="index === 0 ? '' : 'ml-1'" />
          </div>
        </button>
      </div>
      
      <SearchEmpty v-else />
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

.items__item-container {
  @apply rounded p-4 bg-slate-900;
}

.items__item-list {
  @apply grid gap-2 justify-center;
  grid-template-columns: repeat(auto-fit, 112px);
}

.items__item-list__item {
  @apply rounded w-28 flex flex-col items-center py-3 px-1 text-center duration-75 hover:bg-slate-700;
}
</style>
