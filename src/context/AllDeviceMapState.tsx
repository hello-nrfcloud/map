import {
	createContext,
	type ParentProps,
	createSignal,
	type Setter,
	type Accessor,
	useContext,
	createEffect,
} from 'solid-js'
import { useNavigation } from './Navigation.js'

export type MapState = {
	center: {
		lat: number // e.g. 63.421065865928355,
		lng: number // e.g. 10.437128259586967,
	}
	zoom: number // e.g. 1,
	apply?: boolean
}

const defaultState: MapState = {
	center: {
		lat: 63.421065865928355,
		lng: 10.437128259586967,
	},
	zoom: 1,
}

export const AllDevicesMapStateProvider = (props: ParentProps) => {
	const location = useNavigation()
	// Only use this once for initialization
	const initial = location.current().map ?? defaultState
	const [state, update] = createSignal<MapState>(initial)

	createEffect(() => {
		location.navigate({
			map: {
				center: state().center,
				zoom: state().zoom,
			},
		})
	})

	return (
		<AllDevicesMapStateContext.Provider
			value={{
				initial,
				state,
				update,
			}}
		>
			{props.children}
		</AllDevicesMapStateContext.Provider>
	)
}

export const AllDevicesMapStateContext = createContext<{
	initial: MapState
	update: Setter<MapState>
	state: Accessor<MapState>
}>({
	initial: defaultState,
	state: () => defaultState,
	update: () => undefined,
})

export const useAllDevicesMapState = () => useContext(AllDevicesMapStateContext)
