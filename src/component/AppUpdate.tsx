import { useNavigation } from '../context/Navigation.jsx'
import { reloadLink, linkToHome, linkToPanel } from '../util/link.js'
import { AppUpdateRequired, Close } from '../icons/LucideIcon.jsx'
import { Show } from 'solid-js'
import { SidebarContent } from './Sidebar.jsx'
import { useAppUpdate } from '../context/AppUpdate.jsx'

const panelId = 'app-update'

export const SidebarButton = () => {
	const location = useNavigation()
	const updateInfo = useAppUpdate()
	return (
		<Show when={updateInfo().updateRequired}>
			<Show
				when={location().panel === panelId}
				fallback={
					<a class="button error" href={linkToPanel(panelId)}>
						<AppUpdateRequired strokeWidth={2} />
					</a>
				}
			>
				<a class="button error active" href={reloadLink()}>
					<AppUpdateRequired strokeWidth={2} />
				</a>
			</Show>
		</Show>
	)
}

export const Sidebar = () => {
	const location = useNavigation()
	const updateInfo = useAppUpdate()
	return (
		<Show when={updateInfo().updateRequired}>
			<Show when={location().panel === panelId}>
				<SidebarContent class="warning">
					<header>
						<h1>Update available!</h1>
						<a href={linkToHome()} class="close">
							<Close size={20} />
						</a>
					</header>
					<section class="separator">
						<p>
							A new version (<code>{updateInfo().releasedVersion}</code>) of
							this web application is available.
						</p>
						<p>
							Please <a href={reloadLink()}>reload it</a>.
						</p>
					</section>
				</SidebarContent>
			</Show>
		</Show>
	)
}
