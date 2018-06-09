import React from 'react'
import PropTypes from 'prop-types'
import { Icon, ListItem } from '@kuali/kuali-ui'
import composeComponent from '~/lib/compose-component'

const propTypes = {
  className: PropTypes.string,
  primaryText: PropTypes.oneOfType([
    PropTypes.node.isRequired,
    PropTypes.string.isRequired
  ])
}

class FilterSelectorListIem extends React.PureComponent {
  get deleteIcon () {
    return <Icon name='delete' />
  }

  render () {
    const {
      className,
      mutate,
      isActive,
      primaryText: label,
      ...rest
    } = this.props

    return (
      <ListItem
        className={className}
        primaryText={label}
        active={isActive}
        leftIcon={mutate ? this.deleteIcon : null}
        {...rest}
      />
    )
  }
}

export default composeComponent('FilterSelectorListItem')(
  FilterSelectorListIem,
  propTypes
)
