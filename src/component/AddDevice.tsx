import { useNavigation } from '../context/Navigation.js'
import { Close, Add } from '../icons/LucideIcon.js'
import { SidebarContent } from './Sidebar.js'
import { Show } from 'solid-js'

import './AddDevice.css'
import { AddCustomDeviceFlow } from './AddDevice/AddCustomDeviceFlow.tsx'
import { AddDeviceByFingerprintFlow } from './AddDevice/AddDeviceByFingerprintFlow.tsx'

const panelId = 'add-device'

export const Sidebar = () => {
	const location = useNavigation()
	const fingerprint = location.current().query?.get('fingerprint')
	return (
		<Show when={location.current().panel === panelId}>
			<SidebarContent class="add-device" id={panelId}>
				<header>
					<h1>Add your device</h1>
					<a href={location.linkToHome()} class="close">
						<Close size={20} />
					</a>
				</header>
				<div class="scrollable">
					<section class="separator">
						<p>
							<code>hello.nrfcloud.com/map</code> is made to showcase real-world
							deployments of cellular IoT devices powered by Nordic
							Semiconductor hardware, demonstrating their diverse applications
							and capabilities to a global audience.
						</p>
						<p>
							We invite you to participate in this effort by adding your own
							devices to the map.
						</p>
					</section>
					<Show
						when={fingerprint !== undefined}
						fallback={<AddCustomDeviceFlow />}
					>
						<AddDeviceByFingerprintFlow fingerprint={fingerprint!} />
					</Show>
				</div>
			</SidebarContent>
		</Show>
	)
}

export const SidebarButton = () => {
	const location = useNavigation()

	return (
		<>
			<Show
				when={location.current().panel === panelId}
				fallback={
					<a class="button" href={location.link({ panel: panelId })}>
						<Add strokeWidth={2} />
					</a>
				}
			>
				<a class="button active" href={location.linkToHome()}>
					<Add strokeWidth={2} />
				</a>
			</Show>
			<hr />
		</>
	)
}
