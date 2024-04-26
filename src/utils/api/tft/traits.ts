import { TraitObject } from '../../../models/api/Trait'
import { fetch_json } from './fetch'

function getTraits(data_dragon_version: string, locale: string): Promise<TraitObject> {
  return fetch_json("traits", data_dragon_version, locale)
}

export {
  getTraits,
}

export default getTraits
