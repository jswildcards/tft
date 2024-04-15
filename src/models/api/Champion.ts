interface ChampionAbilityVariable {
  name: string
  value: number[]
}

interface ChampionAbility {
  description: string
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
  trait_ids: string[]
}

export type {
  ChampionAbility,
  ChampionAbilityVariable,
  ChampionObject,
  ChampionStats,
  ChampionStatKeys,
}
