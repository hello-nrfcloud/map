import { render } from 'solid-js/web'
import { MapApp } from './MapApp.js'
import { ParametersProvider } from './context/Parameters.js'
import { DevicesProvider } from './context/Devices.js'
import { NavigationProvider } from './context/Navigation.js'
import { AppUpdateProvider } from './context/AppUpdate.js'

import 'the-new-css-reset/css/reset.css'
import './base.css'

const root = document.getElementById('root')

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
	throw new Error('Root element not found.')
}

render(
	() => (
		<AppUpdateProvider>
			<ParametersProvider registryEndpoint={new URL(REGISTRY_ENDPOINT)}>
				<DevicesProvider>
					<NavigationProvider>
						<MapApp />
					</NavigationProvider>
				</DevicesProvider>
			</ParametersProvider>
		</AppUpdateProvider>
	),
	root!,
)
