import { APIHealthProvider } from '#context/APIHealth.tsx'
import { AppUpdateProvider } from '#context/AppUpdate.tsx'
import { UserProvider } from '#context/User.tsx'
import { DashboardApp } from '#dashboard/DashboardApp.tsx'
import { render } from 'solid-js/web'

import 'the-new-css-reset/css/reset.css'
import '../base.css'
import './dashboard.css'

const root = document.getElementById('root')

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
	throw new Error('Root element not found.')
}

render(
	() => (
		<AppUpdateProvider>
			<APIHealthProvider>
				<UserProvider>
					<DashboardApp />
				</UserProvider>
			</APIHealthProvider>
		</AppUpdateProvider>
	),
	root!,
)
