import { ChampionObject } from '../../../models/api/Champion'
import { fetch_json } from './fetch'

function getChampions(data_dragon_version: string, locale: string): Promise<ChampionObject> {
  return fetch_json("champions", data_dragon_version, locale)
}

export {
  getChampions,
}

export default getChampions
