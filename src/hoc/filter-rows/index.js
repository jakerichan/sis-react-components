import R from 'ramda'
import React from 'react'
import PropTypes from 'prop-types'
import hoistNonReactStatics from 'hoist-non-react-statics'
import Rx from '~/lib/ramda-extensions'
import TableFilters from '~/components/table-filters'
import fuzzyFilter from '~/lib/fuzzy-filter'
import highlightSearch from '~/lib/highlight-search'
import {
  Filter,
  Field
} from '@kuali/kuali-ui/lib/filter-editor/prop-types'

const NOOP = () => {}

const propTypes = {
  emptyMessageWithFilter: PropTypes.string,
  initialSearch: PropTypes.string,
  onApplyFilter: PropTypes.func,
  onSearch: PropTypes.func,
  selectedFilter: Filter,
  filterFields: PropTypes.arrayOf(Field)
}

const defaultProps = {
  emptyMessageWithFilter: 'No results found, try changing your filter rules',
  initialSearch: '',
  onApplyFilter: NOOP,
  onSearch: NOOP
}

const FilterRowsHOC = Component => {
  class FilterRows extends React.Component {
    state = {
      searchText: this.props.initialSearch,
      selectedFilter: this.props.selectedFilter
    }

    applyFilter = selectedFilter => {
      const { onApplyFilter } = this.props
      this.setState({ selectedFilter })
      onApplyFilter(selectedFilter)
    }

    onSearchChange = searchText => {
      const { onSearch } = this.props
      this.setState({ searchText })
      onSearch(searchText)
    }

    hasFilter = () => {
      const { selectedFilter } = this.state
      return selectedFilter && selectedFilter.rules.length
    }

    get rows () {
      const { columns, rows } = this.props
      const { searchText, selectedFilter = {} } = this.state
      const searchableProperties = R.pipe(
        R.filter(R.prop('searchable')),
        R.map(R.prop('property'))
      )(columns)

      return R.pipe(
        R.clone,
        R.filter(selectedFilter.fn ? selectedFilter.fn : R.always(true)),
        fuzzyFilter(searchText, searchableProperties),
        highlightSearch(searchText, searchableProperties)
      )(rows)
    }

    componentWillReceiveProps (newProps = {}) {
      const updateStateWithProp = prop =>
        Rx.assocUnlessPropMatchesState(prop, newProps, this.state)
      R.pipe(
        updateStateWithProp('initialSearch'),
        Rx.renameKeys({ initialSearch: 'searchText' }),
        updateStateWithProp('selectedFilter'),
        newState => this.setState(newState)
      )({})
    }

    render () {
      const { selectedFilter, searchText } = this.state
      const {
        rows,
        filterFields,
        emptyMessage,
        emptyMessageWithFilter,
        ...rest
      } = this.props
      const renderedRows = this.rows

      return (
        <React.Fragment>
          {filterFields ? (
            <TableFilters
              searchValue={searchText}
              fields={filterFields}
              onFilterChanged={this.applyFilter}
              selectedFilter={selectedFilter}
              onSearch={this.onSearchChange}
            />
          ) : null}
          <Component
            emptyMessage={
              this.hasFilter() ? emptyMessageWithFilter : emptyMessage
            }
            rows={renderedRows}
            {...rest}
          />
        </React.Fragment>
      )
    }
  }

  FilterRows.propTypes = propTypes
  FilterRows.defaultProps = defaultProps

  const oneOfPropsOr = (fallback, props, subject) => {
    return R.propOr(
      fallback,
      R.find(prop => {
        return Boolean(R.prop(prop, subject))
      }, props),
      subject
    )
  }

  FilterRows.displayName = `FilterRows_${oneOfPropsOr(
    'Component',
    ['displayName', 'name'],
    Component
  )}`
  hoistNonReactStatics(FilterRows, Component)
  return FilterRows
}

export default FilterRowsHOC
