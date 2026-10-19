import { fromEnv } from '@bifravst/from-env'
import { createConfig } from '../vite/config.ts'
import { testdataServerPlugin } from './lib/testDataServerPlugin.ts'

const { mapRegion, mapApiKey } = fromEnv({
	mapRegion: 'MAP_REGION',
	mapApiKey: 'MAP_API_KEY',
})(process.env)

const base = 'http://localhost:8080'

export default createConfig(
	new URL('/e2e/api/', base),
	new URL('/e2e/hello-api/', base),
	'/map',
	{
		region: mapRegion,
		apiKey: mapApiKey,
	},
	[testdataServerPlugin()],
)
