function substituteScaleIcons(description: string) {
  const replaceableScales = description.match(/%i:[0-9A-Za-z*.:_]*%/gi)

  if(replaceableScales === undefined || replaceableScales === null)
    return description

  return replaceableScales.reduce((substitutedDescription, replaceableScale) => {
    const scale = replaceableScale.replace(/%/gi, '').replace('i:', '')
    return substitutedDescription.replace(replaceableScale, `<img src='/images/scales/${scale}.png' class='scale' />`)
  }, description)
}

export {
  substituteScaleIcons,
}

export default {
  substituteScaleIcons,
}
