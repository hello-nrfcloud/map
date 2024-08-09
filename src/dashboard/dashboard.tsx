import { render } from 'solid-js/web'
import { APIHealthProvider } from '#context/APIHealth.tsx'
import { AppUpdateProvider } from '#context/AppUpdate.tsx'
import { ParametersProvider } from '#context/Parameters.tsx'
import { ViteEnvProvider } from '#context/ViteEnv.tsx'
import { DashboardApp } from '#dashboard/DashboardApp.tsx'
import { UserProvider } from '#context/User.tsx'

import 'the-new-css-reset/css/reset.css'
import '../base.css'
import './dashboard.css'

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
						<UserProvider>
							<DashboardApp />
						</UserProvider>
					</APIHealthProvider>
				</ParametersProvider>
			</AppUpdateProvider>
		</ViteEnvProvider>
	),
	root!,
)
