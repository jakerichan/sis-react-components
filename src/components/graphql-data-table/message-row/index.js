import React from 'react'
import { TableRow, TableColumn } from '@kuali/kuali-ui'
import composeComponent from '~/helpers/compose-component'

const GraphqlDataTableEmpty = ({ message, columnCount }) => (
  <TableRow>
    <TableColumn
      colSpan={columnCount}
      style={{ textAlign: 'center', fontStyle: 'italic' }}
    >
      {message}
    </TableColumn>
  </TableRow>
)

export default composeComponent('GraphqlDataTableEmpty')(
  GraphqlDataTableEmpty
)
