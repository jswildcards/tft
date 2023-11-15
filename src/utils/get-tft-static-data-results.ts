import { Champion } from '../models/tft/Champion'
import { Trait } from '../models/tft/Trait'
import { Item } from '../models/tft/Item'
import CommunityDragonResponse from '../models/api/community-dragon/Response'

import { getVersions } from '../utils/api/tft/versions'
import { getCommunityDragonData } from '../utils/api/community-dragon'
import {
  getChampions,
  getTraits,
  getItems,
  getAugments
} from '../utils/api/data-dragon'

async function extractCommunityDragonRecords(communityDragonVersion: string, setVersion: string, locale: string) {
  const data: CommunityDragonResponse = await getCommunityDragonData(communityDragonVersion, locale)
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

function getItemsFromRawData(dataDragonItems, communityDragonItems) {
  // Temporarily disabling non-related items
  const excludedItemIds = [
    'TFT_Item_UnusableSlot',
  ]

  const excludedItemNames = [
    '',
  ]

  const itemIds = Object.keys(dataDragonItems).map(itemId => {
    if(itemId.match('/'))
      return itemId.split('/')[1]

    return itemId
  })

  const items: Record<string, Item> = itemIds.reduce((items, itemId) => {
    const itemObject = communityDragonItems.find(item => item.apiName === itemId)

    const item = new Item({
      id: itemId,
      associatedTraits: itemObject.associatedTraits,
      composition: itemObject.composition,
      desc: itemObject.desc,
      effects: itemObject.effects,
      from: itemObject.from,
      icon: getIconURL(itemObject.icon),
      incompatibleTraits: itemObject.incompatibleTraits,
      name: itemObject.name,
      unique: itemObject.unique,
    })

    if(excludedItemNames.includes(item.name) || excludedItemIds.includes(item.id))
      return items

    return {
      ...items,
      [itemId]: item,
    }
  }, {})

  Object.values(items).filter(item => item.composable()).forEach(item => {
    item.composition.forEach(baseItemId => {
      items[baseItemId].addComposableItemId(item.id)
    })
  })

  return items
}

async function getTFTStaticDataResults(locale: string) {
  const {
    dataDragon: dataDragonVersion,
    communityDragon: communityDragonVersion,
    set: setVersion,
  } = await getVersions()

  const communityDragonData = await extractCommunityDragonRecords(communityDragonVersion, setVersion, locale)
  const dataDragonData = await extractDataDragonRecords(dataDragonVersion)

  const traitHashes = getTraitsFromRawData(dataDragonData.traits, communityDragonData.traits)
  const traits = Object.values(traitHashes)

  const championHashes = getChampionsFromRawData(dataDragonData.champions, communityDragonData.champions, traits)

  const itemHashes = getItemsFromRawData(dataDragonData.items, communityDragonData.items)

  return {
    traits:    traitHashes,
    champions: championHashes,
    items:     itemHashes,
  }
}

export {
  getTFTStaticDataResults,
}

export default {
  getTFTStaticDataResults,
}
