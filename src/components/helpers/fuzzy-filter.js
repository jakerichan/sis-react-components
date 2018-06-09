import * as R from 'ramda'
import { getRowLabels } from './get-row-labels'

const getIndexScore = (index, previous) => (index === previous + 1 ? 2 : 1)
const getFuzzyScore = (searchText, label) => {
  label = R.toUpper(label)
  searchText = R.toUpper(searchText)
  let i
  let lastIndex = -1
  let indexHistory = []
  let letter
  let score = 0

  for (i = 0; i < searchText.length; i++) {
    letter = searchText[i]
    lastIndex = label.indexOf(letter, lastIndex + 1)
    if (lastIndex === -1) return 0
    indexHistory.push(lastIndex)
    score += getIndexScore(lastIndex, indexHistory[i - 1])
  }

  return score
}

const getSearchParts = searchText =>
  R.pipe(R.split(','), R.map(R.trim), R.filter(p => !!p))(searchText)

const getRowScoreForSearch = (searchPart, labels) => {
  let highScore = [0, '']
  R.forEachObjIndexed((label, property) => {
    let score = getFuzzyScore(searchPart, label)
    if (score > highScore[0]) {
      highScore[0] = score
      highScore[1] = property
    }
  })(labels)
  return highScore
}

const fuzzyFilter = (searchText, searchableProperties) => {
  if (!searchText) {
    return R.identity
  }
  return R.filter(row => {
    const labels = getRowLabels(row, searchableProperties)
    const searchParts = getSearchParts(searchText)
    let total = 0

    while (searchParts.length) {
      let [score, property] = getRowScoreForSearch(searchParts.shift(), labels)
      if (!score) {
        return false
      }
      total += score
      delete labels[property]
    }
    row.score = total
    return true
  })
}

export default fuzzyFilter
