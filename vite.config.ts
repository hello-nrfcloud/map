import { fromEnv } from '@nordicsemiconductor/from-env'
import { createConfig } from './vite/config.js'

const { registryEndpoint } = fromEnv({
	registryEndpoint: 'REGISTRY_ENDPOINT',
})(process.env)

export default createConfig(
	new URL('https://api.nordicsemi.world/2024-04-15/'),
	new URL(registryEndpoint),
	process.env.BASE_URL ?? '/map/',
)
