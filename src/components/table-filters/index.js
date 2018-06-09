import React from 'react'
import * as R from 'ramda'
import PropTypes from 'prop-types'
import AnimateHeight from 'react-animate-height'
import { RaisedButton, Icon, FilterEditor } from '@kuali/kuali-ui'
import Rx from '~/helpers/ramda-extensions'
import composeComponent from '~/helpers/compose-component'
import getClassname from '~/helpers/get-classname'
import TableFiltersMenu from './menu'
import TableFiltersMenuListIem from './menu-list-item'
import TableFiltersSearchInput from './search-input'
import './index.css'

class TableFilters extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      searchValue: props.searchValue,
      isVisible: !!props.selectedFilter,
      selectedFilter: props.selectedFilter
    }

    this.getClassname = getClassname.bind(this, ['TableFilters', props.name])
  }

  static defaultProps = {
    savedFilters: [],
    name: ''
  }

  static propTypes = {
    savedFilters: PropTypes.array,
    name: PropTypes.string,
    onFilterChanged: PropTypes.func,
    onFilterSelected: PropTypes.func,
    onSearch: PropTypes.func,
    selectedFilter: PropTypes.object
  }

  componentWillReceiveProps (newProps) {
    R.pipe(
      Rx.assocUnlessPropMatchesState('selectedFilter', newProps, this.state),
      Rx.assocUnlessPropMatchesState('searchValue', newProps, this.state),
      newState => this.setState(newState)
    )({})
  }

  getFilterByGuid = filterGuid => {
    const { filters } = this.props
    return filters.find(({ guid }) => filterGuid === guid)
  }

  onToggleEditorClick = () => {
    this.setState({
      isVisible: !this.state.isVisible
    })
  }

  onCloseEditorClick = () => {
    this.setState({
      isVisible: false
    })
  }

  onSearchInputChange = searchValue => {
    const { onSearch } = this.props
    this.setState({ searchValue })
    if (onSearch) onSearch(searchValue)
  }

  render () {
    const { isVisible, selectedFilter, searchValue } = this.state
    const {
      onFilterChanged,
      onFilterSelected,
      fields,
      savedFilters
    } = this.props

    const variant = isVisible ? 'success' : 'default'
    return (
      <div className={this.getClassname()}>
        <section className={this.getClassname('header')}>
          <TableFiltersSearchInput
            value={searchValue}
            onChange={this.onSearchInputChange}
          />
          <RaisedButton onClick={this.onToggleEditorClick} variant={variant}>
            <Icon name='filter_list' />
          </RaisedButton>
          {savedFilters.length ? (
            <TableFiltersMenu
              className={this.getClassname('apply-filter-button')}
              label='Apply Filter'
              iconBefore={false}
              filterItems={R.map(
                ({ guid, name }) => (
                  <TableFiltersMenuListIem
                    onClick={onFilterSelected.bind(this, guid)}
                    primaryText={name}
                  />
                ),
                savedFilters
              )}
            >
              <Icon name='arrow_drop_down' />
            </TableFiltersMenu>
          ) : null}
        </section>
        <AnimateHeight
          contentClassName={this.getClassname('rules')}
          height={isVisible ? 'auto' : 0}
        >
          <FilterEditor
            fields={fields}
            filter={selectedFilter}
            onClose={this.onCloseEditorClick}
            onFilterChanged={onFilterChanged}
          />
        </AnimateHeight>
      </div>
    )
  }
}

export default composeComponent('TableFilters')(TableFilters)
