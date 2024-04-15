import NullablePrimitives from '../NullablePrimitives'

interface AugmentObject {
  id: string
  associated_traits: string[]
  composition: string[]
  description: string
  effects: Record<string, NullablePrimitives>
  from: null
  icon: string
  incompatible_traits: string[]
  name: string
  unique: boolean
  tier: number
}

export type {
  AugmentObject,
}
