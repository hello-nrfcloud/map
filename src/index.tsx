import { render } from 'solid-js/web'
import { MapApp } from './MapApp.js'
import { ParametersProvider } from './context/Parameters.js'
import { DevicesProvider } from './context/Devices.js'
import { NavigationProvider } from './context/Navigation.js'
import { AppUpdateProvider } from './context/AppUpdate.js'
import { AllDevicesMapStateProvider } from './context/AllDeviceMapState.jsx'
import { ViteEnvProvider } from './context/ViteEnv.tsx'

import 'the-new-css-reset/css/reset.css'
import './base.css'

const root = document.getElementById('root')

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
	throw new Error('Root element not found.')
}

render(
	() => (
		<ViteEnvProvider>
			<AppUpdateProvider>
				<ParametersProvider>
					<DevicesProvider>
						<NavigationProvider>
							<AllDevicesMapStateProvider>
								<MapApp />
							</AllDevicesMapStateProvider>
						</NavigationProvider>
					</DevicesProvider>
				</ParametersProvider>
			</AppUpdateProvider>
		</ViteEnvProvider>
	),
	root!,
)
