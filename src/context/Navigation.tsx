import { createContext, useContext } from 'solid-js'
import {
	createSignal,
	onCleanup,
	type ParentProps,
	type Accessor,
} from 'solid-js'

export const NavigationProvider = (props: ParentProps) => {
	const [location, setLocation] = createSignal(
		window.location.hash.slice(1) || 'home',
	)

	const locationHandler = () => setLocation(window.location.hash.slice(1))
	window.addEventListener('hashchange', locationHandler)

	onCleanup(() => window.removeEventListener('hashchange', locationHandler))

	return (
		<NavigationContext.Provider value={location}>
			{props.children}
		</NavigationContext.Provider>
	)
}

export const NavigationContext = createContext<Accessor<string>>(() => '')

export const useNavigation = () => useContext(NavigationContext)
