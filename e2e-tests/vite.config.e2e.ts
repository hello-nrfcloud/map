import { createConfig } from '../vite/config.js'
import { testdataServerPlugin } from './testDataServerPlugin.js'

export default createConfig('/e2e/registry.json', '/map', [
	testdataServerPlugin(),
])
