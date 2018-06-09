/* eslint-env jest */
import R from 'ramda'
import React from 'react'
import { shallow } from 'enzyme'
import highlightSearch from '../../src/lib/highlight-search'

const searchableProperties = ['label', 'type']

describe('highlight search function', () => {
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
    const highlighter = highlightSearch('', searchableProperties)

    it('a function', () => {
      expect(highlighter).toBeInstanceOf(Function)
    })

    it('all items in list', () => {
      const rows = getRows()
      expect(highlighter(rows)).toHaveLength(2)
    })

    it('original strings', () => {
      const rows = getRows()
      highlighter(rows).forEach((row, i) => {
        expect(row).toMatchObject(rows[i])
      })
    })
  })

  describe('bold tags', () => {
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

    describe('do not wrap', () => {
      it('unsearchable columns', () => {
        const highlighter = highlightSearch('no tags', searchableProperties)
        const altered = highlighter(getRows())
        const rows = getRows()
        altered.forEach((alteredRow, i) => {
          expect(alteredRow).toMatchObject(rows[i])
        })
      })
    })

    describe('wrap around', () => {
      it('start of label', () => {
        const rows = getRows()
        const highlighter = highlightSearch('Trist', searchableProperties)
        const altered = highlighter(rows)
        const matchedRows = altered.slice(1, 3)
        matchedRows.forEach(({ label }) => {
          const labelElement = shallow(<label>{label}</label>)
          expect(labelElement).toMatchSnapshot()
        })

        const freshRows = getRows()
        altered.forEach((alteredRow, i) => {
          if (i === 1 || i === 2) return
          expect(alteredRow).toMatchObject(freshRows[i])
        })
      })

      it('any searchable column', () => {
        const rows = getRows()
        // index 1 - 3 from label, and 4 - 5 from type
        const highlighter = highlightSearch('Tris', searchableProperties)
        const altered = highlighter(rows)
        const matchedRows = altered.slice(1)
        matchedRows.forEach(({ label, nosearch, type }) => {
          const labelElement = shallow(
            <label>
              {label} - {type} - {nosearch}
            </label>
          )
          expect(labelElement).toMatchSnapshot()
          expect(typeof nosearch).toBe('string')
        })

        const freshRows = getRows()
        expect(altered[0]).toMatchObject(freshRows[0])
      })

      it('end of label', () => {
        const rows = getRows()
        const highlighter = highlightSearch('usto', searchableProperties)
        const altered = highlighter(rows)
        const matchedRow = altered.slice(4, 5)
        const label = shallow(<label>{matchedRow[0].label}</label>)
        expect(label).toMatchSnapshot()
        const freshRows = getRows()
        altered.forEach((alteredRow, i) => {
          if (i === 4) return
          expect(alteredRow).toMatchObject(freshRows[i])
        })
      })

      it('groups of characters', () => {
        const rows = getRows()
        const highlighter = highlightSearch('istsuaput', searchableProperties)
        const altered = highlighter(rows)
        const matchedRow = altered.slice(2, 3)
        const label = shallow(<label>{matchedRow[0].label}</label>)
        expect(label).toMatchSnapshot()
      })

      describe('special characters', () => {
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
          const highlighter = highlightSearch(':-()', searchableProperties)
          const rows = highlighter(getRowsWithSpecialCharacters())
          const colonsParensDashElement = shallow(
            <label>
              {rows[0].label} - {rows[0].type}
            </label>
          )
          expect(colonsParensDashElement).toMatchSnapshot()
        })

        it('like quotes', () => {
          const highlighter = highlightSearch(`'"`, searchableProperties)
          const rows = highlighter(getRowsWithSpecialCharacters())
          const quotesElement = shallow(
            <label>
              {rows[1].label} - {rows[1].type}
            </label>
          )
          expect(quotesElement).toMatchSnapshot()
        })

        it('like cuss', () => {
          const highlighter = highlightSearch(
            '!?/@#\\$%^<>&*()=+',
            searchableProperties
          )
          const rows = highlighter(getRowsWithSpecialCharacters())
          const cussElement = shallow(
            <label>
              {rows[2].label} - {rows[2].type}
            </label>
          )
          expect(cussElement).toMatchSnapshot()
        })

        it('like numbers', () => {
          const highlighter = highlightSearch('5', searchableProperties)
          const rows = highlighter(getRowsWithSpecialCharacters())
          const numberElement = shallow(
            <label>
              {rows[3].label} - {rows[3].type}
            </label>
          )
          expect(numberElement).toMatchSnapshot()
        })

        it('like functions in value', () => {
          const highlighter = highlightSearch('foobar', searchableProperties)
          const rows = highlighter(getRowsWithSpecialCharacters())
          const functionInValueElement = shallow(
            <label>
              {rows[4].label} - {rows[4].type}
            </label>
          )
          expect(functionInValueElement).toMatchSnapshot()
        })

        it('like functions in properties', () => {
          const highlighter = highlightSearch(
            'deeply nested',
            R.append(
              R.path(['deeply', 'nested', 'label']),
              searchableProperties
            )
          )
          const rows = highlighter(getRowsWithSpecialCharacters())
          const nestedLabel =
            rows[5][R.path(['deeply', 'nested', 'label'], rows[5])]

          const functionInPropertiesElement = shallow(
            <label>
              {nestedLabel}
              - {rows[5].type}
            </label>
          )
          expect(functionInPropertiesElement).toMatchSnapshot()
        })
      })
    })
    describe('are case insensitive', () => {
      it('ignores uppercase', () => {
        const rows = getRows()
        const highlighter = highlightSearch('MOL', searchableProperties)
        const altered = highlighter(rows)
        const label = shallow(altered[0].label[0])
        expect(label).toMatchSnapshot()
      })

      it('ignores lowercase', () => {
        const rows = getRows()
        const highlighter = highlightSearch('nibh', searchableProperties)
        const altered = highlighter(rows)
        const label = shallow(altered[3].label[0])
        expect(label).toMatchSnapshot()
      })
    })
  })
  describe('with comma separated search', () => {
    it('wraps each search part', () => {
      const rows = [
        {
          label: 'Fall 2018',
          startsAt: '8/23/2018',
          endsAt: '12/15/2018'
        }
      ]
      const highlighter = highlightSearch('2018, 2018, 2/2018', [
        'label',
        'startsAt',
        'endsAt'
      ])
      const row = R.head(highlighter(rows))
      const { label, startsAt, endsAt } = row
      const element = shallow(
        <label>
          {label} - {startsAt} - {endsAt}
        </label>
      )
      expect(element).toMatchSnapshot()
      expect(
        element.containsAllMatchingElements([
          <strong>2018</strong>,
          <strong>2</strong>,
          <strong>/2018</strong>,
          <strong>2</strong>,
          <strong>018</strong>
        ])
      ).toBe(true)
    })
  })
})
