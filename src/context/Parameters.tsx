import { type ParentProps } from 'solid-js'
import { createContext, createResource, useContext, Show } from 'solid-js'

export type Parameters = {
	// Map resources
	mapName: string
	mapApiKey: string
	mapRegion: string
	cognitoIdentityPoolId: string
	// Map sharing
	devicesAPIURL: URL
	thingyWorldShadowsURL: URL
}

export const fetchParameters = (url: URL) => async (): Promise<Parameters> => {
	try {
		const res = await fetch(url)
		const params = await res.json()
		const {
			devicesAPIURL,
			thingyWorldShadowsURL,
			mapName,
			mapApiKey,
			mapRegion,
			cognitoIdentityPoolId,
		} = params
		const parsed = {
			devicesAPIURL: new URL(devicesAPIURL),
			thingyWorldShadowsURL: new URL(thingyWorldShadowsURL),
			mapName,
			mapApiKey,
			mapRegion,
			cognitoIdentityPoolId,
		}
		for (const [k, v] of Object.entries({ devicesAPIURL })) {
			console.log(`[Parameters]`, k, v)
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

export const ParametersProvider = (
	props: ParentProps<{ registryEndpoint: URL }>,
) => {
	const [parameters] = createResource(
		props.registryEndpoint,
		fetchParameters(props.registryEndpoint),
	)

	return (
		<Show when={parameters() !== undefined} fallback={<div>Loading ...</div>}>
			<ParametersContext.Provider value={parameters()}>
				{props.children}
			</ParametersContext.Provider>
		</Show>
	)
}
