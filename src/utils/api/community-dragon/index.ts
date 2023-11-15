import CommunityDragonResponse from '../../../models/api/community-dragon/Response'

async function getCommunityDragonData(communityDragonVersion: string, locale: string): Promise<CommunityDragonResponse> {
  const response = await fetch(`https://raw.communitydragon.org/${communityDragonVersion}/cdragon/tft/${locale}.json`)
  return response.json()
}

export {
  getCommunityDragonData,
}

export default getCommunityDragonData
