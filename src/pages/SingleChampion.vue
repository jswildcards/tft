<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'

import { useStaticDataStore } from '../stores/StaticData'

import ChampionIcon from '../components/ChampionIcon.vue'
import SquareImage from '../components/SquareImage.vue'
import LoadPage from '../components/LoadPage.vue'

import Trait from '../models/tft/Trait'
import { ChampionStatKeys, Champion } from '../models/tft/Champion'

const staticDataStore = useStaticDataStore()
const { getChampion, getTrait } = storeToRefs(staticDataStore)
staticDataStore.loadData()

const route = useRoute()
const champion = computed(() => staticDataStore.champions[route.params.id as string])
const traits = computed(() => champion?.value?.traitIds?.map(getTrait.value))

const basicStats: ChampionStatKeys[] = ['hp', 'damage', 'armor', 'magicResist', 'attackSpeed', 'critChance', 'range']

function toFixed(num: number) {
  if(Number.isInteger(num))
    return num

  return num.toFixed(2)
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
      <router-link to="/champions" class="underline text-sky-500">Champions</router-link>
      <div class="mx-2">/</div>
      <div>{{ champion.name }}</div>
    </div>

    <div class="lg:grid grid-cols-3 gap-2">
      <div class="flex flex-col items-center mb-4">
        <ChampionIcon :src="champion.icon" :cost="champion.cost" />
        <div class="mt-1">{{ champion.name }}</div>

        <div class="flex flex-wrap justify-center mt-1">
          <div v-for="(trait, index) in traits" :key="trait.id" class="flex items-center text-xs">
            <div v-if="index !== 0" class="mx-2">•</div>
            <SquareImage :src="trait.icon" size="xs" />
            <div class="ml-1">{{ trait.name }}</div>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-1 mt-3">
          <div v-for="stat in basicStats" :key="stat" class="flex w-12">
            <SquareImage :src="`/images/stats/${stat}.png`" size="xs" />
            <div class="ml-0.5 text-xs">{{ toFixed(champion.stats[stat]) }}</div>
          </div>
          <div class="flex w-12">
            <SquareImage src="/images/stats/cost.png" size="xs" />
            <div class="ml-0.5 text-xs">{{ champion.cost }}</div>
          </div>
        </div>
      </div>

      <div class="col-span-2">
        <div class="mb-4">
          <div class="bg-slate-800 text-center p-1 mb-2 text-sm">Ability</div>

          <div class="flex">
            <div class="shrink-0 mr-2">
              <img class="w-8 h-8 lg:w-16 lg:h-16" :src="champion.ability.icon" />
            </div>

            <div>
              <div class="flex mb-1">
                <div class="font-semibold mr-2">{{ champion.ability.name }}</div>
                <div class="flex mt-1 text-secondary">
                  <SquareImage src="/images/stats/mana.png" size="xs" />
                  <div class="ml-0.5 text-xs">{{ champion.stats.initialMana }} / {{ champion.stats.mana }}</div>
                </div>
              </div>
              <div v-html="champion.getAdjustedAbilityDescription()" class="text-secondary text-sm"></div>
            </div>
          </div>
        </div>

        <div>
          <div class="bg-slate-800 text-center p-1 mb-2 text-sm">Traits</div>
          <div v-for="trait in traits" :key="trait.id" class="mb-2 flex">
            <SquareImage :src="trait.icon" class="mr-2" size="sm" />
            <div>
              <div class="font-semibold mb-2">{{ trait.name }}</div>
              <div v-html="trait.getAdjustedDescription()" class="text-secondary text-sm"></div>

              <div class="flex flex-wrap mt-4">
                <router-link :to="champion.url" v-for="champion in trait.championIds.map(getChampion).sort((a, b) => a.compareByCost(b))" :key="champion.id" class="relative mr-2 mb-2" @click="clearActiveTraitChampionId()">
                  <ChampionIcon size="sm" :src="champion.icon" :cost="champion.cost" @mouseenter="setActiveTraitChampionId(trait, champion)" @mouseleave="clearActiveTraitChampionId()" />
                  <div :class="`absolute flex left-0 items-center -ml-2 border-2 border-slate-700 bg-slate-800 shadow z-50 shadow p-1.5 rounded top-1/2 -translate-y-1/2 w-max ${isActiveTraitChampionId(trait, champion) ? '' : 'hidden'}`">
                    <ChampionIcon size="sm" :src="champion.icon" :cost="champion.cost" @mouseenter="setActiveTraitChampionId(trait, champion)" @mouseleave="clearActiveTraitChampionId()" />
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
          </div>
        </div>
      </div>
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
</style>
