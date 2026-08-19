import { AllDevicesMapStateProvider } from '#context/AllDeviceMapState.tsx'
import { APIHealthProvider } from '#context/APIHealth.tsx'
import { AppUpdateProvider } from '#context/AppUpdate.tsx'
import { DevicesProvider } from '#context/Devices.tsx'
import { NavigationProvider } from '#context/Navigation.tsx'
import { ParametersProvider } from '#context/Parameters.tsx'
import { ViteEnvProvider } from '#context/ViteEnv.tsx'
import { render } from 'solid-js/web'
import { MapApp } from './MapApp.tsx'

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
