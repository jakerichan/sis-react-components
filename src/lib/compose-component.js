import R from 'ramda'

export default (name, ...queries) => {
  return (component, propTypes = {}, defaultProps = {}) => {
    component.displayName = name
    component.propTypes = Object.assign({}, component.propTypes, propTypes)
    component.defaultProps = Object.assign(
      {},
      component.defaultProps,
      defaultProps
    )
    const trimmed = R.reject(R.isNil)(queries)
    return R.compose(...trimmed)(component)
  }
}
