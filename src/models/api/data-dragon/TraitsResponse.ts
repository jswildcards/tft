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

interface TraitsResponse {
  type: string
  version: string
  data: Record<string, Trait>
}

export default TraitsResponse
