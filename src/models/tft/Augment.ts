import NullablePrimitives from '../NullablePrimitives'
import { substituteScaleIcons } from '../../utils/description-substitution'

interface AugmentObject {
  id: string
  associatedTraits: string[]
  composition: string[]
  desc: string
  effects: Record<string, NullablePrimitives>
  from: null
  icon: string
  incompatibleTraits: string[]
  name: string
  unique: boolean
  tier: number
}

class Augment {
  id: string
  associatedTraits: string[]
  composition: string[]
  desc: string
  effects: Record<string, NullablePrimitives>
  from: null
  icon: string
  incompatibleTraits: string[]
  name: string
  unique: boolean
  composableItemIds: string[]
  tier: number

  constructor(object: AugmentObject) {
    const {
      id,
      associatedTraits,
      composition,
      desc,
      effects,
      from,
      icon,
      incompatibleTraits,
      name,
      unique,
      tier,
    } = object

    this.id = id
    this.associatedTraits = associatedTraits
    this.composition = composition
    this.desc = desc
    this.effects = effects
    this.from = from
    this.icon = icon
    this.incompatibleTraits = incompatibleTraits
    this.name = name
    this.unique = unique
    this.tier = tier
    this.composableItemIds = []
  }

  getAdjustedDescription() {
    return substituteScaleIcons(this.desc)
  }

  compare(other: Augment) {
    if(this.compareByTier(other) !== 0)
      return this.compareByTier(other)

    return this.compareByName(other)
  }

  compareByTier(other: Augment) {
    return this.tier - other.tier
  }

  compareByName(other: Augment) {
    return this.name < other.name ? -1 : 1
  }
}

export {
  Augment,
}

export default Augment
