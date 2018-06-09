import R from 'ramda'

const getPropertyKey = (row, property) => {
  const value = typeof property === 'function' ? property(row) : property
  return value ? `${value}` : ''
}

export const getRowValue = (row, property) => {
  const key = getPropertyKey(row, property)
  let value
  if (typeof property === 'function') {
    value = row[key] || key
  } else if (typeof row[key] === 'function') {
    value = row[key](row)
  } else {
    value = row[key]
  }

  return value || ''
}

export const getRowLabels = (row, properties) => {
  return R.reduce(
    (acc, property) =>
      R.assoc(getPropertyKey(row, property), getRowValue(row, property), acc),
    {},
    properties
  )
}

export default {
  getRowLabels,
  getRowValue
}
