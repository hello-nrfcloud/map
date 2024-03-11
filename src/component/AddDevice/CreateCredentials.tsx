import { Show, createEffect, createResource, createSignal } from 'solid-js'
import { useParameters } from '../../context/Parameters.js'
import { noop } from '../../util/noop.js'
import {
	type DeviceCredentials,
	createCredentials,
} from '../../resources/createCredentials.js'

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
			<form onSubmit={noop} class="pad-t">
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
