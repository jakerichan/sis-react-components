import PropTypes from 'prop-types'

export default PropTypes.shape({
  header: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  property: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  type: PropTypes.string,
  tooltipProperty: PropTypes.string,
  sortable: PropTypes.bool,
  sortAscending: PropTypes.bool
})
