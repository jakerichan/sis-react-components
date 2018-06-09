import R from 'ramda'

// isPresent :: a -> Bool
//
// Given an argument, it returns if that argument is not nil (true) or nil (false).
//
// > isPresent(null)
// false
//
// > isPresent(undefined)
// false
//
// > isPresent({})
// true
//
// > isPresent({foo: 'bar'})
// true
//
// > isPresent([])
// true
//
// > isPresent([1, 2, 3])
// true
//
export const isPresent = R.complement(R.isNil)

// assocIf :: ({k: a} -> Boolean) -> String -> a -> {k: a}
//
// Sets the object's specified property to the given value if the predicate is satisfied.
export const assocIf = R.curry((predicate, propName, value, obj) =>
  R.when(predicate, R.assoc(propName, value))(obj)
)

// assocIfValue :: (a -> Boolean) -> String -> a -> {k: a}
//
// Sets the object's specified property to the given value if the predicate is satisfied. The
// predicate is passed the given value.
export const assocIfValue = R.curry((predicate, propName, value, obj) =>
  assocIf(R.always(predicate(value)), propName, value, obj)
)

// assocIfValuePresent :: String -> a -> {k: a}
//
// Sets the object's specified property to the given value if the value is not nil (see R.isNil).
export const assocIfValuePresent = assocIfValue(isPresent)

// Associates a new prop value to newState if the value is not equal to what's in oldState
export const assocUnlessPropMatchesState = R.curry(
  (key, newProps, oldState, newState) =>
    R.unless(
      R.always(R.propEq(key, R.prop(key, newProps), oldState)),
      R.assoc(key, R.prop(key, newProps)),
      newState
    )
)

// mergeIfPresent Object a :: a -> Maybe a -> a
//
// Given an object and a possibly nil object, merge the second onto the first only if it's not nil.
//
// > mergeIfPresent({foo: 'bar'}, null)
// {foo: 'bar'}
//
// > mergeIfPresent({foo: 'bar'}, undefined)
// {foo: 'bar'}
//
// > mergeIfPresent({foo: 'bar'}, {cat: 'meow'})
// {foo: 'bar', cat: 'meow'}
//
// > mergeIfPresent({foo: 'bar', cat: 'meow'}, {foo: 'hello'})
// {foo: 'hello', cat: 'meow'}
//
export const mergeIfPresent = R.curry((base, other) =>
  R.merge(base, R.defaultTo({}, other))
)

// propOrLazy :: String -> (*) -> Object
//
// Takes a property to return (if present) and a thunk to evaluate if not. If the target object
// has the property it is returned. If the target object does not have the property then the thunk
// is invoked and it's return value is returned instead.
//
// > propOrLazy('foo', () => 'expensive computation', { foo: 'bar' })
// 'bar'
//
// > propOrLazy('foo', () => 'expensive computation', {})
// 'expensive computation'
//
export const propOrLazy = R.curry((prop, defaultThunk, target) =>
  R.either(R.prop(prop), defaultThunk)(target)
)

// tapLog :: String -> * | [*] -> * | [*]
//
// tapLog fulfills a common use-case which is the desire to log out data flowing through a pipe at
// a specific point in the pipeline with a specific tag value. tapLog taps into an R.pipe or
// R.compose to log out the given data at that stage of the pipe/composition.
//
// See R.tap documentation for more information.
//
// For example:
//
//   R.pipe(
//     tapLog('before'),    // logs -----\nbefore:\n[1, 2, 3]
//     R.map((x) => x * x),
//     tapLog('mapped'),    // logs -----\nmapped:\n[1, 4, 9]
//     R.filter(isOdd),
//     tapLog('filtered'),  // logs -----\nfiltered:\n[1, 9]
//   )([1, 2, 3])
//
// The preceding pipe would perform three map transformations over myData, logging the transformed
// data after each map.
//
export const tapLog = R.curryN(1, (tag, logger = R.bind(console.log, console)) =>
  R.tap((...data) => R.call(logger, '-----', tag, ...data))
)

/**
 * Creates a new object with the own properties of the provided object, but the
 * keys renamed according to the keysMap object as `{oldKey: newKey}`.
 * When some key is not found in the keysMap, then it's passed as-is.
 *
 * Keep in mind that in the case of keys conflict is behaviour undefined and
 * the result may vary between various JS engines!
 *
 * @sig {a: b} -> {a: *} -> {b: *}
 */
export const renameKeys = R.curry((keysMap, obj) => {
  const getKey = key => {
    return R.equals(R.type(keysMap), 'Function')
      ? keysMap(key)
      : R.propOr(key, key, keysMap)
  }

  return R.reduce(
    (acc, key) => R.assoc(getKey(key), R.prop(key, obj), acc),
    {},
    R.keys(obj)
  )
})
export default {
  assocIf,
  assocIfValue,
  assocIfValuePresent,
  assocUnlessPropMatchesState,
  isPresent,
  mergeIfPresent,
  propOrLazy,
  renameKeys,
  tapLog
}
