/* eslint-env jest */

import * as R from 'ramda'
import { propOrLazy } from '~/helpers/ramda-extensions'

// caseDefiner :: (a -> void) -> a -> Number -> void
//
// caseDefiner takes an assert function, a testCase, and an index number and definess a new
// tests case (using `it`) which will pass the given testCase to the assert function during the
// test run.
//
// This is a shorthand way of defining tests when the test assertion itself is always the same but
// you want to feed in a number of test cases (of any shape). This is best used implicitly in
// conjunction with `runTestCases` which is defined below.
//
// For example:
//
//    const add = (x, y) => x + y
//
//    runTestCases(
//      ([args, expected]) => expect(add(...args)).toEqual(expected),
//      [
//        [[1, 2], 3],
//        [[1, 3], 4],
//        [[1, 4], 5],
//        [[1, 5], 6]
//      ]
//    )
//
export const caseDefiner = (assertFn, testCase, index) => {
  const description = propOrLazy(
    'description',
    () => `case: ${JSON.stringify(testCase)}`,
    testCase
  )

  it(description, () => {
    assertFn(testCase)
  })
}

// runTestCases :: (* -> void) -> [*] -> void
//
// Binds the assert function to R.forEach (which will be invoked with the data and the index).
//
// For example:
//
//    const add = (x, y) => x + y
//
//    runTestCases(
//      ([args, expected]) => expect(add(...args)).toEqual(expected),
//      [
//        [[1, 2], 3],
//        [[1, 3], 4],
//        [[1, 4], 5],
//        [[1, 5], 6]
//      ]
//    )
//
export const runTestCases = (assertFn, testCases) =>
  R.addIndex(R.forEach)(R.curry(caseDefiner)(assertFn), testCases)

export default {
  caseDefiner,
  runTestCases
}
