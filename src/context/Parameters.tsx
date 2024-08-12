import { LoadingFullScreen } from '#component/LoadingFullScreen.js'
import {
	createContext,
	createResource,
	Show,
	useContext,
	type ParentProps,
} from 'solid-js'
import { useViteEnv } from './ViteEnv.js'

export type Registry = {
	nrfCloudTeamId: string
	// Map resources
	mapName: string
	mapApiKey: string
	mapRegion: string
	// Backend API
	helloApiURL: string
}

export type Parameters = {
	nrfCloudTeamId: string
	apiURL: URL
	// General API resources
	apiHealthURL: URL
	// Map sharing
	devicesAPIURL: URL
	shareAPIURL: URL
	confirmOwnershipAPIURL: URL
	createCredentialsAPIURL: URL
	// Map resources
	mapName: string
	mapApiKey: string
	mapRegion: string
	// Backend API
	helloApiURL: URL
}

export const fetchParameters =
	(apiURL: URL, registryURL: URL) => async (): Promise<Parameters> => {
		try {
			const res = await fetch(registryURL)
			const params: Registry = await res.json()
			const { mapName, mapApiKey, mapRegion, helloApiURL } = params
			const parsed: Parameters = {
				apiURL,
				devicesAPIURL: new URL('./devices', apiURL),
				mapName,
				mapApiKey,
				mapRegion,
				shareAPIURL: new URL('./share', apiURL),
				confirmOwnershipAPIURL: new URL('./share/confirm', apiURL),
				createCredentialsAPIURL: new URL('./credentials', apiURL),
				apiHealthURL: new URL('./health', apiURL),
				nrfCloudTeamId: 'bbfe6b73-a46a-43ad-94bd-8e4b4a7847ce',
				helloApiURL: new URL(helloApiURL),
			}
			for (const [k, v] of Object.entries(parsed)) {
				console.debug(`[Parameters]`, k, v instanceof URL ? v.toString() : v)
			}
			return parsed
		} catch (err) {
			console.error(err)
			throw new Error(
				`Failed to fetch parameters from registry (${registryURL.toString()}): ${
					(err as Error).message
				}!`,
			)
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
	const { apiURL } = useViteEnv()
	const { registryEndpoint } = useViteEnv()
	const [parameters] = createResource(fetchParameters(apiURL, registryEndpoint))

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
