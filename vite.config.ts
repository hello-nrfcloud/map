import { fromEnv } from '@nordicsemiconductor/from-env'
import { trimTrailingSlash } from './src/util/trimTrailingSlash.js'
import { createConfig } from './vite/config.js'

const { registryEndpoint } = fromEnv({
	registryEndpoint: 'REGISTRY_ENDPOINT',
})(process.env)

const base = trimTrailingSlash(process.env.BASE_URL ?? '/map/')

export default createConfig(new URL(registryEndpoint), base)
