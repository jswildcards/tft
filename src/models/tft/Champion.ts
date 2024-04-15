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
    this.url = `/champions/${this.id}`
  }

  getAdjustedAbilityDescription() {
    return substituteScaleIcons(this.ability.desc)
  }

  compareByName(other: Champion) {
      return this.name < other.name ? -1 : 1
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
