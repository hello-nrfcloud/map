import { isSearchTermType, type SearchTerm } from './Search.js'
import { isModel, type Resource } from './Navigation.js'
import { isLwM2MObjectID } from '@hello.nrfcloud.com/proto-lwm2m'

export type Navigation = {
	panel: string
	search: SearchTerm[]
	resources: Resource[]
}

enum FieldKey {
	Search = 's',
	Resources = 'r',
}

export const encode = (
	navigation?: Partial<Navigation>,
): string | undefined => {
	if (navigation === undefined) return ''
	const parts = []
	const { panel, search, resources } = navigation
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
	return parts.join('|')
}

export const decode = (encoded?: string): Navigation | undefined => {
	if (encoded === undefined) return undefined
	if (encoded.length === 0) return undefined
	const [panel, ...rest] = encoded.split('|')
	if (panel === undefined) return undefined
	if (rest.length === 0) return { panel, search: [], resources: [] }
	return {
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
}
