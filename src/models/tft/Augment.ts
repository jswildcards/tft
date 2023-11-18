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
    this.composableItemIds = []
  }

  getAdjustedDescription() {
    const desc = this.desc
    const replaceableValues = desc.match(/@[0-9A-Za-z*.:_]*@/gi)

    const modifiedDesc = replaceableValues?.reduce((desc, replaceableValue) => {
      let substitute: string | number = '?'
      const value = this.effects[replaceableValue.replace('Modified', '').replace(/@/gi, '').replace('*100', '')]

      if(value) {
        substitute = replaceableValue.includes('*100') ? (value * 100).toFixed() : value
      }

      return desc.replace(replaceableValue,  substitute)
    }, desc) ?? desc

    return substituteScaleIcons(modifiedDesc)
  }
}

export {
  Augment,
}

export default Augment
