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
	shareAPIURL: URL
	confirmOwnershipAPIURL: URL
	createCredentialsAPIURL: URL
	// Map history
	lwm2mResourceHistoryURL: URL
	nrfCloudTeamId: string
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
			lwm2mResourceHistoryURL,
			shareAPIURL,
			confirmOwnershipAPIURL,
			createCredentialsAPIURL,
		} = params
		const parsed = {
			devicesAPIURL: new URL(devicesAPIURL),
			thingyWorldShadowsURL: new URL(thingyWorldShadowsURL),
			mapName,
			mapApiKey,
			mapRegion,
			cognitoIdentityPoolId,
			lwm2mResourceHistoryURL: new URL(lwm2mResourceHistoryURL),
			shareAPIURL: new URL(shareAPIURL),
			confirmOwnershipAPIURL: new URL(confirmOwnershipAPIURL),
			createCredentialsAPIURL: new URL(createCredentialsAPIURL),
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
