import { useNavigation } from '../context/Navigation.js'
import { Close, Protocol } from '../icons/LucideIcon.js'
import { SidebarContent } from './Sidebar/SidebarContent.js'
import { Show } from 'solid-js'
import { DescribeConnectionSettings } from './DescribeConnectionSettings.tsx'

export const panelId = 'protocol'

export const Sidebar = () => {
	const location = useNavigation()
	return (
		<Show when={location.current().panel === panelId}>
			<SidebarContent id={panelId}>
				<header>
					<h1>Protocol</h1>
					<a href={location.linkToHome()} class="close" title="Close">
						<Close size={20} />
					</a>
				</header>
				<div class="scrollable">
					<section class="separator">
						<p>
							Once you have added your device and acquired the credentials, it
							can start publish data.
						</p>
						<h2>Connect to nRF Cloud</h2>
						<p>
							Follow the{' '}
							<a
								href="https://docs.nordicsemi.com/bundle/nrf-cloud/page/APIs/APIOverview.html"
								target="_blank"
								rel="noopener noreferrer"
							>
								nRF Cloud documentation
							</a>{' '}
							to establish a CoAP or MQTT connection with your device.
						</p>
					</section>
					<section>
						<p>Use these connection settings:</p>
						<DescribeConnectionSettings deviceId="your-device-id" />
					</section>
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
					<a
						class="button"
						href={location.link({ panel: panelId })}
						title="Protocol"
					>
						<Protocol strokeWidth={2} />
					</a>
				}
			>
				<a class="button active" href={location.linkToHome()} title="Protocol">
					<Protocol strokeWidth={2} />
				</a>
			</Show>
			<hr />
		</>
	)
}
