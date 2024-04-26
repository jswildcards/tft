import { VersionsResponse } from '../../../models/tft/versions/Response'
import { fetch_json } from './fetch'

function getVersions(): Promise<VersionsResponse> {
  return fetch_json("versions")
}

export {
  getVersions,
}

export default getVersions
