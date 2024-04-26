async function fetch_json(resource_name: string, data_dragon_version?: string, locale?: string) {
  const origin = 'https://jswildcards.github.io/tft-data'

  if(data_dragon_version !== undefined && locale !== undefined) {
    const response = await fetch(`${origin}/${data_dragon_version}/${locale}/${resource_name}.json`)
    return response.json()
  }

  const response = await fetch(`${origin}/${resource_name}.json`)
  return response.json()
}

export {
  fetch_json,
}

export default {
  fetch_json,
}
