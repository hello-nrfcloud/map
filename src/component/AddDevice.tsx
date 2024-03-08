import { useNavigation } from '../context/Navigation.js'
import { Close, Add } from '../icons/LucideIcon.jsx'
import { SidebarContent } from './Sidebar.js'
import { Show, createSignal, For } from 'solid-js'
import {
	AddDeviceForm,
	type ShareDeviceRequest,
} from './AddDevice/AddDeviceForm.js'
import {
	ConfirmRequestForm,
	type OwnershipConfirmed,
} from './AddDevice/ConfirmRequestForm.js'

import {
	CreateDeviceCredentialsForm,
	type DeviceCredentials,
} from './AddDevice/CreateCredentials.jsx'
import { CopyableProp } from './CopyableProp.jsx'
import { DescribeConnectionSettings } from './DescribeConnectionSettings.jsx'

import './AddDevice.css'

const panelId = 'add-device'

export const Sidebar = () => {
	const location = useNavigation()
	return (
		<Show when={location.current().panel === panelId}>
			<SidebarContent class="add-device">
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
							deployments of cellular IoT devices powered by Nordic hardware,
							demonstrating their diverse applications and capabilities to a
							global audience.
						</p>
						<p>
							We invite you to participate in this effort by adding your own
							devices to the map.
						</p>
					</section>
					<AddDeviceFlow />
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

const AddDeviceFlow = () => {
	const [shareDeviceRequest, setShareDeviceRequest] =
		createSignal<ShareDeviceRequest>()
	const [confirmed, setConfirmed] = createSignal<OwnershipConfirmed>()
	const location = useNavigation()
	const [credentials, setCredentials] = createSignal<DeviceCredentials>()
	return (
		<>
			<Show
				when={
					shareDeviceRequest() === undefined &&
					confirmed() === undefined &&
					credentials() === undefined
				}
			>
				<AddDeviceForm onRequest={setShareDeviceRequest} />
			</Show>
			<Show
				when={
					shareDeviceRequest() !== undefined &&
					confirmed() === undefined &&
					credentials() === undefined
				}
			>
				<section class="boxed pad add-device-flow">
					<header>
						<h2>Great!</h2>
					</header>
					<div class="pad-t">
						<p>A new device was registered.</p>
						<dl>
							<CopyableProp
								name={'Device ID'}
								value={shareDeviceRequest()!.deviceId}
							/>
							<CopyableProp
								name={'Public ID'}
								value={shareDeviceRequest()!.id}
							/>
						</dl>
					</div>
				</section>
				<ConfirmRequestForm
					request={shareDeviceRequest()!}
					onConfirmed={setConfirmed}
				/>
			</Show>
			<Show
				when={
					shareDeviceRequest() !== undefined &&
					confirmed() !== undefined &&
					credentials() === undefined
				}
			>
				<section class="boxed pad add-device-flow">
					<header>
						<h2>Awesome!</h2>
					</header>
					<div class="pad-t">
						<p>We will now show data sent by the device on the map.</p>
						<p>
							Here is a link to your device:{' '}
							<a href={location.link({ panel: `id:${confirmed()!.id}` })}>
								<code>{confirmed()!.id}</code>
							</a>
						</p>
					</div>
				</section>
				<CreateDeviceCredentialsForm
					device={shareDeviceRequest()!}
					onCredentials={setCredentials}
				/>
			</Show>
			<Show
				when={credentials() !== undefined && shareDeviceRequest() !== undefined}
			>
				<DescribeCredentials credentials={credentials()!} />
				<section>
					<DescribeConnectionSettings
						deviceId={shareDeviceRequest()!.deviceId}
					/>
				</section>
			</Show>
		</>
	)
}

const DescribeCredentials = (props: { credentials: DeviceCredentials }) => (
	<section class="boxed pad add-device-flow">
		<header>
			<h2>Fantastic!</h2>
		</header>
		<div class="pad-t">
			<p>Use these credentials to connect your device.</p>
			<dl>
				<For
					each={
						[
							['Private Key', props.credentials.credentials.privateKey],
							['Certificate', props.credentials.credentials.certificate],
						] as Array<[string, string]>
					}
				>
					{([k, v]) => <CopyableProp name={k} value={v} />}
				</For>
			</dl>
		</div>
	</section>
)
