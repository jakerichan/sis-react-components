import React from 'react'
import PropTypes from 'prop-types'
import composeComponent from '~/helpers/compose-component'
import getClassname from '~/helpers/get-classname'
import { RaisedButton, TextField } from '@kuali/kuali-ui'
import './index.css'

const propTypes = {
  name: PropTypes.string,
  onChange: PropTypes.func
}
const defaultProps = {
  name: 'TableFiltersSearchInput'
}

class TableFiltersSearchInput extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      isVisible: false,
      value: props.value
    }
    this.getClassname = getClassname.bind(this, [
      'TableFiltersSearchInput',
      props.className
    ])
  }

  get inputName () {
    const { name } = this.props
    return `${name}-input`
  }

  onTextFieldKeyDown = ({ key, target }) => {
    if (!this.state.value && key === 'Escape') this.toggleVisible()
  }

  onTextFieldChange = value => {
    const { onChange } = this.props
    if (onChange) onChange(value)
    this.setState({ value })
  }

  toggleVisible = () => {
    const isVisible = !this.state.isVisible
    if (isVisible) {
      const inputEl = document.getElementById(this.inputName)
      inputEl.focus()
    }
    this.setState({
      isVisible
    })
  }

  componentWillReceiveProps ({ value }) {
    if (value !== this.props.value) {
      this.setState({
        value,
        isVisible: !!value || this.state.isVisible
      })
    }
  }

  render () {
    const { isVisible, value } = this.state
    const { defaultValue } = this.props
    return (
      <div className={this.getClassname('', { 'is-visible': isVisible })}>
        <RaisedButton
          className={this.getClassname('toggle')}
          variant={value ? 'success' : 'default'}
          onClick={this.toggleVisible}
        >
          {isVisible ? 'close' : 'search'}
        </RaisedButton>
        <TextField
          className={this.getClassname('input')}
          id={this.inputName}
          ref={el => (this.inputEl = el)}
          value={value}
          defaultValue={defaultValue}
          placeholder='Search'
          type='search'
          onChange={this.onTextFieldChange}
          onKeyDown={this.onTextFieldKeyDown}
        />
      </div>
    )
  }
}

export default composeComponent('TableFiltersSearchInput')(
  TableFiltersSearchInput,
  propTypes,
  defaultProps
)
