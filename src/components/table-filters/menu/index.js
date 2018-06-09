import React from 'react'
import PropTypes from 'prop-types'
import { Divider, Menu, RaisedButton } from '@kuali/kuali-ui'
import composeComponent from '~/lib/compose-component'
import './index.css'

const propTypes = {
  filterItems: PropTypes.arrayOf(PropTypes.node)
}

class FilterSelector extends React.Component {
  constructor (props) {
    super(props)
    this.state = { isVisible: false }

    this.onToggleClick = this.onToggleClick.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.onItemClick = this.onItemClick.bind(this)
  }

  get header () {
    return (
      <div className='FilterSelector--header'>
        <h3 className='FilterSelector--header-title'>Saved Filters</h3>
        <p className='FilterSelector--header-copy'>
          Save filters as a reusable view on your data.
        </p>
      </div>
    )
  }

  get toggle () {
    return <RaisedButton onClick={this.onToggleClick} {...this.props} />
  }

  handleClose (evt) {
    this.setState({ isVisible: false })
  }

  onToggleClick () {
    this.setState({ isVisible: !this.state.isVisible })
  }

  onItemClick (item) {
    this.setState({ isVisible: false })
    console.log(item)
    if (this.props.onItemClick) this.props.onItemClick(item)
  }

  render () {
    const { isVisible } = this.state
    const { filterItems } = this.props
    return (
      <Menu
        id='filter-select-menu'
        sameWidth={false}
        visible={isVisible}
        onClose={this.handleClose}
        position={Menu.Positions.BELOW}
        className='FilterSelector--menu'
        toggle={this.toggle}
      >
        {this.header}

        <Divider />
        {filterItems}
      </Menu>
    )
  }
}

export default composeComponent('FilterSelector')(FilterSelector, propTypes)
