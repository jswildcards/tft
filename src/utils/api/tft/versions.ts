import { VersionsResponse } from '../../../models/tft/Versions'

async function getVersions(): Promise<VersionsResponse> {
  const response = await fetch('/data/versions.json')
  return response.json()
}

export {
  getVersions,
}

export default getVersions
