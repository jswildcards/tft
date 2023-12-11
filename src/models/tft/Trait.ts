import fnv from 'fnv-plus'
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
    } = object

    this.id = id
    this.desc = desc
    this.effects = effects
    this.icon = icon
    this.name = name
    this.championIds = []
  }

  addChampionId(id: string) {
    if(!this.championIds.includes(id))
      this.championIds = [...this.championIds, id]
  }

  getAdjustedDescription() {
    const desc = this.desc
    let adjustedDescription = desc

    const replaceableExtendEffectDescription = desc.match(/<expandrow>.*<\/expandrow>/gi)?.[0]

    if(replaceableExtendEffectDescription !== undefined) {
      adjustedDescription = adjustedDescription.replace(replaceableExtendEffectDescription, this.effects.map(() => replaceableExtendEffectDescription?.replace(/expandrow/gi, 'row')).join('</br>'))
    }

    adjustedDescription = substituteScaleIcons(adjustedDescription)

    const replaceableEffectDescriptions = adjustedDescription.match(/<row>(?!<\/br>)(.*?)<\/row>/gi)

    adjustedDescription = replaceableEffectDescriptions?.map((effectDescription, index) => {
      const effect = this.effects[index]

      let modifiedDesc = effectDescription.replace(/\(@MinUnits@\) */, `<div class="trait-style trait-style--${effect.style}">${effect.minUnits}</div><div>`).replace('</row>', '</div></row>')
      const replaceableValues = modifiedDesc.match(/@[0-9A-Za-z*.:_]*@/gi)

      modifiedDesc = replaceableValues?.reduce((desc, replaceableValue) => {
        let substitute = '?'
        let value = effect.variables[replaceableValue.replace(/@/gi, '').replace('*100', '')]

        if(value === undefined) {
          value = effect.variables[`{${fnv.hash(replaceableValue.replace(/@/gi, '').replace('*100', '').toLowerCase(), 32).hex()}}`]
        }

        if(value) {
          const requiredValue = replaceableValue.includes('*100') ? ((value as number) * 100).toFixed() : value
          substitute = requiredValue.toString()
        }

        return desc.replace(replaceableValue,  substitute)
      }, modifiedDesc) ?? modifiedDesc

      return {
        originalDesc: effectDescription,
        modifiedDesc,
      }
    })?.reduce((adjustedDescription, { originalDesc, modifiedDesc }) => {
      return adjustedDescription.replace(originalDesc, modifiedDesc)
    }, adjustedDescription) ?? adjustedDescription

    const replaceableValues = adjustedDescription.match(/@[0-9A-Za-z*.:_]*@/gi)

    adjustedDescription = replaceableValues?.reduce((desc, replaceableValue) => {
      let substitute: string | number = '?'
      let value = this.effects[0].variables[replaceableValue.replace(/@/gi, '').replace('*100', '')]

      if(value === undefined) {
        value = this.effects[0].variables[`{${fnv.hash(replaceableValue.replace(/@/gi, '').replace('*100', '').toLowerCase(), 32).hex()}}`]
      }

      if(value) {
        const requiredValue = replaceableValue.includes('*100') ? ((value as number) * 100).toFixed() : value
        substitute = requiredValue.toString()
      }

      return desc.replace(replaceableValue,  substitute)
    }, adjustedDescription) ?? adjustedDescription

    return adjustedDescription
  }
}

export type {
  TraitEffect,
}

export {
  Trait,
}

export default Trait
