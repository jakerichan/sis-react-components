import R from 'ramda'
import React from 'react'
import PropTypes from 'prop-types'
import { TableHeader, TableRow, TableColumn } from '@kuali/kuali-ui'
import composeComponent from '~/lib/compose-component'
import columnSchema from '../column-schema'

const propTypes = {
  checkboxIsActive: PropTypes.bool,
  columns: PropTypes.arrayOf(columnSchema),
  getClassname: PropTypes.func,
  onCheckboxClick: PropTypes.func,
  onColumnClick: PropTypes.func,
  showCheckbox: PropTypes.bool,
  sortColumn: PropTypes.object
}

const defaultProps = {
  onColumnClick: () => {}
}

const getSortDirection = (column, property) => {
  const isAscending = R.propOr(undefined, 'sortAscending', column)
  const sortProperty = R.propOr('', 'property', column)
  const sortName = R.propOr(sortProperty, 'name', column)
  return sortName && sortName === property ? isAscending : undefined
}

const GraphqlDataTableHeader = ({
  checkboxIsActive,
  columns,
  getClassname,
  name,
  onCheckboxClick,
  onColumnClick,
  showCheckbox,
  sortColumn
}) => {
  const getColumn = (column, i) => {
    const { header, sortable, property, grow, props, name } = column
    return (
      <TableColumn
        className={getClassname('header', {
          clickable: sortable
        })}
        grow={grow}
        key={`${name}--header-${i}`}
        onClick={onColumnClick.bind(this, column)}
        sorted={getSortDirection(sortColumn, R.or(name, property))}
        {...props}
      >
        {header}
      </TableColumn>
    )
  }

  return (
    <TableHeader>
      <TableRow
        className={getClassname('row')}
        onCheckboxClick={onCheckboxClick}
        selectable={!!onCheckboxClick}
        selected={checkboxIsActive}
      >
        {R.prepend(
          showCheckbox ? null : (
            <TableColumn key={`${name}--header-checkbox`} />
          ),
          R.addIndex(R.map)(getColumn, columns)
        )}
      </TableRow>
    </TableHeader>
  )
}

export default composeComponent('GraphqlDataTableHeader')(
  GraphqlDataTableHeader,
  propTypes,
  defaultProps
)
