import R from 'ramda'
import React from 'react'
import classnames from 'classnames'
import { TableColumn } from '@kuali/kuali-ui'
import GraphqlDataTableEditColumn from '../edit-column'
import { getRowValue } from '~/lib/get-row-labels'

export default ({ mutate, name }) => {
  const getStringColumn = (row, column, i, getClassname) => {
    const { property, props: columnProps } = column
    const label = getRowValue(row, property)
    return (
      <TableColumn
        key={`${name}--column-${i}`}
        className={getClassname('column')}
        {...columnProps}
      >
        {label}
      </TableColumn>
    )
  }

  const getEditableColumn = (row, column, i, getClassname) => {
    const { property, tooltipProperty, props: columnProps = {} } = column
    const label = getRowValue(row, property)
    const tooltipLabel = row[tooltipProperty]
    const tooltip = (
      <span className={getClassname('column-tooltip')}>
        Original: {tooltipLabel}
      </span>
    )
    const shouldShowTooltip = label && tooltipProperty && label !== tooltipLabel
    return (
      <GraphqlDataTableEditColumn
        className={getClassname('column')}
        defaultValue={label || tooltipLabel}
        guid={row.guid}
        key={`${name}--column-${i}`}
        mutate={mutate}
        property={property}
        tooltipLabel={shouldShowTooltip ? tooltip : null}
        tooltipPosition='top'
        {...columnProps}
      />
    )
  }

  const getActionColumn = (row, column, i, getClassname) => {
    const { actions, props: columnProps = {} } = column
    const getActionComponent = (
      { component: ActionComponent, rowProp },
      actionIndex
    ) =>
      React.cloneElement(ActionComponent, {
        [rowProp]: row,
        key: `${name}-column-action-${i}-${actionIndex}`
      })
    return (
      <TableColumn
        className={classnames(getClassname('column-actions'), 'md-text-center')}
        key={`${name}-column-${i}`}
        {...columnProps}
      >
        {R.addIndex(R.map)(getActionComponent, actions)}
      </TableColumn>
    )
  }

  return {
    getStringColumn,
    getEditableColumn,
    getActionColumn
  }
}
