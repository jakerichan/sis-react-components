/* eslint-env jest */
import getClassname from '~/helpers/get-classname'

describe('getClassname', () => {
  it('returns string', () => {
    expect(getClassname(['root'])).toBe('root')
  })

  it('separates earch prefix by a space', () => {
    expect(getClassname(['root', 'foo'])).toBe('root foo')
  })

  it('filters prefixes to be unique', () => {
    expect(getClassname(['root', 'root'])).toBe('root')
    expect(getClassname(['root', 'root'], 'foo')).toBe('root--foo')
  })

  describe('tail', () => {
    it('separates by two dashes', () => {
      expect(getClassname(['root'], 'foo')).toBe('root--foo')
    })

    it('appends to each prefix', () => {
      const multiPrefix = getClassname(['root', 'second'], 'foo')
      expect(multiPrefix).toEqual(expect.stringContaining('root--foo'))
      expect(multiPrefix).toEqual(expect.stringContaining('second--foo'))
    })
  })

  describe('state', () => {
    it('appends truthy state keys', () => {
      const withState = getClassname(['root'], '', { 'is-loading': true })
      expect(withState).toEqual(expect.stringContaining('root--is-loading'))
      expect(withState).toEqual(expect.stringContaining('root'))
    })

    it('ignores falsey state keys', () => {
      const withState = getClassname(['root'], '', { 'is-loading': false })
      expect(withState).not.toEqual(expect.stringContaining('root--is-loading'))
      expect(withState).toBe('root')
    })

    it('applies to each prefix', () => {
      const withState = getClassname(['root', 'foo'], '', {
        'is-loading': true
      })
      expect(withState).toEqual(expect.stringContaining('root--is-loading'))
      expect(withState).toEqual(expect.stringContaining('root'))
      expect(withState).toEqual(expect.stringContaining('foo--is-loading'))
      expect(withState).toEqual(expect.stringContaining('foo'))
    })

    it('applies to each prefix with a tail', () => {
      const withState = getClassname(['root', 'foo'], 'element', {
        'is-loading': true
      })
      expect(withState).toEqual(expect.stringContaining('root--element'))
      expect(withState).toEqual(
        expect.stringContaining('root--element-is-loading')
      )
      expect(withState).toEqual(expect.stringContaining('foo--element'))
      expect(withState).toEqual(
        expect.stringContaining('foo--element-is-loading')
      )
    })
  })
})
