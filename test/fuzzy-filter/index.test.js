/* eslint-env jest */
import R from 'ramda'
import fuzzyFilter from '../../src/lib/fuzzy-filter'

const searchableProperties = ['label', 'type']

describe('fuzzy filter function', () => {
  describe('empty search string returns', () => {
    var getRows = () => [
      {
        label:
          "I'll copy the neural IB matrix, that should transmitter the AI driver!",
        nosearch: 'calculating',
        type: 'virtual'
      },
      {
        label:
          "Synthesizing the feed won't do anything, we need to navigate the back-end SMS interface!",
        nosearch: 'transmitting',
        type: 'reboot'
      }
    ]
    const fuzzy = fuzzyFilter('', searchableProperties)

    it('a function', () => {
      expect(fuzzy).toBeInstanceOf(Function)
    })

    it('all items in list', () => {
      const rows = getRows()
      expect(fuzzy(rows)).toHaveLength(2)
    })

    it('original strings', () => {
      const rows = getRows()
      fuzzy(rows).forEach((row, i) => {
        expect(row).toMatchObject(rows[i])
      })
    })
  })

  describe('filter', () => {
    const getRows = () => [
      {
        label: 'Mollis Purus Tellus',
        nosearch: 'no tags in here',
        type: 'consequuntur'
      },
      {
        label: 'Tristique Malesuada Vehicula',
        nosearch: 'no tags in here',
        type: 'Dolores'
      },
      {
        label: 'Tristique Malesuada Vulputate',
        nosearch: 'no tags in here',
        type: 'Dolores'
      },
      {
        label: 'Nibh Sit Mattis',
        nosearch: 'no tags in here',
        type: 'Ultriciesquia'
      },
      {
        label: 'Consectetur Magna Justo',
        nosearch: 'no tags in here',
        type: 'Ultriciesquos'
      },
      {
        label: 'Lorem Pellentesque Aenean',
        nosearch: 'no tags in here',
        type: 'Ultriciesid'
      }
    ]

    it('ignores unsearchable columns', () => {
      const fuzzyNoResults = fuzzyFilter('no tags', searchableProperties)
      const alteredNoResults = fuzzyNoResults(getRows())
      expect(alteredNoResults).toHaveLength(0)
    })

    it('includes from any searchable column', () => {
      const rows = getRows()
      // index 1 - 3 from label, and 4 - 5 from type
      const fuzzy = fuzzyFilter('Tris', searchableProperties)
      const altered = fuzzy(rows)
      expect(altered).toHaveLength(5)
    })

    it('is fuzzy', () => {
      const rows = getRows()
      const fuzzy = fuzzyFilter('istsuaput', searchableProperties)
      expect(fuzzy(rows)).toHaveLength(1)
    })

    describe('handles special characters', () => {
      const getRowsWithSpecialCharacters = () => [
        {
          label: 'Tue Mar 13 2018 08:16:43 GMT-0600 (MDT)',
          type: 'colons-parens-dash'
        },
        {
          label: 'O\'Crowly "Mac" Donald',
          type: 'quotes'
        },
        {
          label: '!?/@#\\$%^<>&*()=+',
          type: 'whatthecuss'
        },
        {
          label: '123456',
          type: 'number'
        },
        {
          label: R.propOr('foobar', 'foo'),
          type: 'function'
        },
        {
          deeply: { nested: { label: 'deeply nested label' } },
          type: 'deepnest'
        }
      ]

      it('like colons, parens, and dashes', () => {
        const fuzzy = fuzzyFilter(':-()', searchableProperties)
        const rows = fuzzy(getRowsWithSpecialCharacters())
        expect(rows).toHaveLength(1)
        expect(rows[0].label).toBe('Tue Mar 13 2018 08:16:43 GMT-0600 (MDT)')
      })

      it('like quotes', () => {
        const fuzzy = fuzzyFilter(`'"`, searchableProperties)
        const rows = fuzzy(getRowsWithSpecialCharacters())
        expect(rows).toHaveLength(1)
        expect(rows[0].label).toBe('O\'Crowly "Mac" Donald')
      })

      it('like cuss', () => {
        const fuzzy = fuzzyFilter('!?/@#\\$%^<>&*()=+', searchableProperties)
        const rows = fuzzy(getRowsWithSpecialCharacters())
        expect(rows).toHaveLength(1)
        expect(rows[0].label).toBe('!?/@#\\$%^<>&*()=+')
      })

      it('like numbers', () => {
        const fuzzy = fuzzyFilter('5', searchableProperties)
        const rows = fuzzy(getRowsWithSpecialCharacters())
        expect(rows).toHaveLength(1)
        expect(rows[0].label).toBe('123456')
      })

      it('like functions in value', () => {
        const fuzzy = fuzzyFilter('foobar', searchableProperties)
        const rows = fuzzy(getRowsWithSpecialCharacters())
        expect(rows).toHaveLength(1)
        expect(rows[0].type).toBe('function')
      })

      it('like functions in properties', () => {
        const fuzzy = fuzzyFilter(
          'deeply nested',
          R.append(R.path(['deeply', 'nested', 'label']), searchableProperties)
        )
        const rows = fuzzy(getRowsWithSpecialCharacters())
        expect(rows).toHaveLength(1)
        expect(rows[0].type).toBe('deepnest')
      })
    })

    describe('are case insensitive', () => {
      it('ignores uppercase', () => {
        const rows = getRows()
        const fuzzy = fuzzyFilter('MOL', searchableProperties)
        const altered = fuzzy(rows)
        expect(altered).toHaveLength(1)
        expect(altered[0].label).toBe('Mollis Purus Tellus')
      })

      it('ignores lowercase', () => {
        const rows = getRows()
        const fuzzy = fuzzyFilter('nibh', searchableProperties)
        const altered = fuzzy(rows)
        expect(altered).toHaveLength(1)
        expect(altered[0].label).toBe('Nibh Sit Mattis')
      })
    })
  })

  describe('using a comma in search', () => {
    const commaSearchableProperties = ['label', 'date', 'tag']
    const getRows = () => [
      {
        label:
          'Use the solid state USB program, then you can copy the 1080p sensor!',
        tag: 'mobile',
        date: '12/05/2017'
      },
      {
        label:
          "Connecting the driver won't do anything, we need to parse the online USB driver!",
        tag: 'microchip',
        date: '09/10/2018'
      },
      {
        label:
          'The PCI driver is down, index the 1080p hard drive so we can back up the CSS interface!',
        tag: 'hacking',
        date: '03/13/2018'
      },
      {
        label:
          'Use the auxiliary COM capacitor, then you can override the back-end system!',
        tag: 'hacking',
        date: '03/10/2019'
      },
      {
        label:
          'Try to generate the FTP panel, maybe it will compress the cross-platform monitor!',
        tag: 'quantifying',
        date: '06/02/2017'
      }
    ]

    it('matches on properites using all search parts', () => {
      const rows = getRows()
      const fuzzy = fuzzyFilter('USB, 2018', commaSearchableProperties)
      const filtered = fuzzy(rows)
      // 'USB' matches on 0, 1, and 3, '2018' matches on 1 and 2
      expect(filtered).toHaveLength(1)
      expect(filtered[0]).toMatchObject(rows[1])
    })

    describe('only searches one property per search part', () => {
      it('with no results', () => {
        const rows = getRows()
        const fuzzy = fuzzyFilter('ing, ing', commaSearchableProperties)
        const filtered = fuzzy(rows)
        // no items have 'ing' in two separate properties
        expect(filtered).toHaveLength(0)
      })

      it('with one result', () => {
        const rows = getRows()
        const fuzzy = fuzzyFilter('108, 108', commaSearchableProperties)
        const filtered = fuzzy(rows)
        expect(filtered).toHaveLength(1)
        expect(filtered[0]).toMatchObject(rows[2])
      })
    })
  })
})
