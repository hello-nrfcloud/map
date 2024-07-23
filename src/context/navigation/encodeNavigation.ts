import { isSearchTermType, type SearchTerm } from '../../search.ts'
import { isModel } from '../../util/isModel.ts'
import type { LwM2MObjectID } from '@hello.nrfcloud.com/proto-map/lwm2m'
import { isLwM2MObjectID } from '@hello.nrfcloud.com/proto-map/lwm2m'
import type { ModelID } from '@hello.nrfcloud.com/proto-map/models'
import type { TutorialContent } from '../../../tutorial/tutorialContentPlugin.ts'

export type PinnedResource = {
	model: ModelID
	ObjectID: LwM2MObjectID
	ResourceID: number
}

export type NavigationMapState = {
	center: { lat: number; lng: number }
	zoom: number
}
export type Navigation = {
	panel: string
	search: SearchTerm[]
	pinnedResources: PinnedResource[]
	map?: NavigationMapState
	tutorial?: keyof TutorialContent
	toggled: string[]
	query?: URLSearchParams
}

enum FieldKey {
	Search = 's',
	PinnedResources = 'r',
	Map = 'm',
	Tutorial = 'T',
	Toggled = 't',
}

const sep = '!'

export const encode = (
	navigation?: Partial<Navigation>,
): string | undefined => {
	if (navigation === undefined) return ''
	const parts = []
	const { panel, search, pinnedResources, map, tutorial, toggled, query } =
		navigation
	let panelWithQuery = `${panel ?? ''}`
	if (query !== undefined) panelWithQuery += '?' + query.toString()
	parts.push(panelWithQuery)
	if (search !== undefined && search.length > 0) {
		parts.push(
			...[
				...new Set(
					search.map(({ type, term }) => `${FieldKey.Search}:${type}:${term}`),
				),
			],
		)
	}
	if (pinnedResources !== undefined && pinnedResources.length > 0) {
		parts.push(
			...[
				...new Set(
					pinnedResources.map(
						({ model, ObjectID, ResourceID }) =>
							`${model}:${FieldKey.PinnedResources}:${ObjectID}/${ResourceID}`,
					),
				),
			],
		)
	}
	if (map !== undefined) {
		parts.push(
			`${FieldKey.Map}:${map.zoom}:${map.center.lat},${map.center.lng}`,
		)
	}
	if (tutorial !== undefined) {
		parts.push(`${FieldKey.Tutorial}:${tutorial}`)
	}
	if (toggled !== undefined && toggled.length > 0) {
		parts.push([FieldKey.Toggled, ...toggled.map(encodeColon)].join(':'))
	}
	return parts.join(sep)
}

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

const encodeColon = (s: string): string =>
	s.replaceAll(':', encodeURIComponent(':'))

const decodeColon = (s: string): string =>
	s.replaceAll(encodeURIComponent(':'), ':')
