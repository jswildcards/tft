import { LocalesResponse } from '../../../models/tft/locales/Response'
import fetch from '../fetch'

async function getLocales(): Promise<LocalesResponse> {
  const response = await fetch('data/locales.json')
  return response.json()
}

export {
  getLocales,
}

export default getLocales
