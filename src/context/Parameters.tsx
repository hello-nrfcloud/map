import { type ParentProps } from 'solid-js'
import { createContext, createResource, useContext, Show } from 'solid-js'
import { LoadingFullScreen } from '../component/LoadingFullScreen.js'
import { useViteEnv } from './ViteEnv.tsx'

export type Registry = {
	nrfCloudTeamId: string
	// API url
	mapApiURL: string
	// Map resources
	mapName: string
	mapApiKey: string
	mapRegion: string
	// world.thingy.rocks legacy
	thingyWorldShadowsURL: string
}

export type Parameters = {
	nrfCloudTeamId: string
	// Map sharing
	devicesAPIURL: URL
	shareAPIURL: URL
	confirmOwnershipAPIURL: URL
	createCredentialsAPIURL: URL
	// Map history
	lwm2mResourceHistoryURL: URL
	// world.thingy.rocks legacy
	thingyWorldShadowsURL: URL
	// Map resources
	mapName: string
	mapApiKey: string
	mapRegion: string
}

export const fetchParameters = (url: URL) => async (): Promise<Parameters> => {
	try {
		const res = await fetch(url)
		const params: Registry = await res.json()
		const { mapApiURL, thingyWorldShadowsURL, mapName, mapApiKey, mapRegion } =
			params
		const parsed: Parameters = {
			devicesAPIURL: new URL('./devices', mapApiURL),
			thingyWorldShadowsURL: new URL(thingyWorldShadowsURL),
			mapName,
			mapApiKey,
			mapRegion,
			lwm2mResourceHistoryURL: new URL('./history', mapApiURL),
			shareAPIURL: new URL('./share', mapApiURL),
			confirmOwnershipAPIURL: new URL('./share/confirm', mapApiURL),
			createCredentialsAPIURL: new URL('./credentials', mapApiURL),
			nrfCloudTeamId: 'bbfe6b73-a46a-43ad-94bd-8e4b4a7847ce',
		}
		for (const [k, v] of Object.entries(parsed)) {
			console.debug(`[Parameters]`, k, v instanceof URL ? v.toString() : v)
		}
		return parsed
	} catch (err) {
		console.error(err)
		throw new Error(
			`Failed to fetch parameters from registry (${url.toString()}): ${
				(err as Error).message
			}!`,
		)
	}
}

export const createParametersContext = (registryEndpoint: URL) => {
	const [parameters, { refetch }] = createResource(
		registryEndpoint,
		fetchParameters(registryEndpoint),
	)

	return {
		parameters,
		refetch,
	}
}

export const ParametersContext = createContext<Parameters>(undefined as any)
export const useParameters = () => {
	const context = useContext(ParametersContext)

	if (!context) {
		throw new Error('useParameters: cannot find a ParametersContext')
	}
	return context
}

export const ParametersProvider = (props: ParentProps) => {
	const { registryEndpoint } = useViteEnv()
	const [parameters] = createResource(fetchParameters(registryEndpoint))

	return (
		<Show
			when={parameters() !== undefined}
			fallback={<LoadingFullScreen what="parameters" />}
		>
			<ParametersContext.Provider value={parameters()}>
				{props.children}
			</ParametersContext.Provider>
		</Show>
	)
}
