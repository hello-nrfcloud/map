import { render } from 'solid-js/web'

import 'the-new-css-reset/css/reset.css'
import './base.css'

import { MapApp } from './MapApp.js'
import { ParametersProvider } from './context/Parameters.js'
import { DevicesProvider } from './context/Devices.jsx'
import { NavigationProvider } from './context/Navigation.js'

const root = document.getElementById('root')

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
	throw new Error('Root element not found.')
}

render(
	() => (
		<ParametersProvider registryEndpoint={new URL(REGISTRY_ENDPOINT)}>
			<DevicesProvider>
				<NavigationProvider>
					<MapApp />
				</NavigationProvider>
			</DevicesProvider>
		</ParametersProvider>
	),
	root!,
)
