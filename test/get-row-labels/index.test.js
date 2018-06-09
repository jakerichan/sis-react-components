/* eslint-env jest */
import * as R from 'ramda'
import { getRowLabels, getRowValue } from '~/helpers/get-row-labels'

describe('get-row-labels', () => {
  let row

  beforeEach(() => {
    row = {
      foo: 'bar',
      deeply: {
        nested: {
          value: 'deeply nested value',
          fn: R.always('deeply nested function')
        }
      },
      fn: R.always('function value')
    }
  })

  describe('getRowValue', () => {
    it('returns empty string', () => {
      expect(getRowValue(row, 'baz')).toBe('')
    })

    it('returns string property', () => {
      expect(getRowValue(row, 'foo')).toBe('bar')
    })

    it('returns function property', () => {
      expect(getRowValue(row, R.path(['deeply', 'nested', 'value']))).toBe(
        'deeply nested value'
      )
    })

    it('returns function value', () => {
      expect(getRowValue(row, 'fn')).toBe('function value')
    })
  })
  describe('getRowLabels', () => {
    const properties = ['foo', R.always('function property'), 'fn']
    let labels

    beforeEach(() => {
      labels = getRowLabels(row, properties)
    })

    it('returns object', () => {
      expect(labels).toBeInstanceOf(Object)
    })

    it('returns string property', () => {
      expect(labels.foo).toBe('bar')
    })

    it('returns function value to string key', () => {
      expect(labels.fn).toBe('function value')
    })

    it("uses key of property's returned value", () => {
      const key = properties[1](row)
      expect(labels[key]).toBe('function property')
    })
  })
})
