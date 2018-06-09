// getClassname(['ComponentName', 'CustomClassName'], 'actions', {'active': true})
// -> 'ComponentName--actions-active CustomClassName--actions-active'
// Works best when you bind with prefixes specific to that component
// i.e. this.getClassname = getClassname.bind(this, [ componentName, props.className ])

import R from 'ramda'
import { renameKeys } from '~/lib/ramda-extensions'
import classnames from 'classnames'

export default (prefixes = [], tail = '', stateNames = {}) => {
  prefixes = R.uniq(R.reject(R.isEmpty)(prefixes))

  const stateClasses = R.reduce((acc, prefix) => {
    const elementName = R.join('--', R.reject(R.isEmpty, [prefix, tail]))
    const elementNameWithState = stateName =>
      R.join(tail ? '-' : '--', [elementName, stateName])
    const base = R.assoc(elementName, true, acc)
    return R.merge(base, renameKeys(elementNameWithState, stateNames))
  }, {})(prefixes)

  return classnames(stateClasses)
}
