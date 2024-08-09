import { isLwM2MObjectID } from '@hello.nrfcloud.com/proto-map/lwm2m'
import type { ModelID } from '@hello.nrfcloud.com/proto-map/models'
import { models } from '@hello.nrfcloud.com/proto-map/models'
import { isSearchTermType, type SearchTerm } from '../../search.ts'
import {
	FieldKey,
	type Navigation,
	type PinnedResource,
	sep,
} from './encodeNavigation.ts'

const DeviceModels = Object.keys(models)

const isModel = (s: unknown): s is ModelID =>
	typeof s === 'string' && DeviceModels.includes(s)

const decodeColon = (s: string): string =>
	s.replaceAll(encodeURIComponent(':'), ':')

export const decode = (encoded?: string): Navigation | undefined => {
	if (encoded === undefined) return undefined
	if (encoded.length === 0) return undefined
	const [panelWithQuery, ...rest] = encoded.split(sep)
	if (panelWithQuery === undefined) return undefined
	const [panel, queryString] = panelWithQuery.split('?', 2)
	let query: URLSearchParams | undefined = undefined
	if (queryString !== undefined) query = new URLSearchParams(queryString)
	if (panel === undefined) return undefined
	if (rest.length === 0) {
		const nav: Navigation = {
			panel,
			search: [],
			pinnedResources: [],
			toggled: [],
		}
		if (query !== undefined) nav.query = query
		return nav
	}
	const nav: Navigation = {
		panel,
		search: rest
			.map((s) => {
				const [key, type, term] = s.split(':', 3)
				if (key !== FieldKey.Search) return undefined
				if (!isSearchTermType(type)) return undefined
				return { type, term }
			})
			.filter((t): t is SearchTerm => t !== undefined),
		pinnedResources: rest
			.map((s) => {
				const [model, key, resource] = s.split(':', 3)
				if (!isModel(model)) return undefined
				if (key !== FieldKey.PinnedResources) return undefined
				const [ObjectID, ResourceID] = (resource?.split('/') ?? []).map((s) =>
					parseInt(s, 10),
				)
				if (ObjectID === undefined) return undefined
				if (!isLwM2MObjectID(ObjectID)) return undefined
				return {
					model,
					ObjectID,
					ResourceID,
				}
			})
			.filter((t): t is PinnedResource => t !== undefined),
		toggled: [],
	}
	if (query !== undefined) nav.query = query

	const mapState = rest.find((s) => s.split(':', 2)[0] === FieldKey.Map)
	if (mapState !== undefined) {
		const [, zoom, center] = mapState.split(':', 3)
		const [lat, lng] = (center?.split(',').map((s) => parseFloat(s)) ?? [
			63.421065865928355, 10.437128259586967,
		]) as [number, number]
		nav.map = {
			zoom: parseInt(zoom ?? '1', 10),
			center: {
				lat,
				lng,
			},
		}
	}

	const helpState = rest.find((s) => s.split(':', 2)[0] === FieldKey.Tutorial)
	if (helpState !== undefined) {
		nav.tutorial = helpState.split(':', 2)[1] as string
	}

	const toggledState = rest.find((s) => s.split(':', 2)[0] === FieldKey.Toggled)
	if (toggledState !== undefined) {
		const [, ...toggled] = toggledState.split(':')
		nav.toggled = toggled.map(decodeColon)
	}

	return nav
}
