import NullablePrimitives from '../NullablePrimitives'

interface TraitEffect {
  maxUnits: number
  minUnits: number
  style: number
  variables: Record<string, NullablePrimitives>
}

interface TraitObject {
  id: string
  description: string
  effects: TraitEffect[]
  icon: string
  name: string
  champion_ids: string[]
}

export type {
  TraitEffect,
  TraitObject,
}
