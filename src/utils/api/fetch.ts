const baseURL = import.meta.env.BASE_URL

function fetchLocalData(url: string) {
  return fetch(`${baseURL}${url}`)
}

export {
  fetchLocalData,
}

export default fetchLocalData
