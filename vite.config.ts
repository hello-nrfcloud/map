import { fromEnv } from '@bifravst/from-env'
import { createConfig } from './vite/config.ts'

const { registryEndpoint, mapRegion, mapApiKey } = fromEnv({
	registryEndpoint: 'REGISTRY_ENDPOINT',
	mapRegion: 'MAP_REGION',
	mapApiKey: 'MAP_API_KEY',
})(process.env)

export default createConfig(
	new URL('https://api.nordicsemi.world/2024-04-15/'),
	new URL(registryEndpoint),
	process.env.BASE_URL ?? '/map/',
	{
		region: mapRegion,
		apiKey: mapApiKey,
	},
)
