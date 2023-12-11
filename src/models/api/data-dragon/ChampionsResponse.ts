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

type ChampionDataRecords = Record<string, Champion>

interface ChampionsResponse {
  type: string
  version: string
  data: ChampionDataRecords
}

export type {
  ChampionImage,
  Champion,
  ChampionDataRecords,
  ChampionsResponse,
}

export default ChampionsResponse
