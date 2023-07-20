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

interface Champion {
  ability: ChampionAbility
  apiName: string
  characterName: string
  cost: number
  icon: string
  name: string
  squareIcon: string
  stats: ChampionStats
  tileIcon: string
  traits: string[]
}

export default Champion
