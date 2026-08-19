import { useAppUpdate } from '#context/AppUpdate.tsx'
import { useNavigation } from '#context/Navigation.tsx'
import { AppUpdateRequired } from '#icons/LucideIcon.tsx'
import { Show } from 'solid-js'

import './AppUpdate.css'

export const UpdateAvailable = () => {
	const location = useNavigation()
	const updateInfo = useAppUpdate()
	return (
		<Show when={updateInfo().updateRequired}>
			<aside id="app-update-warning">
				<header class="pad">
					<h1>
						<AppUpdateRequired strokeWidth={2} /> Update available!
					</h1>
					<a href={location.reloadLink()} class="btn">
						reload
					</a>
				</header>
				<section class="pad">
					<p>
						A new version (<code>{updateInfo().releasedVersion}</code>) of this
						web application is available.
					</p>
				</section>
			</aside>
		</Show>
	)
}
