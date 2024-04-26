import { ItemObject } from '../../../models/api/Item'
import { fetch_json } from './fetch'

function getItems(data_dragon_version: string, locale: string): Promise<ItemObject> {
  return fetch_json("items", data_dragon_version, locale)
}

export {
  getItems,
}

export default getItems
