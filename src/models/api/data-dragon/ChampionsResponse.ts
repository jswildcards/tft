interface ChampionImage {
  full: string
  sprite: string
  group: string
  x: number
  y: number
  w: number
  h: number
}

interface Champion {
  id: string
  name: string
  tier: number
  image: ChampionImage
}

interface ChampionsResponse {
  type: string
  version: string
  data: Record<string, Champion>
}

export default ChampionsResponse
