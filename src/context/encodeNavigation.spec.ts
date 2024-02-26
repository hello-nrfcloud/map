import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { SearchTermType } from './Search.js'
import { encode, decode } from './encodeNavigation.js'

void describe('encode() / decode()', () => {
	void it('should encode an empty state', () => assert.equal(encode(), ''))

	void it('should encode a page URL', () =>
		assert.deepEqual(decode(encode({ panel: 'about' })), {
			panel: 'about',
			search: [],
		}))

	void it('should encode a page URL with an ID', () =>
		assert.deepEqual(decode(encode({ panel: 'id:42' })), {
			panel: 'id:42',
			search: [],
		}))

	void it('should encode search terms', () =>
		assert.deepEqual(
			decode(
				encode({
					panel: 'id:42',
					search: [
						{
							type: SearchTermType.Any,
							term: 'solar',
						},
					],
				}),
			),
			{
				panel: 'id:42',
				search: [
					{
						type: SearchTermType.Any,
						term: 'solar',
					},
				],
			},
		))
})
