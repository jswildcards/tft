import Augment from "../models/tft/Augment"
import Champion from "../models/tft/Champion"
import Item from "../models/tft/Item"
import Trait from "../models/tft/Trait"
import VersionsResponse from "../models/tft/versions/Response"
import getAugments from "./api/tft/augments"
import getChampions from "./api/tft/champions"
import getItems from "./api/tft/items"
import getTraits from "./api/tft/traits"
import getVersions from "./api/tft/versions"

async function getTFTStaticDataResults(locale: string) {
  const {
    data_dragon: data_dragon_version,
  }: VersionsResponse = await getVersions()

  const augments = await getAugments(data_dragon_version, locale).then((augments) => {
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

  const champions = await getChampions(data_dragon_version, locale).then((champions) => {
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

  const items = await getItems(data_dragon_version, locale).then((items) => {
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

  const traits = await getTraits(data_dragon_version, locale).then((traits) => {
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
