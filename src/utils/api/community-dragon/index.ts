import CommunityDragonResponse from '../../../models/api/community-dragon/Response'

async function getCommunityDragonData(communityDragonVersion: string): Promise<CommunityDragonResponse> {
  const language = 'en_us'
  const response = await fetch(`https://raw.communitydragon.org/${communityDragonVersion}/cdragon/tft/${language}.json`)
  return response.json()
}

export {
  getCommunityDragonData,
}

export default getCommunityDragonData
