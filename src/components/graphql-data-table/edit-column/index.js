import debounce from 'debounce'
import React from 'react'
import { EditDialogColumn } from '@kuali/kuali-ui'

class DataTableEditColumn extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      value: props.defaultValue
    }
    this.persist = debounce(this.persist.bind(this), 250)
  }

  persist (value) {
    const { mutate, guid, property } = this.props
    mutate({
      variables: {
        query: { guid },
        update: { [property]: value }
      }
    })
  }

  handleChange (value) {
    this.setState({ value })
    this.persist(value)
  }

  render () {
    const { guid, mutate, ...props } = this.props
    const { value } = this.state
    return (
      <EditDialogColumn
        onChange={this.handleChange.bind(this)}
        textFieldStyle={{ width: '100%' }}
        value={value}
        {...props}
      />
    )
  }
}

export default DataTableEditColumn
