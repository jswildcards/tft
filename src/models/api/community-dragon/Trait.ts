import NullablePrimitives from '../../NullablePrimitives'

interface TraitEffect {
  maxUnits: number
  minUnits: number
  style: number
  variables: Record<string, NullablePrimitives>
}

interface Trait {
  apiName: string
  desc: string
  effects: TraitEffect[]
  icon: string
  name: string
}

export default Trait
