import { type SearchTerm } from '../../search.js'
import type { LwM2MObjectID } from '@hello.nrfcloud.com/proto-map/lwm2m'
import type { ModelID } from '@hello.nrfcloud.com/proto-map/models'
import type { TutorialContent } from '../../../tutorial/tutorialContentPlugin.js'

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

export enum FieldKey {
	Search = 's',
	PinnedResources = 'r',
	Map = 'm',
	Tutorial = 'T',
	Toggled = 't',
}

export const sep = '!'

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

const encodeColon = (s: string): string =>
	s.replaceAll(':', encodeURIComponent(':'))
