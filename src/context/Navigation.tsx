import { createContext, useContext } from 'solid-js'
import {
	createSignal,
	onCleanup,
	type ParentProps,
	type Accessor,
} from 'solid-js'
import { decode, encode, type Navigation } from './encodeNavigation.js'
import type { SearchTerm } from './Search.js'

const Home: Navigation = { panel: 'home' }

export const NavigationProvider = (props: ParentProps) => {
	const [location, setLocation] = createSignal<Navigation>(
		decode(window.location.hash.slice(1)) ?? Home,
	)

	const locationHandler = () =>
		setLocation(decode(window.location.hash.slice(1)) ?? Home)
	window.addEventListener('hashchange', locationHandler)

	onCleanup(() => window.removeEventListener('hashchange', locationHandler))
	const navigate = (next: Navigation) => {
		window.location.hash =
			encode({
				...location(),
				...next,
			}) ?? ''
	}
	const link = (next: Navigation) =>
		new URL(
			`${BASE_URL}/#${encode({
				...location(),
				...next,
			})}`,
			document.location.href,
		).toString()

	const linkToHome = () => link(Home)

	return (
		<NavigationContext.Provider
			value={{
				current: () => ({
					panel: location().panel,
					search: location().search ?? [],
				}),
				navigate,
				navigateHome: () => navigate(Home),
				linkToHome,
				link,
				linkWithoutSearchTerm: (term) => {
					const current = location()
					return link({
						...current,
						search: current.search?.filter((t) => t !== term) ?? [],
					})
				},
				linkToSearch: (term) =>
					link({
						panel: 'search',
						search: [term],
					}),
				navigateWithSearchTerm: (term) => {
					const current = location()
					navigate({
						...current,
						search: [...(current.search ?? []), term],
					})
				},
			}}
		>
			{props.children}
		</NavigationContext.Provider>
	)
}

export const NavigationContext = createContext<{
	current: Accessor<Required<Navigation>>
	navigate: (next: Navigation) => void
	navigateHome: () => void
	linkToHome: () => string
	link: (next: Navigation) => string
	linkWithoutSearchTerm: (term: SearchTerm) => string
	linkToSearch: (term: SearchTerm) => string
	navigateWithSearchTerm: (term: SearchTerm) => void
}>({
	current: () => ({ ...Home, search: [] }),
	navigate: () => undefined,
	navigateHome: () => undefined,
	navigateWithSearchTerm: () => undefined,
	linkToHome: () =>
		new URL(`${BASE_URL}/#${encode(Home)}`, document.location.href).toString(),
	link: () => '/#',
	linkWithoutSearchTerm: () => '/#',
	linkToSearch: () => '/#',
})

export const useNavigation = () => useContext(NavigationContext)
