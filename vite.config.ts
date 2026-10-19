import { fromEnv } from '@bifravst/from-env'
import { createConfig } from './vite/config.ts'

const { mapRegion, mapApiKey } = fromEnv({
	mapRegion: 'MAP_REGION',
	mapApiKey: 'MAP_API_KEY',
})(process.env)

// Unset GitHub Actions variables are passed as empty strings, treat them as not set.
const optionalEnv = (name: string): string | undefined => {
	const value = process.env[name]
	if (value === undefined || value.length === 0) return undefined
	return value
}

export default createConfig(
	new URL('https://api.nordicsemi.world/2024-04-15/'),
	new URL(
		optionalEnv('HELLO_API_URL') ??
			'https://api.hello.nordicsemi.cloud/2024-04-17/',
	),
	optionalEnv('NRF_CLOUD_TEAM_ID') ?? 'bbfe6b73-a46a-43ad-94bd-8e4b4a7847ce',
	process.env.BASE_URL ?? '/map/',
	{
		region: mapRegion,
		apiKey: mapApiKey,
	},
)
