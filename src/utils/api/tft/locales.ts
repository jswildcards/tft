import { LocalesResponse } from '../../../models/tft/locales/Response'

async function getLocales(): Promise<LocalesResponse> {
  const response = await fetch('https://raw.githubusercontent.com/jswildcards/tft-data/main/available_languages.json')
  return response.json()
}

export {
  getLocales,
}

export default getLocales
