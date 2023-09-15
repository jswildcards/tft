import { defineStore } from 'pinia'

import Champion from '../models/tft/Champion'
import Trait from '../models/tft/Trait'

import { getTFTStaticDataResults } from '../utils/get-tft-static-data-results'

interface State {
  champions: Record<string, Champion>
  traits: Record<string, Trait>

  isInitialized: boolean
}

const useStaticDataStore = defineStore('staticData', {
  state: (): State => ({
    champions: {},
    traits:    {},

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
    }
  },
  actions: {
    async initialize() {
      if(this.isInitialized)
        return

      const { champions, traits } = await getTFTStaticDataResults()
      this.champions = champions
      this.traits = traits

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
