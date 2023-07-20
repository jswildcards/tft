import NullablePrimitives from '../../NullablePrimitives'
import Champion from './Champion'
import Trait from './Trait'

interface Item {
  apiName: string
  associatedTraits: string[]
  composition: string[]
  desc: string
  effects: Record<string, NullablePrimitives>
  from: null
  icon: string
  id: null
  incompatibleTraits: string[]
  name: string
  unique: boolean
}

interface SetData {
  champions: Champion[]
  mutator: string
  name: string
  number: number
  traits: Trait[]
}

interface Set {
  champions: Champion[]
  name: string
  traits: Trait[]
}

interface Response {
  items: Item[]
  setData: SetData[]
  sets: Set[]
}

export default Response
