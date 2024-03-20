/* eslint no-restricted-globals: 0 */

import { type ParentProps } from 'solid-js'
import { createContext, useContext } from 'solid-js'

type ViteEnv = {
	// Base URL of the site with a leading and a trailing slash
	base: string
	// Base URL of the site with a leading and no trailing slash
	baseNoEndSlash: string
	registryEndpoint: URL
	version: string
	homepageURL: URL
	buildTime: Date
	repositoryURL: URL
	protoVersion: string
}

const env: ViteEnv = {
	base: BASE_URL,
	baseNoEndSlash: BASE_URL.replace(/\/$/, ''),
	registryEndpoint: new URL(REGISTRY_ENDPOINT),
	version: VERSION,
	homepageURL: new URL(HOMEPAGE),
	buildTime: new Date(BUILD_TIME),
	repositoryURL: new URL(REPOSITORY_URL),
	protoVersion: PROTO_VERSION,
}

export const ViteEnvContext = createContext<ViteEnv>(env)
export const useViteEnv = () => useContext(ViteEnvContext)

export const ViteEnvProvider = (props: ParentProps) => (
	<ViteEnvContext.Provider value={env}>
		{props.children}
	</ViteEnvContext.Provider>
)
