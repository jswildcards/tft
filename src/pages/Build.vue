<script setup lang="ts">
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'

import { useStaticDataStore } from '../stores/StaticData'

import ChampionIcon from '../components/ChampionIcon.vue'
import LoadPage from '../components/LoadPage.vue'
import SquareImage from '../components/SquareImage.vue'
import Champion from '../models/tft/Champion'
import Trait from '../models/tft/Trait'

const staticDataStore = useStaticDataStore()
const { getChampion, getTrait } = storeToRefs(staticDataStore)
staticDataStore.loadData()

const team_champion_ids = ref<string[]>([])

const team = computed(() => {
  return team_champion_ids.value.map(champion_id => {
    return staticDataStore.champions[champion_id]
  })
})

const active_traits = computed(() => {
  const traits_count: Record<string, { count: number, trait: Trait }> = {}

  const unique_champions = [
    ...new Set(team_champion_ids.value)
  ].map(champion_id => staticDataStore.champions[champion_id])

  for(const champion of unique_champions) {
    for(const trait_id of champion.traitIds) {
      traits_count[trait_id] = {
        count: (traits_count[trait_id]?.count ?? 0) + 1,
        trait: staticDataStore.traits[trait_id],
      }
    }
  }

  return traits_count
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

function addChampionToTeam(champion_id: string) {
  team_champion_ids.value = [
    ...team_champion_ids.value,
    champion_id,
  ]
}

function removeChampionFromTeam(index: number) {
  team_champion_ids.value = [
    ...team_champion_ids.value.slice(0, index),
    ...team_champion_ids.value.slice(index + 1),
  ]
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
    <div class="flex mb-6 text-sm text-secondary">
      <router-link to="/" class="underline text-sky-500">Home</router-link>
      <div class="mx-2">/</div>
      <div>Build</div>
    </div>

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

    <div class="build__team-container">
      <div class="flex min-h-11">
        <button v-for="{ trait, count } in Object.values(active_traits)" :key="trait.id" :class="`active-trait-style active-trait-style--${trait.getEffectLevel(count)}`" @click="setTargetTraitId(trait.id)">
          <SquareImage :src="trait.icon" size="xs" class="mr-0.5" />
          <div>{{ count }} / {{ trait.minUnitsToNextLevel(count) }}</div>
        </button>
      </div>

      <div class="build__team-list-container">
        <div v-if="team.length > 0" class="build__team-list">
          <button :key="champion.id" v-for="(champion, index) in team" class="build__champion-list__item" @click="removeChampionFromTeam(index)">
            <ChampionIcon :src="champion.icon" :cost="champion.cost" />
            <div class="mt-1 text-sm">{{ champion.name }}</div>

            <div class="flex mt-1">
              <SquareImage v-for="(trait, index) in champion.traitIds.map(getTrait)" :key="trait.id" :src="trait.icon" size="xs" :class="index === 0 ? '' : 'ml-1'" />
            </div>
          </button>
        </div>

        <div class="text-center text-secondary text-xl" v-else>
          Click champions in the list below to add champion into team
        </div>
      </div>
    </div>

    <div class="build__champion-list">
      <button :key="champion.id" v-for="champion in staticDataStore.getAllChampionsSortedByCost" class="build__champion-list__item" @click="addChampionToTeam(champion.id)">
        <ChampionIcon :src="champion.icon" :cost="champion.cost" />
        <div class="mt-1 text-sm">{{ champion.name }}</div>

        <div class="flex mt-1">
          <SquareImage v-for="(trait, index) in champion.traitIds.map(getTrait)" :key="trait.id" :src="trait.icon" size="xs" :class="index === 0 ? '' : 'ml-1'" />
        </div>
      </button>
    </div>
  </LoadPage>
</template>

<style scoped>
>>> .active-trait-style {
  @apply flex justify-center items-center text-slate-900 text-xs shrink-0 m-2 border p-1;
}

>>> .active-trait-style--0 {
  @apply border-slate-900 bg-slate-950 text-primary;
}

>>> .active-trait-style--1 {
  @apply border-amber-600 bg-amber-900 text-primary;
}

>>> .active-trait-style--3 {
  @apply border-slate-100 bg-slate-400;
}

>>> .active-trait-style--4 {
  @apply border-amber-200 bg-amber-500;
}

>>> .active-trait-style--5 {
  @apply border-slate-100;
  background: conic-gradient(from 180deg, rgb(181, 249, 177) -25.61deg, rgb(174, 167, 248) 0.63deg, rgb(185, 232, 188) 27.2deg, rgb(246, 254, 216) 56.21deg, rgb(199, 251, 247) 83.01deg, rgb(154, 240, 254) 109.35deg, rgb(245, 236, 255) 129.56deg, rgb(248, 153, 248) 154.85deg, rgb(182, 252, 227) 181.24deg, rgb(126, 147, 242) 210.86deg, rgb(225, 164, 253) 244.3deg, rgb(175, 230, 240) 264.6deg, rgb(243, 241, 199) 287.41deg, rgb(233, 159, 126) 306.52deg, rgb(181, 249, 177) 334.39deg, rgb(174, 167, 248) 360.63deg);
}

>>> .active-trait-style--6 {
  @apply border-slate-100;
  background: conic-gradient(from 180deg, rgb(181, 249, 177) -25.61deg, rgb(174, 167, 248) 0.63deg, rgb(185, 232, 188) 27.2deg, rgb(246, 254, 216) 56.21deg, rgb(199, 251, 247) 83.01deg, rgb(154, 240, 254) 109.35deg, rgb(245, 236, 255) 129.56deg, rgb(248, 153, 248) 154.85deg, rgb(182, 252, 227) 181.24deg, rgb(126, 147, 242) 210.86deg, rgb(225, 164, 253) 244.3deg, rgb(175, 230, 240) 264.6deg, rgb(243, 241, 199) 287.41deg, rgb(233, 159, 126) 306.52deg, rgb(181, 249, 177) 334.39deg, rgb(174, 167, 248) 360.63deg);
}

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

.build__team-list-container {
  @apply rounded p-4 bg-slate-800 min-h-40 mb-4;
}

.build__team-list {
  @apply grid gap-2 justify-center;
  grid-template-columns: repeat(auto-fit, 112px);
}

.build__champion-list {
  @apply grid gap-2 justify-center rounded p-4 bg-slate-900;
  grid-template-columns: repeat(auto-fit, 112px);
}

.build__champion-list__item {
  @apply rounded w-28 flex flex-col items-center p-3 text-center duration-75 hover:bg-slate-700;
}
</style>
