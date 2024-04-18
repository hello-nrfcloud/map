import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { SearchTermType } from '../../search.ts'
import { encode, decode, type Navigation } from './encodeNavigation.js'
import { ModelID } from '@hello.nrfcloud.com/proto-map'

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
				pinnedResources: [
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
