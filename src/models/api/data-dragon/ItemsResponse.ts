interface ItemImage {
  full: string
  sprite: string
  group: string
  x: number
  y: number
  w: number
  h: number
}

interface Item {
  id: string
  name: string
  tier: number
  image: ItemImage
}

type ItemDataRecords = Record<string, Item>

interface ItemsResponse {
  type: string
  version: string
  data: ItemDataRecords
}

export type {
  ItemImage,
  Item,
  ItemDataRecords,
  ItemsResponse,
}

export default ItemsResponse
