import { useNavigation } from '../context/Navigation.js'
import { AppUpdateRequired, Close } from '../icons/LucideIcon.js'
import { Show } from 'solid-js'
import { SidebarContent } from './Sidebar.js'
import { useAppUpdate } from '../context/AppUpdate.js'

const panelId = 'app-update'

export const SidebarButton = () => {
	const location = useNavigation()
	const updateInfo = useAppUpdate()
	return (
		<Show when={updateInfo().updateRequired}>
			<a class="button error" href={location.link({ panel: panelId })}>
				<AppUpdateRequired strokeWidth={2} />
			</a>
		</Show>
	)
}

export const Sidebar = () => {
	const location = useNavigation()
	const updateInfo = useAppUpdate()
	return (
		<Show when={updateInfo().updateRequired}>
			<Show when={location.current().panel === panelId}>
				<SidebarContent class="warning">
					<header>
						<h1>Update available!</h1>
						<a href={location.linkToHome()} class="close">
							<Close size={20} />
						</a>
					</header>
					<div class="scrollable">
						<section class="separator">
							<p>
								A new version (<code>{updateInfo().releasedVersion}</code>) of
								this web application is available.
							</p>
							<p>
								Please <a href={location.reloadLink()}>reload it</a>.
							</p>
						</section>
					</div>
				</SidebarContent>
			</Show>
		</Show>
	)
}
