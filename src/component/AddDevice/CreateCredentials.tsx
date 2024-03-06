import { Show, createEffect, createResource, createSignal } from 'solid-js'
import { useParameters } from '../../context/Parameters.js'
import { noop } from '../../util/noop.js'

export type DeviceCredentials = {
	'@context': 'https://github.com/hello-nrfcloud/proto/map/device-credentials'
	credentials: {
		privateKey: string
		certificate: string
	}
}

const createCredentials =
	(url: URL, device: { deviceId: string }) =>
	async (): Promise<DeviceCredentials> => {
		try {
			return (
				await fetch(url, {
					method: 'POST',
					body: JSON.stringify({ deviceId: device.deviceId }),
				})
			).json()
		} catch (err) {
			throw new Error(
				`Failed to confirm sharing request for a device (${url.toString()}): ${(err as Error).message}!`,
			)
		}
	}

export const CreateDeviceCredentialsForm = (props: {
	device: { deviceId: string }
	onCredentials: (credentials: DeviceCredentials) => void
}) => {
	const parameters = useParameters()
	const [doCreate, setDoCreate] = createSignal<boolean>(false)
	const [credentials] = createResource(
		doCreate,
		createCredentials(parameters.createCredentialsAPIURL, props.device),
	)

	createEffect(() => {
		if (credentials() === undefined) return
		props.onCredentials(credentials()!)
	})

	return (
		<section class="boxed pad light add-device-flow">
			<p>
				In order for your device to be able to publish data, you need to
				credentials.
			</p>
			<form onSubmit={noop}>
				<footer>
					<Show
						when={!credentials.loading}
						fallback={
							<button type="button" class="btn" disabled>
								Loading ...
							</button>
						}
					>
						<button type="button" class="btn" onClick={() => setDoCreate(true)}>
							create credentials
						</button>
					</Show>
				</footer>
			</form>
		</section>
	)
}
