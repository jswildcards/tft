import { Champion } from '../models/tft/Champion'
import { Trait } from '../models/tft/Trait'
import { Item } from '../models/tft/Item'
import { Augment } from '../models/tft/Augment'
import { Response as CommunityDragonResponse, Item as CDragonItem } from '../models/api/community-dragon/Response'
import { Champion as CDragonChampion } from '../models/api/community-dragon/Champion'
import { Trait as CDragonTrait } from '../models/api/community-dragon/Trait'
import { ChampionDataRecords } from '../models/api/data-dragon/ChampionsResponse'
import { TraitDataRecords } from '../models/api/data-dragon/TraitsResponse'
import { ItemDataRecords } from '../models/api/data-dragon/ItemsResponse'
import { AugmentDataRecords } from '../models/api/data-dragon/AugmentsResponse'

import { getVersions } from '../utils/api/tft/versions'
import { getCommunityDragonData } from '../utils/api/community-dragon'
import {
  getChampions,
  getTraits,
  getItems,
  getAugments
} from '../utils/api/data-dragon'

interface DataDragonRecords {
  champions: ChampionDataRecords
  traits: TraitDataRecords
  items: ItemDataRecords
  augments: AugmentDataRecords
}

async function extractCommunityDragonRecords(communityDragonVersion: string, setVersion: string, locale: string) {
  const data: CommunityDragonResponse = await getCommunityDragonData(communityDragonVersion, locale)
  const currentSet = data.setData.find(set => set.mutator === setVersion)

  if(currentSet === undefined)
    return

  return {
    champions: currentSet.champions,
    traits:    currentSet.traits,
    items:     data.items,
  }
}

async function extractDataDragonRecords(dataDragonVersion: string): Promise<DataDragonRecords> {
  return {
    champions: (await getChampions(dataDragonVersion)).data,
    traits:    (await getTraits(dataDragonVersion)).data,
    items:     (await getItems(dataDragonVersion)).data,
    augments:  (await getAugments(dataDragonVersion)).data,
  }
}

function getIconURL(path: string): string {
  return `https://raw.communitydragon.org/latest/game/${path.toLowerCase().replace('.tex', '.png').replace('.dds', '.png')}`
}

function getTraitsFromRawData(dataDragonTraits: TraitDataRecords, communityDragonTraits: CDragonTrait[]): Record<string, Trait> {
  const traitIds = Object.keys(dataDragonTraits)

  return traitIds.reduce((traits, traitId) => {
    const traitObject = communityDragonTraits.find(trait => trait.apiName === traitId)

    if(traitObject === undefined)
      return traits

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

function getChampionsFromRawData(dataDragonChampions: ChampionDataRecords, communityDragonChampions: CDragonChampion[], traits: Trait[]) {
  const championIds = Object.keys(dataDragonChampions).sort((championIdA, championIdB) => {
    return getOriginalChampionName(championIdA) > getOriginalChampionName(championIdB) ? 1 : -1
  })

  return championIds.reduce((champions, championId) => {
    const championObject = communityDragonChampions.find(champion => champion.apiName === championId)

    if(championObject === undefined)
      return champions

    const championTraits: Trait[] = championObject.traits.map(traitName => {
      return traits.find(trait => trait.name === traitName)
    }).filter((trait?: Trait): trait is Trait => trait !== undefined)

    const champion = new Champion({
      id:      championObject.characterName,
      ability: championObject.ability,
      cost:    championObject.cost,
      icon:    getIconURL(championObject.tileIcon),
      name:    championObject.name,
      stats:   championObject.stats,
      traitIds:  championTraits.map((trait: Trait) => trait.id),
    })

    champion.ability.icon = getIconURL(champion.ability.icon)
    championTraits.forEach(trait => {
      trait.addChampionId(getOriginalChampionName(champion.id))
    })

    return {
      ...champions,
      [getOriginalChampionName(champion.id)]: champion,
    }
  }, {})
}

function getItemsFromRawData(dataDragonItems: ItemDataRecords, communityDragonItems: CDragonItem[]) {
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

    if(itemObject === undefined)
      return items

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

function getAugmentsFromRawData(dataDragonAugments: AugmentDataRecords, communityDragonAugments: CDragonItem[]) {
  const augmentIds = Object.keys(dataDragonAugments)

  const augments: Record<string, Augment> = augmentIds.reduce((augments, augmentId) => {
    const augmentObject = communityDragonAugments.find(augment => augment.apiName === augmentId)

    if(augmentObject === undefined)
      return augments

    const augment = new Augment({
      id: augmentId,
      associatedTraits: augmentObject.associatedTraits,
      composition: augmentObject.composition,
      desc: augmentObject.desc,
      effects: augmentObject.effects,
      from: augmentObject.from,
      icon: getIconURL(augmentObject.icon),
      incompatibleTraits: augmentObject.incompatibleTraits,
      name: augmentObject.name,
      unique: augmentObject.unique,
    })

    return {
      ...augments,
      [augmentId]: augment,
    }
  }, {})

  return augments
}

async function getTFTStaticDataResults(locale: string) {
  const {
    dataDragon: dataDragonVersion,
    communityDragon: communityDragonVersion,
    set: setVersion,
  } = await getVersions()

  const communityDragonData = await extractCommunityDragonRecords(communityDragonVersion, setVersion, locale)
  const dataDragonData = await extractDataDragonRecords(dataDragonVersion)

  if(communityDragonData === undefined) {
    return {
      traits: null,
      champions: null,
      items: null,
      augments: null,
    }
  }

  const traitHashes = getTraitsFromRawData(dataDragonData.traits, communityDragonData.traits)
  const traits = Object.values(traitHashes)

  const championHashes = getChampionsFromRawData(dataDragonData.champions, communityDragonData.champions, traits)

  const itemHashes = getItemsFromRawData(dataDragonData.items, communityDragonData.items)
  const augmentHashes = getAugmentsFromRawData(dataDragonData.augments, communityDragonData.items)

  return {
    traits:    traitHashes,
    champions: championHashes,
    items:     itemHashes,
    augments:  augmentHashes,
  }
}

export {
  getTFTStaticDataResults,
}

export default {
  getTFTStaticDataResults,
}
