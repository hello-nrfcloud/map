import { createContext, useContext } from 'solid-js'
import {
	createSignal,
	onCleanup,
	type ParentProps,
	type Accessor,
} from 'solid-js'

type CurrentNav =
	| { panel: string; deviceId: undefined; query: URLSearchParams }
	| { deviceId: string; panel: undefined; query: URLSearchParams }

const parseHash = (hash: string): CurrentNav => {
	const [panelWithQuery, id] = (hash.slice(1) ?? 'home').split(':', 2)
	const [panel, query] = (panelWithQuery ?? '').split('?')
	if (panel === 'id' && id !== undefined)
		return {
			deviceId: id,
			panel: undefined,
			query: new URLSearchParams(),
		}
	return {
		panel: panel ?? 'home',
		deviceId: undefined,
		query: new URLSearchParams(query ?? ''),
	}
}

export const NavigationProvider = (props: ParentProps) => {
	const [location, setLocation] = createSignal<CurrentNav>(
		parseHash(window.location.hash),
	)

	const locationHandler = () => setLocation(parseHash(window.location.hash))
	window.addEventListener('hashchange', locationHandler)

	onCleanup(() => window.removeEventListener('hashchange', locationHandler))

	return (
		<NavigationContext.Provider value={location}>
			{props.children}
		</NavigationContext.Provider>
	)
}

export const NavigationContext = createContext<Accessor<CurrentNav>>(() => ({
	panel: 'home',
	deviceId: undefined,
	query: new URLSearchParams(),
}))

export const useNavigation = () => useContext(NavigationContext)
