import { identity, pipe, when, prop as rProp, assoc, merge } from 'ramda'
import React, { Component } from 'react'
import classnames from 'classnames'
import {
  arrayOf,
  oneOfType,
  node,
  string,
  func,
  bool,
  array,
  object
} from 'prop-types'
import {
  Card,
  CardActions,
  CardText,
  DataTable,
  FontIcon,
  TableBody,
  TableCardHeader
} from '@kuali/kuali-ui'
import getClassname from '~/lib/get-classname'
import { assocUnlessPropMatchesState } from '~/lib/ramda-extensions'
import FilterRows from '~/hoc/filter-rows'
import SortRows from '~/hoc/sort-rows'
import composeComponent from '~/lib/compose-component'
import columnSchema from './column-schema'
import GraphqlDataTableMessageRow from './message-row'
import GraphqlDataTableRow from './row'
import GraphqlDataTableHeader from './header'
import './index.css'

const columnTypes = {
  EDITABLE_STRING: 'editable',
  ACTION: 'action'
}

const NOOP = () => { }

const defaultProps = {
  columns: [],
  emptyMessage: 'No results found',
  isExpanded: false,
  name: 'GraphqlDataTable',
  onExpanderClick: NOOP,
  onRowClick: NOOP,
  plain: false,
  tableProps: {},
  title: '',
  sortColumn: {},
  groupModifier: identity
}

const propTypes = {
  columns: arrayOf(columnSchema).isRequired,
  emptyMessage: oneOfType([node, string]),
  expanderTooltipLabel: string,
  expansion: node,
  getActionColumn: func,
  getEditableColumn: func,
  getStringColumn: func,
  isExpanded: bool,
  mutate: func,
  name: string.isRequired,
  onExpanderClick: func,
  onHeaderCheckboxClick: func,
  onRowClick: func,
  onSortChange: func,
  rows: array.isRequired,
  sortColumn: columnSchema,
  tableProps: object,
  tableActions: oneOfType([node, arrayOf(node)]),
  title: oneOfType([node, string])
}

class GraphqlDataTable extends Component {
  state = {
    isExpanded: this.props.isExpanded,
    rows: this.props.groupModifier(this.props.rows)
  }

  getClassname = getClassname.bind(this, ['GraphqlDataTable', this.props.className]);

  onExpanderClick = () => {
    const isExpanded = !this.state.isExpanded
    const { onExpanderClick } = this.props
    this.setState({ isExpanded })
    onExpanderClick(isExpanded)
  }

  componentWillReceiveProps (newProps = {}) {
    const updateStateWithProp = prop =>
      assocUnlessPropMatchesState(prop, newProps, this.state)
    pipe(
      updateStateWithProp('rows'),
      when(
        newState => rProp('rows', newState),
        assoc('rows', this.props.groupModifier(newProps.rows))
      ),
      updateStateWithProp('isExpanded'),
      newState => this.setState(newState)
    )({})
  }

  get cardHeader () {
    const { title, tableActions, expansion } = this.props
    if (!title && !tableActions && !expansion) return null
    return (
      <CardActions expander={!!expansion}>
        <TableCardHeader
          className={this.getClassname('card-header')}
          visible={false}
          title={title}
        >
          <div>
            {tableActions}
          </div>
        </TableCardHeader>
      </CardActions>
    )
  }

  get expansion () {
    const { expansion } = this.props
    const { isExpanded } = this.state
    if (!expansion) return null
    return (
      <CardText
        className={this.getClassname('expansion', {
          'is-open': isExpanded
        })}
        expandable
      >
        {expansion}
      </CardText>
    )
  }

  get mergedTableProps () {
    const { tableProps, plain, mutate } = this.props
    const { rows } = this.state
    const plainTableDefault = plain || !rows.length || !mutate
    return merge(tableProps, {
      plain:
        tableProps.plain === undefined ? plainTableDefault : tableProps.plain
    })
  }

  get shouldShowCheckboxInHeader () {
    const { onHeaderCheckboxClick } = this.props
    const { plain } = this.mergedTableProps
    return Boolean(onHeaderCheckboxClick) || plain
  }

  render () {
    const {
      // remove from restOfPropsForRow
      expansion,
      plain,
      rows: initialRows,
      tableProps,
      title,
      //
      cardProps,
      className,
      columns,
      emptyMessage,
      expanderTooltipLabel,
      groupModifier,
      isExpanded: propsIsExpanded,
      mutate,
      name,
      onHeaderCheckboxClick,
      onSortChange,
      onRowClick,
      sortColumn,
      tableActions,
      ...restOfPropsForRow
    } = this.props
    const { isExpanded, rows } = this.state
    return (
      <Card
        tableCard
        className={classnames('GraphqlDataTable', className)}
        expanded={isExpanded}
        expanderTooltipLabel={expanderTooltipLabel}
        expanderIcon={
          <FontIcon className={this.getClassname('card-expander-icon')}>
            add
          </FontIcon>
        }
        onExpanderClick={this.onExpanderClick}
        {...cardProps}
      >
        {this.cardHeader}
        {this.expansion}
        <DataTable baseId={`${name}-table`} {...this.mergedTableProps}>
          <GraphqlDataTableHeader
            columns={columns}
            getClassname={this.getClassname}
            name={name}
            sortColumn={sortColumn}
            onColumnClick={onSortChange}
            onCheckboxClick={onHeaderCheckboxClick}
            showCheckbox={this.shouldShowCheckboxInHeader}
          />
          <TableBody>
            {!rows.length
              ? <GraphqlDataTableMessageRow
                columnCount={columns.length}
                message={emptyMessage}
              />
              : rows.map((row, i) =>
                <GraphqlDataTableRow
                  COLUMN_TYPES={columnTypes}
                  getClassname={this.getClassname}
                  columns={columns}
                  onClick={onRowClick.bind(null, row)}
                  key={`${name}--row-${row.guid}-${i}`}
                  mutate={mutate}
                  name={`${name}--row-${row.guid}-${i}`}
                  data={row}
                  {...restOfPropsForRow}
                />
              )}
          </TableBody>
        </DataTable>
      </Card>
    )
  }
}

GraphqlDataTable.columnTypes = columnTypes

export default composeComponent('GraphqlDataTable', FilterRows, SortRows)(
  GraphqlDataTable,
  propTypes,
  defaultProps
)
