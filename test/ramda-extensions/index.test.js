/* eslint-env jest */

import * as R from 'ramda'
import * as Rx from '../../src/lib/ramda-extensions'
import { runTestCases } from '../helpers/define-cases'

describe('/app/lib/ramda-extensions', () => {
  describe('assocIf', () => {
    runTestCases(
      ([predicate, propName, value, obj, expected]) => {
        expect(Rx.assocIf(predicate, propName, value, obj)).toEqual(expected)
      },
      [
        [R.T, 'foo', 123, {}, { foo: 123 }],
        [R.T, 'foo', 123, { bar: 'baz' }, { foo: 123, bar: 'baz' }],
        [R.F, 'foo', 123, { bar: 'baz' }, { bar: 'baz' }],
        [R.always(null), 'foo', 123, { bar: 'baz' }, { bar: 'baz' }],
        [R.always(6), 'foo', 123, { bar: 'baz' }, { foo: 123, bar: 'baz' }]
      ]
    )
  })

  describe('assocIfValue', () => {
    runTestCases(
      ([predicate, propName, value, obj, expected]) => {
        expect(Rx.assocIfValue(predicate, propName, value, obj)).toEqual(
          expected
        )
      },
      [
        [R.equals(123), 'foo', 123, {}, { foo: 123 }],
        [R.equals(123), 'foo', 123, { bar: 'baz' }, { foo: 123, bar: 'baz' }],
        [R.equals(321), 'foo', 123, { bar: 'baz' }, { bar: 'baz' }],
        [R.always(null), 'foo', 123, { bar: 'baz' }, { bar: 'baz' }],
        [R.always(6), 'foo', 123, { bar: 'baz' }, { foo: 123, bar: 'baz' }]
      ]
    )
  })

  describe('assocIfValuePresent', () => {
    runTestCases(
      ([propName, value, obj, expected]) => {
        expect(Rx.assocIfValuePresent(propName, value, obj)).toEqual(expected)
      },
      [
        ['foo', 123, {}, { foo: 123 }],
        ['foo', 'bar', {}, { foo: 'bar' }],
        ['foo', 123, {}, { foo: 123 }],
        ['foo', null, {}, {}],
        ['foo', null, { bar: 'baz' }, { bar: 'baz' }],
        ['foo', undefined, {}, {}],
        ['foo', undefined, { bar: 'baz' }, { bar: 'baz' }]
      ]
    )
  })

  describe('isPresent', () => {
    runTestCases(
      ([value, expected]) => {
        expect(Rx.isPresent(value)).toEqual(expected)
      },
      [
        [null, false],
        [undefined, false],
        ['', true],
        [' foo ', true],
        [{}, true],
        [{ foo: 'bar' }, true],
        [[], true],
        [[1, 2, 3], true]
      ]
    )
  })

  describe('mergeIfPresent', () => {
    runTestCases(
      ([left, right, expected]) => {
        expect(Rx.mergeIfPresent(left, right)).toEqual(expected)
      },
      [
        [{ foo: 'bar' }, null, { foo: 'bar' }],
        [{ foo: 'bar' }, undefined, { foo: 'bar' }],
        [{ foo: 'bar' }, { cat: 'meow' }, { foo: 'bar', cat: 'meow' }],
        [
          { foo: 'bar', cat: 'meow' },
          { foo: 'hello' },
          { foo: 'hello', cat: 'meow' }
        ]
      ]
    )
  })

  describe('propOrLazy', () => {
    runTestCases(
      ([prop, thunk, target, expected]) => {
        expect(Rx.propOrLazy(prop, thunk, target)).toEqual(expected)
      },
      [
        ['foo', () => 'expensive computation', { foo: 'bar' }, 'bar'],
        ['foo', () => 'expensive computation', {}, 'expensive computation']
      ]
    )
  })

  describe('tapLog', () => {
    it('appends arguments with a prepended tag to the given logger function', () => {
      const data = []
      const logger = (...args) => data.push(args)
      const { tapLog } = Rx

      R.pipe(
        tapLog('before', logger),
        R.map(x => x * x),
        tapLog('squared', logger),
        R.filter(x => x % 2 !== 0),
        tapLog('only odds', logger)
      )([1, 2, 3])

      expect(data).toEqual([
        ['-----', 'before', [1, 2, 3]],
        ['-----', 'squared', [1, 4, 9]],
        ['-----', 'only odds', [1, 9]]
      ])
      tapLog('make cov happy')('be happy')
    })
  })

  describe('renameKeys', () => {
    it('Creates a new object with the own properties of the provided object', () => {
      expect(
        Rx.renameKeys(
          {
            foo: 'boo',
            bar: 'baz'
          },
          { foo: 'fooValue', bar: 'barValue' }
        )
      ).toEqual({ boo: 'fooValue', baz: 'barValue' })
    })
    it("skips keys that don't exist", () => {
      expect(
        Rx.renameKeys(
          {
            foo: 'boo',
            bar: 'baz'
          },
          { foo: 'fooValue' }
        )
      ).toEqual({ boo: 'fooValue' })
    })
  })
})
