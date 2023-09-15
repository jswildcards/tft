import { Champion } from '../models/tft/Champion'
import { Trait } from '../models/tft/Trait'
import CommunityDragonResponse from '../models/api/community-dragon/Response'

import { getVersions } from '../utils/api/tft/versions'
import { getCommunityDragonData } from '../utils/api/community-dragon'
import {
  getChampions,
  getTraits,
  getItems,
  getAugments
} from '../utils/api/data-dragon'

async function extractCommunityDragonRecords(communityDragonVersion: string, setVersion: string) {
  const data: CommunityDragonResponse = await getCommunityDragonData(communityDragonVersion)
  const currentSet = data.setData.find(set => set.mutator === setVersion)

  return {
    champions: currentSet?.champions,
    traits:    currentSet?.traits,
    items:     data.items,
  }
}

async function extractDataDragonRecords(dataDragonVersion: string) {
  return {
    champions: (await getChampions(dataDragonVersion)).data,
    traits:    (await getTraits(dataDragonVersion)).data,
    items:     (await getItems(dataDragonVersion)).data,
    augments:  (await getAugments(dataDragonVersion)).data,
  }
}

function getIconURL(path: string) {
  return `https://raw.communitydragon.org/latest/game/${path.toLowerCase().replace('.tex', '.png').replace('.dds', '.png')}`
}

function getTraitsFromRawData(dataDragonTraits, communityDragonTraits) {
  const traitIds = Object.keys(dataDragonTraits)

  return traitIds.reduce((traits, traitId) => {
    const traitObject = communityDragonTraits.find(trait => trait.apiName === traitId)

    const trait = new Trait({
      id: traitId,
      desc: traitObject.desc,
      effects: traitObject.effects,
      icon: getIconURL(traitObject.icon),
      name: traitObject.name,
    })

    return {
      ...traits,
      [traitId]: trait,
    }
  }, {})
}

function getOriginalChampionName(championId: string) {
  return championId.toLowerCase().replace(/tft([0-9]*)(b?)_/gi, '')
}

function getChampionsFromRawData(dataDragonChampions, communityDragonChampions, traits: Trait[]) {
  const championIds = Object.keys(dataDragonChampions).sort((championIdA, championIdB) => {
    return getOriginalChampionName(championIdA) > getOriginalChampionName(championIdB) ? 1 : -1
  })

  return championIds.reduce((champions, championId) => {
    const championObject = communityDragonChampions.find(champion => champion.apiName === championId)
    const championTraits = championObject.traits.map(traitName => {
      return traits.find(trait => trait.name === traitName)
    })

    const champion = new Champion({
      id:      championObject.characterName,
      ability: championObject.ability,
      cost:    championObject.cost,
      icon:    getIconURL(championObject.tileIcon),
      name:    championObject.name,
      stats:   championObject.stats,
      traitIds:  championTraits.map(trait => trait?.id),
    })

    champion.ability.icon = getIconURL(champion.ability.icon)
    championTraits.forEach(trait => {
      trait?.addChampionId(getOriginalChampionName(champion.id))
    })

    return {
      ...champions,
      [getOriginalChampionName(champion.id)]: champion,
    }
  }, {})
}

async function getTFTStaticDataResults() {
  const {
    dataDragon: dataDragonVersion,
    communityDragon: communityDragonVersion,
    set: setVersion,
  } = await getVersions()

  const communityDragonData = await extractCommunityDragonRecords(communityDragonVersion, setVersion)
  const dataDragonData = await extractDataDragonRecords(dataDragonVersion)

  const traitHashes = getTraitsFromRawData(dataDragonData.traits, communityDragonData.traits)
  const traits = Object.values(traitHashes)

  const championHashes = getChampionsFromRawData(dataDragonData.champions, communityDragonData.champions, traits)

  return {
    traits:    traitHashes,
    champions: championHashes,
  }
}

export {
  getTFTStaticDataResults,
}

export default {
  getTFTStaticDataResults,
}
