import { defineStore } from 'pinia'

import Augment from '../models/tft/Augment'
import Champion from '../models/tft/Champion'
import Item from '../models/tft/Item'
import Trait from '../models/tft/Trait'

import { getTFTStaticDataResults } from '../utils/get-tft-static-data-results'
import { getLocales } from '../utils/api/tft/locales'

interface State {
  champions: Record<string, Champion>
  traits: Record<string, Trait>
  items: Record<string, Item>
  augments: Record<string, Augment>

  data_dragon_version: string

  selectedLocale: string | null
  currentLocale: string | null
  availableLocales: string[] | null
  availableLocaleDisplays: Record<string, string> | null

  isInitialized: boolean
  isDataLoaded: boolean
}

const useStaticDataStore = defineStore('staticData', {
  state: (): State => ({
    champions: {},
    traits:    {},
    items:     {},
    augments:  {},

    data_dragon_version: "",

    selectedLocale: null,
    currentLocale: null,
    availableLocales: null,
    availableLocaleDisplays: null,

    isInitialized: false,
    isDataLoaded: false,
  }),
  getters: {
    getTrait(state: State) {
      return (traitId: string): Trait => {
        return state.traits[traitId]
      }
    },
    getChampion(state: State) {
      return (championId: string): Champion => {
        return state.champions[championId]
      }
    },
    getAllChampionsSortedByName(state: State) {
      return Object.values(state.champions).sort((a, b) => a.compareByName(b))
    },
    getAllChampionsSortedByCost(state: State) {
      return Object.values(state.champions).sort((a, b) => a.compareByName(b)).sort((a, b) => a.compareByCost(b))
    },
    getAllAugments(state: State) {
      return Object.values(state.augments).sort((a, b) => a.compare(b))
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
    isCorrectLocale(state: State) {
      return state.currentLocale === state.selectedLocale
    },
  },
  actions: {
    async initialize() {
      if(this.isInitialized)
        return

      this.isInitialized = false

      const available_languages = await getLocales()

      this.availableLocales = Object.keys(available_languages)
      this.selectedLocale = "en_us"

      this.availableLocaleDisplays = available_languages

      this.isInitialized = true
      this.loadData()
    },
    async loadData() {
      if(this.isCorrectLocale && this.isDataLoaded)
        return

      this.isDataLoaded = false
      this.currentLocale = this.selectedLocale

      if(this.currentLocale === null)
        return

      const { champions, traits, items, augments, data_dragon_version } = await getTFTStaticDataResults(this.currentLocale)
      this.champions = champions ?? {}
      this.traits = traits ?? {}
      this.items = items ?? {}
      this.augments = augments ?? {}
      this.data_dragon_version = data_dragon_version

      this.isDataLoaded = true
    },
    updateSelectedLocale(locale: string) {
      this.selectedLocale = locale

      if(!this.isCorrectLocale)
        this.loadData()
    }
  },
})

export {
  useStaticDataStore,
}

export default {
  useStaticDataStore,
}
