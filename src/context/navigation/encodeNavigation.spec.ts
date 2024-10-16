import { ModelID } from '@hello.nrfcloud.com/proto-map/models'
import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { SearchTermType } from '../../search.js'
import { decode } from './decodeNavigation.ts'
import { encode, type Navigation } from './encodeNavigation.js'

void describe('encode() / decode()', () => {
	void it('should encode an empty state', () => assert.equal(encode(), ''))

	void it('should encode a page URL', () =>
		assert.deepEqual(decode(encode({ panel: 'about' })), {
			panel: 'about',
			search: [],
			pinnedResources: [],
			toggled: [],
		}))

	void it('should encode a page URL with an ID', () =>
		assert.deepEqual(decode(encode({ panel: 'id:42' })), {
			panel: 'id:42',
			search: [],
			pinnedResources: [],
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
				pinnedResources: [],
				toggled: [],
			},
		))

	void it('should encode resources to show', () =>
		assert.deepEqual(
			decode(
				encode({
					panel: 'id:42',
					pinnedResources: [
						{
							model: ModelID.Thingy91x,
							ObjectID: 14204,
							ResourceID: 4,
						},
					],
				}),
			),
			{
				panel: 'id:42',
				search: [],
				pinnedResources: [
					{
						model: 'thingy91x',
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
				pinnedResources: [],
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

	void it('should encode the tutorial state', () =>
		assert.deepEqual(
			decode(
				encode({
					panel: 'world',
					tutorial: 'start',
				}),
			),
			{
				panel: 'world',
				tutorial: 'start',
				search: [],
				pinnedResources: [],
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
				pinnedResources: [],
				toggled: ['foo', 'bar'],
			},
		))

	void it('should encode a query string', () => {
		const { query } = decode(
			encode({
				query: new URLSearchParams({
					fingerprint: '29a.rarm8b',
					model: 'PCA20035:solar',
				}),
			}),
		) as Navigation
		assert.equal(query?.get('fingerprint'), '29a.rarm8b')
		assert.equal(query?.get('model'), 'PCA20035:solar')
	})
})
