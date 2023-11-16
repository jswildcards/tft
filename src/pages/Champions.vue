<script setup lang="ts">
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'

import { useStaticDataStore } from '../stores/StaticData'

import ChampionIcon from '../components/ChampionIcon.vue'
import LoadPage from '../components/LoadPage.vue'
import SquareImage from '../components/SquareImage.vue'

import Champion from '../models/tft/Champion'

const SORT_OPTION_CHARACTER = 'sort_option_character'
const SORT_OPTION_COST = 'sort_option_cost'

const staticDataStore = useStaticDataStore()
const { getTrait } = storeToRefs(staticDataStore)
staticDataStore.loadData()

const sortOption = ref(SORT_OPTION_CHARACTER)
const champions = computed(() => {
  if(sortOption.value === SORT_OPTION_COST)
    return staticDataStore.getAllChampionsSortedByCost

  return staticDataStore.champions
})

const randomChampionName = computed(() => {
  const championsArray = Object.values(champions.value)
  const randomIndex = Math.floor(Math.random() * championsArray.length)
  return championsArray[randomIndex].name
})

const searchText = ref("")

function setSearchText(text: string) {
  searchText.value = text
}

function setSortOption(option: string) {
  sortOption.value = option
}

function setActiveSortOption(option: string) {
  return sortOption.value === option ? 'champions__button-group__button--active' : ''
}
</script>

<template>
  <LoadPage :isLoaded="staticDataStore.isDataLoaded">
    <div class="flex mb-6 text-sm text-secondary">
      <router-link to="/" class="underline text-sky-500">Home</router-link>
      <div class="mx-2">/</div>
      <div>Champions</div>
    </div>

    <div class="champions__header">
      <div class="flex bg-slate-700 rounded mr-2 pl-4">
        <div class="py-1.5 -scale-x-100">⌕</div>
        <input class="bg-slate-700 ml-3 rounded focus:outline-none" v-model="searchText" :placeholder="randomChampionName" />
        <button class="w-8 h-8 rounded-full hover:bg-slate-800 my-auto mx-1.5" @click="setSearchText('')">×</button>
      </div>
      <div class="champions__header__sort-options">
        <div class="champions__header__sort-options__text">Sort</div>
        <div class="champions__button-group">
          <button @click="setSortOption(SORT_OPTION_CHARACTER)" :class="`champions__button-group__button champions__button-group__button--left ${setActiveSortOption(SORT_OPTION_CHARACTER)}`">AZ</button>
          <button @click="setSortOption(SORT_OPTION_COST)" :class="`champions__button-group__button champions__button-group__button--right ${setActiveSortOption(SORT_OPTION_COST)}`">
            <img class="champions__button-group__button__content" src="/images/coin.png" />
          </button>
        </div>
      </div>
    </div>

    <div class="champions__champion-list">
      <router-link :to="champion.url" :key="champion.id" v-for="champion in Object.values(champions).filter(champion => champion.name.toLowerCase().includes(searchText.toLowerCase()))" class="champions__champion-list__item">
        <ChampionIcon :src="champion.icon" :cost="champion.cost" />
        <div class="mt-1 text-sm">{{ champion.name }}</div>

        <div class="flex mt-1">
          <SquareImage v-for="(trait, index) in champion.traitIds.map(getTrait)" :key="trait.id" :src="trait.icon" size="xs" :class="index === 0 ? '' : 'ml-1'" />
        </div>
      </router-link>
    </div>
  </LoadPage>
</template>

<style scoped>
.champions__header {
  @apply flex justify-between mb-4;
}

.champions__header__heading {
  @apply text-2xl font-bold;
}

.champions__header__sort-options__text {
  @apply mr-2 text-slate-500;
}

.champions__header__sort-options {
  @apply text-sm flex items-center;
}

.champions__button-group {
  @apply flex;
}

.champions__button-group__button {
  @apply w-10 p-2 bg-slate-700 border-2 border-slate-700 text-sm font-bold text-yellow-500;
  color: #c8aa6e;
}

.champions__button-group__button--active {
  @apply bg-slate-800 border-sky-700;
}

.champions__button-group__button--left {
  @apply rounded-l;
}

.champions__button-group__button--right {
  @apply rounded-r;
}

.champions__button-group__button__content {
  @apply mx-auto;
}

.champions__group {
  @apply flex mt-4;
}

.champions__group__title {
  @apply shrink-0 w-8 rounded-l bg-sky-950 flex justify-center items-center font-bold text-lg mr-2;
}

.champions__champion-list {
  @apply rounded grid gap-2 justify-center bg-slate-900 p-4;
  grid-template-columns: repeat(auto-fit, 112px);
}

.champions__champion-list__item {
  @apply rounded w-28 flex flex-col items-center p-3 text-center duration-75 hover:bg-slate-700;
}
</style>
