import { VersionsResponse } from '../../../models/tft/versions/Response'

async function getVersions(): Promise<VersionsResponse> {
  const response = await fetch("https://raw.githubusercontent.com/jswildcards/tft-data/main/versions.json")
  return response.json()
}

export {
  getVersions,
}

export default getVersions
