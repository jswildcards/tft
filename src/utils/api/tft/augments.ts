import { AugmentObject } from '../../../models/api/Augment'
import { fetch_json } from './fetch'

function getAugments(data_dragon_version: string, locale: string): Promise<AugmentObject> {
  return fetch_json("augments", data_dragon_version, locale)
}

export {
  getAugments,
}

export default getAugments
