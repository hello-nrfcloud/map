import { randomUUID } from 'crypto'
import { createConfig } from '../vite/config.js'
import { testdataServerPlugin } from './testDataServerPlugin.js'
import { fromEnv } from '@nordicsemiconductor/from-env'

const { mapRegion, mapName, mapApiKey } = fromEnv({
	mapRegion: 'MAP_REGION',
	mapName: 'MAP_NAME',
	mapApiKey: 'MAP_API_KEY',
})(process.env)

const base = 'http://localhost:8080'

export default createConfig(new URL('/e2e/registry.json', base), '/map', [
	testdataServerPlugin({
		registry: {
			mapRegion,
			mapName,
			mapApiKey,
			confirmOwnershipAPIURL: new URL('/e2e/api/confirmOwnership', base),
			createCredentialsAPIURL: new URL('/e2e/api/createCredentials', base),
			devicesAPIURL: new URL('/e2e/api/devices', base),
			lwm2mResourceHistoryURL: new URL('/e2e/api/lwm2mResourceHistory', base),
			shareAPIURL: new URL('/e2e/api/share', base),
			thingyWorldShadowsURL: new URL('/e2e/api/thingyWorldShadows', base),
			nrfCloudTeamId: randomUUID(),
		},
	}),
])
