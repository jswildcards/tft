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

interface ItemsResponse {
  type: string
  version: string
  data: Record<string, Item>
}

export default ItemsResponse
