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

  const augments = await fetch_json(`https://raw.githubusercontent.com/jswildcards/tft-data/main/${data_dragon_version}/${locale}/augments.json`).then(augments => {
    for(const [augment_id, augment] of Object.entries(augments)) {
      augments[augment_id] = new Augment({
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

    return augments
  })

  const champions = await fetch_json(`https://raw.githubusercontent.com/jswildcards/tft-data/main/${data_dragon_version}/${locale}/champions.json`).then(champions => {
    for(const [champion_id, champion] of Object.entries(champions)) {
      champions[champion_id] = new Champion({
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

    return champions
  })

  const items = await fetch_json(`https://raw.githubusercontent.com/jswildcards/tft-data/main/${data_dragon_version}/${locale}/items.json`).then(items => {
    for(const [item_id, item] of Object.entries(items)) {
      items[item_id] = new Item({
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
    Object.values(items).filter(item => item.composable()).forEach(item => {
      item.composition.forEach(baseItemId => {
        items[baseItemId].addComposableItemId(item.id)
      })
    })

    return items
  })

  const traits = await fetch_json(`https://raw.githubusercontent.com/jswildcards/tft-data/main/${data_dragon_version}/${locale}/traits.json`).then(traits => {
    for(const [trait_id, trait] of Object.entries(traits)) {
      traits[trait_id] = new Trait({
        id: trait_id,
        desc: trait.description,
        effects: trait.effects,
        icon: trait.icon,
        name: trait.name,
        championIds: trait.champion_ids,
      })
    }

    return traits
  })

  return {
    augments,
    champions,
    items,
    traits,
  }
}

export {
  getTFTStaticDataResults,
}

export default {
  getTFTStaticDataResults,
}
