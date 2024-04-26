import { LocalesResponse } from '../../../models/tft/locales/Response'
import { fetch_json } from './fetch'

function getLocales(): Promise<LocalesResponse> {
  return fetch_json('available_languages')
}

export {
  getLocales,
}

export default getLocales
