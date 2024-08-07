import { type Device } from './resources/fetchDevices.js'

export enum SearchTermType {
	Id = 'id',
	Model = 'model',
	NotModel = '-model',
	// Used to search for devices with LwM2M objects and resourcs
	Has = 'has',
	Any = '*',
}
export type SearchTerm = {
	type: SearchTermType
	term: string
}
const allowedTypes = [
	SearchTermType.Id,
	SearchTermType.Model,
	SearchTermType.NotModel,
	SearchTermType.Has,
	SearchTermType.Any,
]

export const isSearchTermType = (term: unknown): term is SearchTermType =>
	typeof term === 'string' && allowedTypes.includes((term ?? '') as any)

export const matches =
	(terms: SearchTerm[]) =>
	(device: Device): boolean =>
		terms.reduce((matches, term) => {
			if (matches === false) return false
			return termMatchesDevice(term, device)
		}, true)

const resourceValueSearchRx =
	/^(?<ObjectID>[0-9]+)\/(?<ResourceID>[0-9]+)=(?<Value>.+)/

const termMatchesDevice = (term: SearchTerm, device: Device) => {
	const tokens = []
	if (term.type === SearchTermType.NotModel)
		return !device.model.includes(term.term)
	if (term.type === SearchTermType.Id || term.type === SearchTermType.Any)
		tokens.push(device.id)
	if (term.type === SearchTermType.Model || term.type === SearchTermType.Any)
		tokens.push(device.model)
	if (term.type === SearchTermType.Has) {
		const maybeValueSearch = resourceValueSearchRx.exec(term.term)
		if (maybeValueSearch !== null) {
			tokens.push(
				...(device.state ?? [])
					.map(({ ObjectID, Resources }) =>
						Object.entries(Resources).map(([ResourceId, Value]) => {
							if (Array.isArray(Value)) return ''
							return `${ObjectID}/${ResourceId}=${Value}`
						}),
					)
					.flat(),
			)
		} else {
			const [ObjectID, ResourceId] = term.term.split('/')
			if (ResourceId === undefined) {
				tokens.push(device.state?.map(({ ObjectID }) => ObjectID))
			} else {
				tokens.push(
					...(device.state ?? [])
						.map(({ Resources }) =>
							Object.keys(Resources).map(
								(ResourceId) => `${ObjectID}/${ResourceId}`,
							),
						)
						.flat(),
				)
			}
		}
	}
	return tokens.join(' ').includes(term.term)
}
