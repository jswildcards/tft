import { defineStore } from 'pinia'
import { CLDRFramework } from '@phensley/cldr';

import Augment from '../models/tft/Augment'
import Champion from '../models/tft/Champion'
import Item from '../models/tft/Item'
import Trait from '../models/tft/Trait'

import { getTFTStaticDataResults } from '../utils/get-tft-static-data-results'
import { getLocales } from '../utils/api/tft/locales'

interface AvailableLocaleDisplaysFormat {
  simple: string
  full: string
}

interface AvailableLocalDisplays {
  code: string
  display: AvailableLocaleDisplaysFormat
}

interface State {
  champions: Record<string, Champion>
  traits: Record<string, Trait>
  items: Record<string, Item>
  augments: Record<string, Augment>

  selectedLocale: string | null
  currentLocale: string | null
  availableLocales: string[] | null
  availableLocaleDisplays: AvailableLocalDisplays[] | null

  isInitialized: boolean
  isDataLoaded: boolean
}

const useStaticDataStore = defineStore('staticData', {
  state: (): State => ({
    champions: {},
    traits:    {},
    items:     {},
    augments:  {},

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
    getLocaleDisplay(state: State) {
      return (localeCode: string | null) => {
        if(localeCode === null)
          return null

        return state.availableLocaleDisplays?.find(({ code }) => code === localeCode)?.display
      }
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

      const { available: availableLocales, default: defaultLocale } = await getLocales()
      this.availableLocales = availableLocales
      this.selectedLocale = defaultLocale

      const framework = new CLDRFramework({
        asyncLoader: async function(language: string) {
          const resources = await fetch(`https://cdn.jsdelivr.net/npm/@phensley/cldr@1.7.3/packs/${language}.json`)
          return resources.json()
        }
      })

      this.availableLocaleDisplays = await Promise.all(
        this.availableLocales.map(
          async (code) => {
            const cldr = await framework.getAsync(code)
            const language = cldr.General.getLanguageDisplayName(code)
            const region = cldr.General.getRegionDisplayName(code)

            return {
              code,
              display: {
                full: `${language} (${region})`,
                simple: language,
              },
            }
          }
        )
      )

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

      const { champions, traits, items, augments } = await getTFTStaticDataResults(this.currentLocale)
      this.champions = champions ?? {}
      this.traits = traits ?? {}
      this.items = items ?? {}
      this.augments = augments ?? {}

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
