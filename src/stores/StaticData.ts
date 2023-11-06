import { defineStore } from 'pinia'

import Champion from '../models/tft/Champion'
import Item from '../models/tft/Item'
import Trait from '../models/tft/Trait'

import { getTFTStaticDataResults } from '../utils/get-tft-static-data-results'

interface State {
  champions: Record<string, Champion>
  traits: Record<string, Trait>
  items: Record<string, Item>

  isInitialized: boolean
}

const useStaticDataStore = defineStore('staticData', {
  state: (): State => ({
    champions: {},
    traits:    {},
    items:     {},

    isInitialized: false,
  }),
  getters: {
    getTrait(state: State) {
      return (traitId: string) => {
        return state.traits[traitId]
      }
    },
    getChampion(state: State) {
      return (championId: string) => {
        return state.champions[championId]
      }
    },
    getAllChampionsSortedByCost(state: State) {
      return Object.values(state.champions).sort((a, b) => a.compareByCost(b))
    },
    getAllBaseItems(state: State) {
      return Object.values(state.items).filter(item => item.base())
    },
    getAllComposableItems(state: State) {
      return Object.values(state.items).filter(item => item.composable())
    },
    getAllEmblemItems(state: State) {
      return Object.values(state.items).filter(item => item.emblem())
    },
    getAllRadiantItems(state: State) {
      return Object.values(state.items).filter(item => item.radiant())
    },
    getAllSupportItems(state: State) {
      return Object.values(state.items).filter(item => item.support())
    },
    getAllOrnnItems(state: State) {
      return Object.values(state.items).filter(item => item.ornn())
    },
    getAllOtherItems(state: State) {
      return Object.values(state.items).filter(item => item.other())
    },
  },
  actions: {
    async initialize() {
      if(this.isInitialized)
        return

      const { champions, traits, items } = await getTFTStaticDataResults()
      this.champions = champions
      this.traits = traits
      this.items = items

      this.isInitialized = true
    },
  },
})

export {
  useStaticDataStore,
}

export default {
  useStaticDataStore,
}
