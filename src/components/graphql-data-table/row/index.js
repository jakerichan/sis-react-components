import * as R from 'ramda'
import React from 'react'
import PropTypes from 'prop-types'
import debounce from 'debounce'
import { TableRow } from '@kuali/kuali-ui'
import composeComponent from '~/helpers/compose-component'
import getColumnFunctions from './get-column-functions'

const pascalCase = name => name.charAt(0).toUpperCase() + name.substr(1)

const propTypes = {
  data: PropTypes.object,
  getActionColumn: PropTypes.func,
  getEditableColumn: PropTypes.func,
  getStringColumn: PropTypes.func,
  mutate: PropTypes.func,
  name: PropTypes.string,
  onClick: PropTypes.func
}

class GraphqlDataTableRow extends React.PureComponent {
  getClassname = this.props.getClassname

  onKeyUp = ({ key }) => {
    const { onClick, data } = this.props
    if (!onClick) return
    if (key === 'Enter' || key === ' ') {
      onClick(data)
    }
  }

  onRowCheckboxClick = debounce((rowIndex, checked) => {
    const { mutate, data } = this.props
    const { guid } = data

    mutate({
      variables: {
        query: { guid },
        update: { isActive: checked }
      }
    })
  }, 200)

  getColumnFunction = type => {
    const { mutate, name, COLUMN_TYPES, ...props } = this.props
    const {
      getActionColumn,
      getEditableColumn,
      getStringColumn
    } = getColumnFunctions({
      mutate,
      name: R.pathOr(name, ['data', 'guid'], this.props)
    })
    const customFunctionName = type ? `get${pascalCase(type)}Column` : ''

    if (customFunctionName && props[customFunctionName]) {
      return props[customFunctionName]
    } else if (type === COLUMN_TYPES.EDITABLE_STRING && mutate) {
      return getEditableColumn
    } else if (type === COLUMN_TYPES.ACTION) {
      return getActionColumn
    }

    return getStringColumn
  }

  renderColumn = (column, i) => {
    const { data, COLUMN_TYPES } = this.props
    let { type } = column
    if (column.actions && !type) type = COLUMN_TYPES.ACTION
    const renderColumnFunction = this.getColumnFunction(type)
    return renderColumnFunction(data, column, i, this.getClassname)
  }

  render () {
    const { onClick, columns, data } = this.props
    const { isActive } = data
    const isClickable = Boolean(onClick)
    return (
      <TableRow
        selected={isActive}
        onClick={onClick}
        role={isClickable ? 'link' : 'row'}
        onCheckboxClick={this.onRowCheckboxClick}
        tabIndex={0}
        onKeyUp={this.onKeyUp}
        className={this.getClassname('row', {
          clickable: isClickable
        })}
      >
        {R.addIndex(R.map)(this.renderColumn, columns)}
      </TableRow>
    )
  }
}

export default composeComponent('GraphqlDataTableRow')(
  GraphqlDataTableRow,
  propTypes
)
