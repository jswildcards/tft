interface AugmentImage {
  full: string
  sprite: string
  group: string
  x: number
  y: number
  w: number
  h: number
}

interface Augment {
  id: string
  name: string
  image: AugmentImage
}

interface AugmentContainerImage {
  full: string
  sprite: string
  group: string
  x: number
  y: number
  w: number
  h: number
}

interface AugmentContainer {
  name: string
  image: AugmentContainerImage
}

type AugmentDataRecords = Record<string, Augment>

interface AugmentsResponse {
  type: string
  version: string
  "augment-container": AugmentContainer
  data: AugmentDataRecords
}

export type {
  AugmentImage,
  Augment,
  AugmentContainerImage,
  AugmentContainer,
  AugmentDataRecords,
  AugmentsResponse,
}

export default AugmentsResponse
