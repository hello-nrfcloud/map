import { isSearchTermType, type SearchTerm } from './Search.js'

export type Navigation = { panel: string; search?: SearchTerm[] }

export const encode = (
	navigation?: Partial<Navigation>,
): string | undefined => {
	if (navigation === undefined) return ''
	const { panel, search } = navigation
	if (search === undefined || search.length === 0) return panel
	const encodedSearch = [
		...new Set(search.map(({ type, term }) => `${type}:${term}`)),
	].join('|')
	return `${panel}|${encodedSearch}`
}

export const decode = (encoded?: string): Navigation | undefined => {
	if (encoded === undefined) return undefined
	if (encoded.length === 0) return undefined
	const [panel, ...searchTerms] = encoded.split('|')
	if (panel === undefined) return undefined
	if (searchTerms.length === 0) return { panel, search: [] }
	return {
		panel,
		search: searchTerms
			.map((s) => {
				const [type, term] = s.split(':', 2)
				if (!isSearchTermType(type)) return undefined
				return { type, term }
			})
			.filter((t): t is SearchTerm => t !== undefined),
	}
}
