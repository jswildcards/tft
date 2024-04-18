import {AugmentObject} from "../models/api/Augment"
import {ChampionObject} from "../models/api/Champion"
import {ItemObject} from "../models/api/Item"
import {TraitObject} from "../models/api/Trait"
import Augment from "../models/tft/Augment"
import Champion from "../models/tft/Champion"
import Item from "../models/tft/Item"
import Trait from "../models/tft/Trait"
import VersionsResponse from "../models/tft/versions/Response"
import getVersions from "./api/tft/versions"

async function fetch_json(url: string) {
    const response = await fetch(url)
    return response.json()
}

async function getTFTStaticDataResults(locale: string) {
  const {
    data_dragon: data_dragon_version,
  }: VersionsResponse = await getVersions()

  const augments = await fetch_json(`https://jswildcards.github.io/tft-data/${data_dragon_version}/${locale}/augments.json`).then((augments: Record<string, AugmentObject>) => {
    const new_augments: Record<string, Augment> = {}

    for(const [augment_id, augment] of Object.entries(augments)) {
      new_augments[augment_id] = new Augment({
        id: augment_id,
        associatedTraits: augment.associated_traits,
        composition: augment.composition,
        desc: augment.description,
        effects: augment.effects,
        from: null,
        icon: augment.icon,
        incompatibleTraits: augment.incompatible_traits,
        name: augment.name,
        unique: augment.unique,
        tier: augment.tier,
      })
    }

    return new_augments
  })

  const champions = await fetch_json(`https://jswildcards.github.io/tft-data/${data_dragon_version}/${locale}/champions.json`).then((champions: Record<string, ChampionObject>) => {
    const new_champions: Record<string, Champion> = {}

    for(const [champion_id, champion] of Object.entries(champions)) {
      new_champions[champion_id] = new Champion({
        id: champion_id,
        ability: {
          desc: champion.ability.description,
          icon: champion.ability.icon,
          name: champion.ability.name,
          variables: champion.ability.variables,
        },
        cost: champion.cost,
        icon: champion.icon,
        name: champion.name,
        stats: champion.stats,
        traitIds: champion.trait_ids,
      })
    }

    return new_champions
  })

  const items = await fetch_json(`https://jswildcards.github.io/tft-data/${data_dragon_version}/${locale}/items.json`).then((items: Record<string, ItemObject>) => {
    const new_items: Record<string, Item> = {}

    for(const [item_id, item] of Object.entries(items)) {
      new_items[item_id] = new Item({
        id: item_id,
        associatedTraits: item.associated_traits,
        composition: item.composition,
        desc: item.description,
        effects: item.effects,
        from: null,
        icon: item.icon,
        incompatibleTraits: item.incompatible_traits,
        name: item.name,
        unique: item.unique,
      })
    }

    // build composable items list for base items
    // TODO: re-implement it on data source side
    Object.values(new_items).filter(item => item.composable()).forEach(item => {
      item.composition.forEach(baseItemId => {
        new_items[baseItemId].addComposableItemId(item.id)
      })
    })

    return new_items
  })

  const traits = await fetch_json(`https://jswildcards.github.io/tft-data/${data_dragon_version}/${locale}/traits.json`).then((traits: Record<string, TraitObject>) => {
    const new_traits: Record<string, Trait> = {}

    for(const [trait_id, trait] of Object.entries(traits)) {
      new_traits[trait_id] = new Trait({
        id: trait_id,
        desc: trait.description,
        effects: trait.effects,
        icon: trait.icon,
        name: trait.name,
        championIds: trait.champion_ids,
      })
    }

    return new_traits
  })

  return {
    augments,
    champions,
    items,
    traits,
    data_dragon_version,
  }
}

export {
  getTFTStaticDataResults,
}

export default {
  getTFTStaticDataResults,
}
