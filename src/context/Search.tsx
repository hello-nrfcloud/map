import {
	createContext,
	createEffect,
	createSignal,
	useContext,
	type ParentProps,
	type Accessor,
} from 'solid-js'
import { type Device } from '../context/Devices.js'
import { useNavigation } from '../context/Navigation.jsx'

enum SearchTermType {
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
]

const isSearchTermType = (term: unknown): term is SearchTermType =>
	typeof term === 'string' && allowedTypes.includes((term ?? '') as any)

type Search = {
	searchTerms: Accessor<SearchTerm[]>
	addSearchTerm: (value: string) => void
	removeSearchTerm: (term: SearchTerm) => void
}

export const SearchProvider = (props: ParentProps) => {
	const nav = useNavigation()
	const [searchTerms, setSearchTerms] = createSignal<SearchTerm[]>(
		[...nav().query.entries()].map<SearchTerm>(([k, v]) => ({
			type: k as SearchTermType,
			term: v,
		})),
	)

	const addSearchTerm = (value: string) => {
		const [type, term] = value.trim().split(':')
		if (type !== undefined && term === undefined) {
			setSearchTerms((prev) => [
				...prev,
				{ type: SearchTermType.Any, term: type },
			])
		} else if (isSearchTermType(type) && term !== undefined) {
			setSearchTerms((prev) => [...prev, { type, term } as SearchTerm])
		}
	}

	createEffect(() => {
		const s = new URLSearchParams(
			searchTerms().reduce(
				(terms, term) => ({ ...terms, [term.type]: term.term }),
				{},
			),
		).toString()
		document.location.hash = `search${s.length > 0 ? `?${s}` : ''}`
	})

	return (
		<SearchContext.Provider
			value={{
				addSearchTerm,
				searchTerms,
				removeSearchTerm: (term) => {
					setSearchTerms((terms) => terms.filter((t) => t !== term))
				},
			}}
		>
			{props.children}
		</SearchContext.Provider>
	)
}

export const matches = (terms: SearchTerm[]) => (device: Device) =>
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
						Object.entries(Resources).map(
							([ResourceId, Value]) => `${ObjectID}/${ResourceId}=${Value}`,
						),
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

export const SearchContext = createContext<Search>({
	searchTerms: () => [],
	addSearchTerm: () => undefined,
	removeSearchTerm: () => undefined,
})

export const useSearch = () => useContext(SearchContext)
