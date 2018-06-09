import R from 'ramda'
import React from 'react'
import { getRowLabels } from '~/lib/get-row-labels'

const getBoldedLabel = (tagGroups, originalValue, id) => {
  return Object.keys(tagGroups).map((start, i, tagGroupKeys) => {
    start *= 1
    const group = tagGroups[start]
    const prefix = i === 0 ? R.slice(0, start, originalValue) : ''
    const endOfGroup = R.add(start, group.length)
    const startOfNextGroup = tagGroupKeys[i + 1]
    const postfix = R.slice(endOfGroup, startOfNextGroup, originalValue)
    const elementKey = `${R.replace(/\s/g, '-')(originalValue)}-${id}-${i}`
    return (
      <span key={elementKey}>
        {prefix}
        <strong>{group.join('')}</strong>
        {postfix}
      </span>
    )
  })
}

const getTagGroups = (searchLetters, originalValue = '') => {
  searchLetters = searchLetters.toUpperCase()
  let lastIndex = -1
  let lastTagIndex = -1
  let tagGroups = {}
  let i = 0
  let searchLetter

  while (i < searchLetters.length) {
    searchLetter = searchLetters[i]
    let labelIndex = originalValue
      .toUpperCase()
      .indexOf(searchLetter, lastIndex + 1)
    const isConsecutive = lastIndex === labelIndex - 1
    if (labelIndex === -1) return {}
    if (isConsecutive && lastIndex > -1) {
      tagGroups[lastTagIndex].push(originalValue[labelIndex])
    } else {
      tagGroups[labelIndex] = [originalValue[labelIndex]]
      labelIndex = originalValue
        .toUpperCase()
        .indexOf(searchLetter, lastIndex + 1)
      lastTagIndex = labelIndex
    }

    lastIndex = labelIndex
    i++
  }

  return tagGroups
}

const getSearchWithTheMostMatches = groups => {
  let groupCount = 0
  let biggestGroupKey = ''
  R.forEachObjIndexed((tagGroupForSearch, key) => {
    const matches = R.flatten(R.values(tagGroupForSearch)).length
    if (matches > groupCount) {
      groupCount = matches
      biggestGroupKey = key
    }
  })(groups)

  return biggestGroupKey
}

const buildSearchGroups = (searchParts, label) => {
  const searchTagGroups = {}
  R.forEach(searchValue => {
    const tagGroups = getTagGroups(searchValue, label)
    if (R.keys(tagGroups).length) searchTagGroups[searchValue] = tagGroups
  })(searchParts)

  return searchTagGroups
}

const getSearchParts = R.pipe(R.split(','), R.map(R.trim()))

const getPropertyFromRow = (property, row) => {
  return typeof property === 'function' ? property(row) : property
}

const highlightSearch = (searchText, searchableProperties) => {
  if (!searchText) {
    return R.identity
  }
  return R.map(row => {
    const searchParts = getSearchParts(searchText)
    const historicalValues = getRowLabels(row, searchableProperties)
    const { guid = '' } = row
    let modifiedRow = R.clone(row)
    R.forEach(searchableProperty => {
      const property = getPropertyFromRow(searchableProperty, row)
      let label = R.propOr('', property, historicalValues)
      if (typeof label === 'function') label = label(row)
      const searchTagGroups = buildSearchGroups(searchParts, label)
      const biggestGroup = getSearchWithTheMostMatches(searchTagGroups)

      if (searchTagGroups[biggestGroup]) {
        searchParts.splice(searchParts.indexOf(biggestGroup), 1)
        modifiedRow = R.assoc(
          property,
          getBoldedLabel(searchTagGroups[biggestGroup], label, guid),
          modifiedRow
        )
      }
    })(searchableProperties)

    return modifiedRow
  })
}

export default highlightSearch
