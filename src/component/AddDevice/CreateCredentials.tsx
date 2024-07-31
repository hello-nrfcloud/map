import { Show, createEffect, createResource, createSignal } from 'solid-js'
import { useParameters } from '../../context/Parameters.js'
import { noop } from '../../util/noop.js'
import { createCredentials } from '../../resources/createCredentials.js'
import type { DeviceCredentials } from '@hello.nrfcloud.com/proto-map/api'
import type { Static } from '@sinclair/typebox'
import { Problem } from '../Problem.tsx'

export const CreateDeviceCredentialsForm = (props: {
	device: { deviceId: string }
	onCredentials: (credentials: Static<typeof DeviceCredentials>) => void
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
		<section class="boxed bg-light pad add-device-flow">
			<p>
				In order for your device to be able to publish data, you need to
				credentials.
			</p>
			<form onSubmit={noop} class="pad-t">
				<footer>
					<Show when={credentials.loading}>
						<button type="button" class="btn" disabled>
							Loading ...
						</button>
					</Show>
					<Show when={credentials.error !== undefined}>
						<Problem problem={credentials.error} />
					</Show>
					<Show when={!credentials.loading && credentials() === undefined}>
						<button type="button" class="btn" onClick={() => setDoCreate(true)}>
							create credentials
						</button>
					</Show>
				</footer>
			</form>
		</section>
	)
}
