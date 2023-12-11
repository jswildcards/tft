import ChampionsResponse from '../../../models/api/data-dragon/ChampionsResponse'
import TraitsResponse from '../../../models/api/data-dragon/TraitsResponse'
import ItemsResponse from '../../../models/api/data-dragon/ItemsResponse'
import AugmentsResponse from '../../../models/api/data-dragon/AugmentsResponse'

import fetch from '../fetch'

async function getChampions(version: string): Promise<ChampionsResponse> {
  const response = await fetch(`data/data-dragon/${version}/tft-champion.json`)
  return response.json()
}

async function getTraits(version: string): Promise<TraitsResponse> {
  const response = await fetch(`data/data-dragon/${version}/tft-trait.json`)
  return response.json()
}

async function getItems(version: string): Promise<ItemsResponse> {
  const response = await fetch(`data/data-dragon/${version}/tft-item.json`)
  return response.json()
}

async function getAugments(version: string): Promise<AugmentsResponse> {
  const response = await fetch(`data/data-dragon/${version}/tft-augments.json`)
  return response.json()
}

export {
  getChampions,
  getTraits,
  getItems,
  getAugments,
}

export default {
  getChampions,
  getTraits,
  getItems,
  getAugments,
}
