import * as R from 'ramda'
import React from 'react'
import PropTypes from 'prop-types'
import hoistNonReactStatics from 'hoist-non-react-statics'
import { getSortFunctionForProperty } from './helpers'

const validateSortWithArray = (
  propValue,
  key,
  componentName,
  location,
  propFullName
) => {
  const [name, func] = propValue[key]
  if (typeof name === 'string' && typeof func === 'function') return
  return new Error(
    `Invalid prop '${propFullName}' supplied to '${componentName}'. Validation failed.`
  )
}

const propTypes = {
  onSortChange: PropTypes.func,
  sortWith: PropTypes.arrayOf(validateSortWithArray)
}

const SortRowsHOC = Component => {
  class SortRows extends React.Component {
    state = {
      sortColumn: R.or(R.find(R.has('sortAscending'))(this.props.columns), {})
    }

    onSortChange = columnClicked => {
      const { onSortChange } = this.props
      const { property, name } = columnClicked
      const {
        property: currentSortProperty,
        name: currentSortName,
        sortAscending: currentSortAscending
      } = this.state.sortColumn
      const clickedName = R.or(name, property)
      const sortedName = R.or(currentSortName, currentSortProperty)
      const isAscending = R.equals(clickedName, sortedName)
        ? !currentSortAscending
        : true
      this.setState({
        sortColumn: R.assoc('sortAscending', isAscending, columnClicked)
      })
      if (onSortChange) onSortChange(columnClicked)
    }

    get rows () {
      const { rows, sortWith = [] } = this.props
      const {
        sortColumn: { property, sortAscending }
      } = this.state
      const sortMap = new Map(sortWith)
      if (!property && !sortMap.size) return rows
      const sortStack = R.prepend(
        getSortFunctionForProperty(property, sortAscending),
        Array.from(sortMap.values())
      )
      return R.sortWith(sortStack)(rows)
    }

    render () {
      const { sortColumn } = this.state
      const { rows, ...rest } = this.props

      return (
        <Component
          sortColumn={sortColumn}
          onSortChange={this.onSortChange}
          rows={this.rows}
          {...rest}
        />
      )
    }
  }

  SortRows.propTypes = propTypes

  const oneOfPropsOr = (fallback, props, subject) => {
    return R.propOr(
      fallback,
      R.find(prop => {
        return Boolean(R.prop(prop, subject))
      }, props),
      subject
    )
  }

  SortRows.displayName = `SortRows_${oneOfPropsOr(
    'Component',
    ['displayName', 'name'],
    Component
  )}`
  hoistNonReactStatics(SortRows, Component)
  return SortRows
}

export default SortRowsHOC
