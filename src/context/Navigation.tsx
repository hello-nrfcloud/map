import { createContext, useContext } from 'solid-js'
import {
	createSignal,
	onCleanup,
	type ParentProps,
	type Accessor,
	createEffect,
} from 'solid-js'
import { decode, encode, type Navigation } from './encodeNavigation.js'
import type { SearchTerm } from './Search.js'
import { LwM2MObjectID, ModelID, models } from '@hello.nrfcloud.com/proto-map'

const Home: Navigation = {
	panel: 'world',
	resources: [],
	search: [],
	toggled: [],
}

export const NavigationProvider = (props: ParentProps) => {
	const [location, setLocation] = createSignal<Navigation>(
		decode(window.location.hash.slice(1)) ?? Home,
	)
	const locationHandler = () =>
		setLocation(decode(window.location.hash.slice(1)) ?? Home)
	window.addEventListener('hashchange', locationHandler)

	// Handle reloads
	createEffect(() => {
		const next = new URLSearchParams(document.location.search).get('next')
		if (next !== null) {
			window.location.href = link(decode(next) ?? Home)
		}
	})

	onCleanup(() => window.removeEventListener('hashchange', locationHandler))
	const navigate = (next: Partial<Navigation>) => {
		window.location.hash =
			encode({
				...location(),
				...next,
			}) ?? ''
	}
	const link = (next: Partial<Navigation>) =>
		new URL(
			`${BASE_URL}/#${encode({
				...location(),
				...next,
			})}`,
			document.location.href,
		).toString()

	const linkToHome = () => link({ panel: 'world' })

	const hasResource = (resource: Resource) =>
		(location().resources ?? []).find(
			(r) => resourceToString(r) === resourceToString(resource),
		) !== undefined

	const isToggled = (id: string): boolean =>
		(location().toggled ?? []).includes(id)

	return (
		<NavigationContext.Provider
			value={{
				current: location,
				navigate,
				navigateHome: () => navigate(Home),
				linkToHome,
				link,
				reloadLink: () => {
					const encoded = encode({
						...location(),
						panel: 'world',
					})
					if (encoded === undefined)
						return new URL(`${BASE_URL}/`, document.location.href).toString()
					return new URL(
						`${BASE_URL}/?${new URLSearchParams({ next: encoded }).toString()}`,
						document.location.href,
					).toString()
				},
				linkWithoutSearchTerm: (term) => {
					const current = location()
					return link({
						...current,
						search: current.search?.filter((t) => t !== term) ?? [],
					})
				},
				linkToSearch: (term) =>
					link({
						...location(),
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
				toggleResource: (resource) => {
					const current = location()
					if (!hasResource(resource)) {
						navigate({
							...current,
							resources: [...(current.resources ?? []), resource],
						})
					} else {
						navigate({
							...current,
							resources: (current.resources ?? []).filter(
								(r) => resourceToString(r) !== resourceToString(resource),
							),
						})
					}
				},
				hasResource,
				isToggled,
				toggle: (id) => {
					const current = location()
					navigate({
						...current,
						toggled: isToggled(id)
							? (current.toggled ?? []).filter((t) => t !== id)
							: [...(current.toggled ?? []), id],
					})
				},
				toggleBatch: (updates) => {
					const disableIds = Object.entries(updates)
						.filter(([, state]) => state === false)
						.map(([id]) => id)
					const enabledIds = Object.entries(updates)
						.filter(([, state]) => state === true)
						.map(([id]) => id)
					const current = location()
					navigate({
						...current,
						toggled: [
							...enabledIds,
							...current.toggled.filter((i) => !disableIds.includes(i)),
						],
					})
				},
			}}
		>
			{props.children}
		</NavigationContext.Provider>
	)
}

export const DeviceModels = Object.keys(models)

export const isModel = (s: unknown): s is ModelID =>
	typeof s === 'string' && DeviceModels.includes(s)

export type Resource = {
	model: ModelID
	ObjectID: LwM2MObjectID
	ResourceID: number
}
const resourceToString = ({ ObjectID, ResourceID }: Resource): string =>
	`${ObjectID}/${ResourceID}`

export const NavigationContext = createContext<{
	current: Accessor<Navigation>
	navigate: (next: Partial<Navigation>) => void
	navigateHome: () => void
	linkToHome: () => string
	// Used to reload the app in case of an update
	reloadLink: () => string
	link: (next: Partial<Navigation>) => string
	linkWithoutSearchTerm: (term: SearchTerm) => string
	linkToSearch: (term: SearchTerm) => string
	navigateWithSearchTerm: (term: SearchTerm) => void
	toggleResource: (resource: Resource) => void
	hasResource: (resource: Resource) => boolean
	toggle: (id: string) => void
	toggleBatch: (updates: Record<string, boolean>) => void
	isToggled: (id: string) => boolean
}>({
	current: () => ({ ...Home, search: [], resources: [] }),
	navigate: () => undefined,
	navigateHome: () => undefined,
	navigateWithSearchTerm: () => undefined,
	linkToHome: () =>
		new URL(`${BASE_URL}/#${encode(Home)}`, document.location.href).toString(),
	link: () => '/#',
	reloadLink: () => '/',
	linkWithoutSearchTerm: () => '/#',
	linkToSearch: () => '/#',
	toggleResource: () => undefined,
	hasResource: () => false,
	toggle: () => undefined,
	toggleBatch: () => undefined,
	isToggled: () => false,
})

export const useNavigation = () => useContext(NavigationContext)
