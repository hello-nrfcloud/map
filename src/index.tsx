import { AllDevicesMapStateProvider } from '#context/AllDeviceMapState.js'
import { APIHealthProvider } from '#context/APIHealth.js'
import { AppUpdateProvider } from '#context/AppUpdate.js'
import { DevicesProvider } from '#context/Devices.js'
import { NavigationProvider } from '#context/Navigation.js'
import { ParametersProvider } from '#context/Parameters.js'
import { ViteEnvProvider } from '#context/ViteEnv.js'
import { render } from 'solid-js/web'
import { MapApp } from './MapApp.js'

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
					<APIHealthProvider>
						<DevicesProvider>
							<NavigationProvider>
								<AllDevicesMapStateProvider>
									<MapApp />
								</AllDevicesMapStateProvider>
							</NavigationProvider>
						</DevicesProvider>
					</APIHealthProvider>
				</ParametersProvider>
			</AppUpdateProvider>
		</ViteEnvProvider>
	),
	root!,
)
