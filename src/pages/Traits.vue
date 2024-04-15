<script setup lang="ts">
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'

import { useStaticDataStore } from '../stores/StaticData'

import ChampionIcon from '../components/ChampionIcon.vue'
import SquareImage from '../components/SquareImage.vue'
import LoadPage from '../components/LoadPage.vue'
import SearchEmpty from '../components/SearchEmpty.vue'

import Trait from '../models/tft/Trait'
import Champion from '../models/tft/Champion'

const staticDataStore = useStaticDataStore()
const { getChampion, getTrait } = storeToRefs(staticDataStore)
staticDataStore.loadData()

const traits = computed(() => {
  return (Object.values(staticDataStore.traits) as Trait[])
    .filter((trait) => {
      return trait.name.toLowerCase().includes(searchText.value.toLowerCase())
    })
    .sort((a, b) => {
      return a.name < b.name ? -1 : 1;
    })
})

const targetTraitId = ref<string | null>(null)

const targetTrait = computed(() => {
  if(targetTraitId.value === null)
    return null

  return staticDataStore.traits[targetTraitId.value]
})

function setTargetTraitId(traitId: string | null) {
  targetTraitId.value = traitId
}

const randomTraitName = computed(() => {
  const traitsArray = Object.values(staticDataStore.traits) as Trait[]
  const randomIndex = Math.floor(Math.random() * traitsArray.length)
  return traitsArray[randomIndex].name
})

const searchText = ref("")

function setSearchText(text: string) {
  searchText.value = text
}

const activeTraitChampionId = ref<string | null>(null)

function buildTraitChampionId(trait: Trait, champion: Champion) {
  return `${trait.id}-${champion.id}`
}

function setActiveTraitChampionId(trait: Trait, champion: Champion) {
  activeTraitChampionId.value = buildTraitChampionId(trait, champion)
}

function clearActiveTraitChampionId() {
  activeTraitChampionId.value = null
}

function isActiveTraitChampionId(trait: Trait, champion: Champion) {
  return activeTraitChampionId.value === buildTraitChampionId(trait, champion)
}
</script>

<template>
  <LoadPage :isLoaded="staticDataStore.isDataLoaded">
    <div v-if="targetTrait" class="fixed top-0 left-0 w-screen h-screen bg-slate-900/90 z-50 flex justify-center items-center">
      <div class="bg-slate-800 rounded p-4 shadow-2xl w-5/6 max-w-md flex">
        <SquareImage size="sm" class="mr-2" :src="targetTrait.icon" />

        <div class="grow">
          <div class="font-semibold mb-2">{{ targetTrait.name }}</div>
          <div v-html="targetTrait.getAdjustedDescription()" class="text-secondary text-sm"></div>

          <div class="flex flex-wrap mt-4">
            <router-link :to="champion.url" v-for="champion in targetTrait.championIds.map(getChampion).sort((a, b) => a.compareByCost(b))" :key="champion.id" class="relative mr-2 mb-2" @click="clearActiveTraitChampionId()">
              <ChampionIcon size="sm" :src="champion.icon" :cost="champion.cost" @mouseenter="setActiveTraitChampionId(targetTrait, champion)" @mouseleave="clearActiveTraitChampionId()" />
              <div :class="`absolute flex left-0 items-center -ml-2 border-2 border-slate-700 bg-slate-800 shadow z-50 shadow p-1.5 rounded top-1/2 -translate-y-1/2 w-max ${isActiveTraitChampionId(targetTrait, champion) ? '' : 'hidden'}`">
                <ChampionIcon size="sm" :src="champion.icon" :cost="champion.cost" @mouseenter="setActiveTraitChampionId(targetTrait, champion)" @mouseleave="clearActiveTraitChampionId()" />
                <div class="ml-2">
                  <div class="text-sm">{{ champion.name }}</div>

                  <div class="flex mt-1">
                    <SquareImage v-for="(trait, index) in champion.traitIds.map(getTrait)" :key="trait.id" :src="trait.icon" size="xs" :class="index === 0 ? '' : 'ml-1'" />
                  </div>
                </div>
              </div>
            </router-link>
          </div>
        </div>

        <button class="w-8 h-8 rounded-full shrink-0 hover:bg-slate-900" @click="setTargetTraitId(null)">×</button>
      </div>
    </div>

    <div class="flex mb-6 text-sm text-secondary">
      <router-link to="/" class="underline text-sky-500">Home</router-link>
      <div class="mx-2">/</div>
      <div>Traits</div>
    </div>

    <div class="flex mb-4">
      <div class="flex bg-slate-700 rounded mr-2 pl-4 h-10">
        <div class="py-1.5 -scale-x-100">⌕</div>
        <input class="bg-slate-700 ml-3 rounded focus:outline-none" v-model="searchText" :placeholder="randomTraitName" />
        <button class="w-8 h-8 rounded-full hover:bg-slate-800 my-auto mx-1.5" @click="setSearchText('')">×</button>
      </div>
    </div>

    <div class="traits__trait-container">
      <div v-if="traits.length > 0" class="traits__trait-list">
        <div :key="trait.id" v-for="trait in traits" class="traits__trait-list__item" @click="setTargetTraitId(trait.id)">
          <SquareImage :src="trait.icon" size="sm" />
          <div class="mt-1 text-sm">{{ trait.name }}</div>
        </div>
      </div>

      <SearchEmpty v-else />
    </div>
  </LoadPage>
</template>

<style scoped>
>>> .trait-style {
  @apply flex justify-center items-center text-slate-900 font-bold shrink-0 w-5 h-5 mr-2 border;
}

>>> .trait-style--1 {
  @apply border-amber-600 bg-amber-900 text-primary;
}

>>> .trait-style--3 {
  @apply border-slate-100 bg-slate-400;
}

>>> .trait-style--4 {
  @apply border-amber-200 bg-amber-500;
}

>>> .trait-style--5 {
  @apply border-slate-100;
  background: conic-gradient(from 180deg, rgb(181, 249, 177) -25.61deg, rgb(174, 167, 248) 0.63deg, rgb(185, 232, 188) 27.2deg, rgb(246, 254, 216) 56.21deg, rgb(199, 251, 247) 83.01deg, rgb(154, 240, 254) 109.35deg, rgb(245, 236, 255) 129.56deg, rgb(248, 153, 248) 154.85deg, rgb(182, 252, 227) 181.24deg, rgb(126, 147, 242) 210.86deg, rgb(225, 164, 253) 244.3deg, rgb(175, 230, 240) 264.6deg, rgb(243, 241, 199) 287.41deg, rgb(233, 159, 126) 306.52deg, rgb(181, 249, 177) 334.39deg, rgb(174, 167, 248) 360.63deg);
}

.traits__trait-container {
  @apply rounded bg-slate-900 p-4;
}

.traits__trait-list {
  @apply grid gap-2 justify-center;
  grid-template-columns: repeat(auto-fit, 112px);
}

.traits__trait-list__item {
  @apply rounded w-28 flex flex-col items-center p-3 text-center duration-75 hover:bg-slate-700;
}
</style>
