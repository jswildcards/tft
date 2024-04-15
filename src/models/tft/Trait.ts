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
