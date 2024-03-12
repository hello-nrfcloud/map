import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { SearchTermType } from './Search.js'
import { encode, decode } from './encodeNavigation.js'
import { ModelID } from '@hello.nrfcloud.com/proto-lwm2m'

void describe('encode() / decode()', () => {
	void it('should encode an empty state', () => assert.equal(encode(), ''))

	void it('should encode a page URL', () =>
		assert.deepEqual(decode(encode({ panel: 'about' })), {
			panel: 'about',
			search: [],
			resources: [],
			toggled: [],
		}))

	void it('should encode a page URL with an ID', () =>
		assert.deepEqual(decode(encode({ panel: 'id:42' })), {
			panel: 'id:42',
			search: [],
			resources: [],
			toggled: [],
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
				toggled: [],
			},
		))

	void it('should encode resources to show', () =>
		assert.deepEqual(
			decode(
				encode({
					panel: 'id:42',
					resources: [
						{
							model: ModelID.PCA20035_solar,
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
				toggled: [],
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
				toggled: [],
				map: {
					center: {
						lat: 63.421065865928355,
						lng: 10.437128259586967,
					},
					zoom: 7,
				},
			},
		))

	void it('should encode the help state', () =>
		assert.deepEqual(
			decode(
				encode({
					panel: 'world',
					help: 'start',
				}),
			),
			{
				panel: 'world',
				help: 'start',
				search: [],
				resources: [],
				toggled: [],
			},
		))

	void it('should encode toggle states', () =>
		assert.deepEqual(
			decode(
				encode({
					toggled: ['foo', 'bar'],
				}),
			),
			{
				panel: '',
				search: [],
				resources: [],
				toggled: ['foo', 'bar'],
			},
		))
})
