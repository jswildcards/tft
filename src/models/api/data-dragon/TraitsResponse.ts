interface TraitImage {
  full: string
  sprite: string
  group: string
  x: number
  y: number
  w: number
  h: number
}

interface Trait {
  id: string
  name: string
  tier: number
  image: TraitImage
}

type TraitDataRecords = Record<string, Trait>

interface TraitsResponse {
  type: string
  version: string
  data: TraitDataRecords
}

export type {
  TraitImage,
  Trait,
  TraitDataRecords,
  TraitsResponse,
}

export default TraitsResponse
