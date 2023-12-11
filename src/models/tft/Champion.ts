import { substituteScaleIcons } from '../../utils/description-substitution'

interface ChampionAbilityVariable {
  name: string
  value: number[]
}

interface ChampionAbility {
  desc: string
  icon: string
  name: string
  variables: ChampionAbilityVariable[]
}

interface ChampionStats {
  armor: number
  attackSpeed: number
  critChance: number
  critMultiplier: number
  damage: number
  hp: number
  initialMana: number
  magicResist: number
  mana: number
  range: number
}

type ChampionStatKeys = keyof ChampionStats

interface ChampionObject {
  id: string
  ability: ChampionAbility
  cost: number
  icon: string
  name: string
  stats: ChampionStats
  traitIds: string[]
}

class Champion {
  id: string
  ability: ChampionAbility
  cost: number
  icon: string
  name: string
  stats: ChampionStats
  traitIds: string[]
  url: string

  constructor(object: ChampionObject) {
    const {
      id,
      ability,
      cost,
      icon,
      name,
      stats,
      traitIds,
    } = object

    this.id = id
    this.ability = ability
    this.cost = cost
    this.icon = icon
    this.name = name
    this.stats = stats
    this.traitIds = traitIds
    this.url = `/champions/${this.id.toLowerCase().replace(/tft([0-9]*)(b?)_/gi, '')}`
  }

  getAdjustedAbilityDescription() {
    const desc = this.ability.desc
    const replaceableValues = this.ability.desc.match(/@[0-9A-Za-z*.:_]*@/gi)

    const modifiedDesc = replaceableValues?.reduce((desc, replaceableValue) => {
      let substitute = '?'
      const values = this.ability.variables.find(variable => variable.name === replaceableValue.replace('Modified', '').replace(/@/gi, '').replace('*100', ''))?.value

      if(values) {
        const requiredValues = values.slice(1, 4).map(value => replaceableValue.includes('*100') ? (value * 100).toFixed() : value)
        substitute = new Set(requiredValues).size === 1 ? requiredValues[0].toString() : requiredValues.join(' / ')
      }

      return desc.replace(replaceableValue,  substitute)
    }, desc) ?? desc

    return substituteScaleIcons(modifiedDesc)
  }

  compareByCost(other: Champion) {
    return this.cost - other.cost
  }
}

export type {
  ChampionAbility,
  ChampionAbilityVariable,
  ChampionObject,
  ChampionStats,
  ChampionStatKeys,
}

export {
  Champion,
}

export default Champion
