import NullablePrimitives from '../NullablePrimitives'
import { substituteScaleIcons } from '../../utils/description-substitution'

interface ItemObject {
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

class Item {
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

  constructor(object: ItemObject) {
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

  base() {
    return this.composableItemIds.length > 0 && this.icon.includes('standard')
  }

  composable() {
    return this.composition.length > 0 && (this.icon.includes('standard') || this.emblem())
  }

  radiant() {
    return this.icon.includes('/radiant/')
  }

  support() {
    return this.icon.includes('support')
  }

  ornn() {
    return this.icon.includes('ornn')
  }

  emblem() {
    return this.incompatibleTraits.length > 0 && this.icon.includes('trait')
  }

  other() {
    return !(
      this.base() ||
      this.composable() ||
      this.radiant() ||
      this.support() ||
      this.ornn() ||
      this.emblem()
    )
  }

  addComposableItemId(itemId: string) {
    if(!this.composableItemIds.includes(itemId))
      this.composableItemIds = [...this.composableItemIds, itemId]
  }

  getBaseStatsWithIcon() {
    return [
      {
        id: "AD",
        value: this.effects["AD"],
        iconName: "scaleAD",
      },
      {
        id: "AP",
        value: this.effects["AP"],
        iconName: "scaleAP",
      },
      {
        id: "AS",
        value: this.effects["AS"],
        iconName: "scaleAS",
      },
      {
        id: "Armor",
        value: this.effects["Armor"],
        iconName: "scaleArmor",
      },
      {
        id: "Health",
        value: this.effects["Health"],
        iconName: "scaleHealth",
      },
      {
        id: "MagicResist",
        value: this.effects["MagicResist"],
        iconName: "scaleMR",
      },
      {
        id: "Mana",
        value: this.effects["Mana"],
        iconName: "scaleMana",
      },
      {
        id: "CritChance",
        value: this.effects["CritChance"],
        iconName: "scaleCrit",
      },
    ].filter(({ value }) => value).map(({id,value,iconName}) => {
      return {
        id,
        iconName,
        value: typeof(value) === 'number' && value < 1 ? `${(value * 100).toFixed()}%` : value,
      }
    })
  }

  getAdjustedDescription() {
    const desc = this.desc
    const replaceableValues = desc.match(/@[0-9A-Za-z*.:_]*@/gi)

    const modifiedDesc = replaceableValues?.reduce((desc, replaceableValue) => {
      let substitute = '?'
      const value = this.effects[replaceableValue.replace('Modified', '').replace(/@/gi, '').replace('*100', '')]

      if(value) {
        substitute = (replaceableValue.includes('*100') ? ((value as number) * 100).toFixed() : value).toString()
      }

      return desc.replace(replaceableValue,  substitute)
    }, desc) ?? desc

    return substituteScaleIcons(modifiedDesc)
  }
}

export {
  Item,
}

export default Item
