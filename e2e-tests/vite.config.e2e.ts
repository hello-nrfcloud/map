import { fromEnv } from '@bifravst/from-env'
import { randomUUID } from 'crypto'
import { createConfig } from '../vite/config.js'
import { testdataServerPlugin } from './lib/testDataServerPlugin.ts'

const { mapRegion, mapName, mapApiKey } = fromEnv({
	mapRegion: 'MAP_REGION',
	mapName: 'MAP_NAME',
	mapApiKey: 'MAP_API_KEY',
})(process.env)

const base = 'http://localhost:8080'

export default createConfig(
	new URL('/e2e/api/', base),
	new URL('/e2e/registry.json', base),
	'/map',
	[
		testdataServerPlugin({
			registry: {
				mapRegion,
				mapName,
				mapApiKey,
				nrfCloudTeamId: randomUUID(),
				helloApiURL: new URL('/e2e/hello-api/', base).toString(),
			},
		}),
	],
)
