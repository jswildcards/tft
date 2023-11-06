import { VersionsResponse } from '../../../models/tft/versions/Response'

async function getVersions(): Promise<VersionsResponse> {
  const response = await fetch('/data/versions.json')
  return response.json()
}

export {
  getVersions,
}

export default getVersions
