import R from 'ramda'
import { getRowValue } from '~/lib/get-row-labels'

export const getSortFunctionForProperty = (property, sortAscending = true) =>
  R[sortAscending ? 'ascend' : 'descend'](row => getRowValue(row, property))
export const getSortObjForProperty = (sortProperty, sortAscending = true) => [
  sortProperty,
  getSortFunctionForProperty(sortProperty, sortAscending)
]

export default {
  getSortFunctionForProperty,
  getSortObjForProperty
}
