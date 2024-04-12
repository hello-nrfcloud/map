import { models } from '@hello.nrfcloud.com/proto-map'
import { isModel } from '../../util/isModel.ts'
import { Show, For, createEffect, createSignal, createResource } from 'solid-js'
import { InfoBlock } from '../InfoBlock.js'
import { noop } from '../../util/noop.js'
import { useParameters } from '../../context/Parameters.js'
import {
	type ShareDeviceRequest,
	type ShareDevice,
	shareDevice,
} from '../../resources/shareDevice.ts'
import { useViteEnv } from '../../context/ViteEnv.tsx'

const isEmail = (s?: string) => /.+@.+/.test(s ?? '')

export const AddDeviceForm = (props: {
	onRequest: (request: ShareDeviceRequest) => void
}) => {
	const { protoVersion } = useViteEnv()
	let emailInput!: HTMLInputElement
	let modelSelect!: HTMLSelectElement

	const params = useParameters()
	const [createRequest, setRequest] = createSignal<ShareDevice>()
	const [shareDeviceRequest] = createResource(
		createRequest,
		shareDevice(params.shareAPIURL),
	)

	const submit = () => {
		const email = emailInput.value
		const model = modelSelect.value
		if (!isEmail(email)) return
		if (!isModel(model)) return
		setRequest({
			email,
			model,
		})
	}

	createEffect(() => {
		if (shareDeviceRequest() === undefined) return
		props.onRequest(shareDeviceRequest()!)
	})

	return (
		<>
			<section class="boxed bg-light pad add-device-flow">
				<form onSubmit={noop}>
					<div class="row">
						<label for="model">Select your model:</label>
						<select id="model" ref={modelSelect}>
							<For each={Object.values(models)}>
								{(model) => <option value={model.id}>{model.id}</option>}
							</For>
						</select>
					</div>
					<InfoBlock title={<h3>Known models ({protoVersion})</h3>}>
						<div class="about add-device-flow">
							<p>
								All devices must use a well-known model definition. Below is a
								list of defined models.
							</p>
							<p>
								If your model is not available to select, you can add it by
								creating a PR against{' '}
								<a
									href={`https://github.com/hello-nrfcloud/proto-map/tree/${protoVersion}/models`}
									target="_blank"
								>
									our protocol repository
								</a>
								.
							</p>
						</div>
					</InfoBlock>
					<div class="row">
						<label for="email">Provide your email:</label>
						<input
							id="email"
							type="email"
							placeholder='e.g. "alex@example.com'
							ref={emailInput}
						/>
					</div>
					<InfoBlock title={<h3>Why we need your email</h3>}>
						<p>
							Sharing cannot be done anonymously, and therefore you need to
							provide a valid email in order to activate sharing for your
							device.
						</p>
						<p>
							We will use your email only for contacting you about the devices
							you have shared.
						</p>
						<p>
							Every 30 days you need to confirm that you wish to continue
							sharing this device. Otherwise the device and all its public
							history will be deleted.
						</p>
						<p>You can revoke the sharing of the device at any time.</p>
					</InfoBlock>
					<footer>
						<Show
							when={!shareDeviceRequest.loading}
							fallback={
								<button type="button" class="btn" disabled>
									Loading ...
								</button>
							}
						>
							<button type="button" class="btn" onClick={() => submit()}>
								continue
							</button>
						</Show>
					</footer>
				</form>
			</section>
		</>
	)
}
