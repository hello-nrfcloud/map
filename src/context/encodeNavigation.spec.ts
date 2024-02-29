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
			resources: [],
		}))

	void it('should encode a page URL with an ID', () =>
		assert.deepEqual(decode(encode({ panel: 'id:42' })), {
			panel: 'id:42',
			search: [],
			resources: [],
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
				resources: [],
			},
		))

	void it('should encode resources to show', () =>
		assert.deepEqual(
			decode(
				encode({
					panel: 'id:42',
					resources: [
						{
							model: 'PCA20035+solar',
							ObjectID: 14204,
							ResourceID: 4,
						},
					],
				}),
			),
			{
				panel: 'id:42',
				search: [],
				resources: [
					{
						model: 'PCA20035+solar',
						ObjectID: 14204,
						ResourceID: 4,
					},
				],
			},
		))

	void it('should encode the map state', () =>
		assert.deepEqual(
			decode(
				encode({
					panel: 'world',
					map: {
						center: {
							lat: 63.421065865928355,
							lng: 10.437128259586967,
						},
						zoom: 7,
					},
				}),
			),
			{
				panel: 'world',
				search: [],
				resources: [],
				map: {
					center: {
						lat: 63.421065865928355,
						lng: 10.437128259586967,
					},
					zoom: 7,
				},
			},
		))
})
