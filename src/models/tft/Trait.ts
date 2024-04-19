import NullablePrimitives from '../NullablePrimitives'
import { substituteScaleIcons } from '../../utils/description-substitution'

interface TraitEffect {
  maxUnits: number
  minUnits: number
  style: number
  variables: Record<string, NullablePrimitives>
}

interface TraitObject {
  id: string
  desc: string
  effects: TraitEffect[]
  icon: string
  name: string
  championIds: string[]
}

class Trait {
  id: string
  desc: string
  effects: TraitEffect[]
  icon: string
  name: string
  championIds: string[]

  constructor(object: TraitObject) {
    const {
      id,
      desc,
      effects,
      icon,
      name,
      championIds,
    } = object

    this.id = id
    this.desc = desc
    this.effects = effects
    this.icon = icon
    this.name = name
    this.championIds = championIds
  }

  minUnitsNeededToNextLevel(count: number) {
    return this.minUnitsToNextLevel(count) - count
  }

  minUnitsToNextLevel(count: number) {
    let currentMinUnits = Infinity

    this.effects.forEach(({ minUnits }) => {
      if(count < (minUnits as number) && currentMinUnits === Infinity)
        currentMinUnits = (minUnits as number)
    })

    return currentMinUnits === Infinity ? this.effects.slice(-1)[0].minUnits : currentMinUnits
  }

  getEffectLevel(count: number) {
    return this.effects.find(({ maxUnits, minUnits }) => {
      return (minUnits as number) <= count && count <= (maxUnits as number)
    })?.style as number ?? 0
  }

  getAdjustedDescription() {
    return substituteScaleIcons(this.desc)
  }
}

export type {
  TraitEffect,
}

export {
  Trait,
}

export default Trait
