import { isSearchTermType, type SearchTerm } from './Search.js'
import { isModel, type Resource } from './Navigation.js'
import { isLwM2MObjectID } from '@hello.nrfcloud.com/proto-lwm2m'

export type NavigationMapState = {
	center: { lat: number; lng: number }
	zoom: number
}
export type Navigation = {
	panel: string
	search: SearchTerm[]
	resources: Resource[]
	map?: NavigationMapState
}

enum FieldKey {
	Search = 's',
	Resources = 'r',
	Map = 'm',
}

const sep = '!'

export const encode = (
	navigation?: Partial<Navigation>,
): string | undefined => {
	if (navigation === undefined) return ''
	const parts = []
	const { panel, search, resources, map } = navigation
	parts.push(panel)
	if (search !== undefined && search.length > 0) {
		parts.push(
			...[
				...new Set(
					search.map(({ type, term }) => `${FieldKey.Search}:${type}:${term}`),
				),
			],
		)
	}
	if (resources !== undefined && resources.length > 0) {
		parts.push(
			...[
				...new Set(
					resources.map(
						({ model, ObjectID, ResourceID }) =>
							`${model}:${FieldKey.Resources}:${ObjectID}/${ResourceID}`,
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
	return parts.join(sep)
}

export const decode = (encoded?: string): Navigation | undefined => {
	if (encoded === undefined) return undefined
	if (encoded.length === 0) return undefined
	const [panel, ...rest] = encoded.split(sep)
	if (panel === undefined) return undefined
	if (rest.length === 0) return { panel, search: [], resources: [] }
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
		resources: rest
			.map((s) => {
				const [model, key, resource] = s.split(':', 3)
				if (!isModel(model)) return undefined
				if (key !== FieldKey.Resources) return undefined
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
			.filter((t): t is Resource => t !== undefined),
	}

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

	return nav
}
