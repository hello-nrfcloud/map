import { models } from '@hello.nrfcloud.com/proto-lwm2m'
import { isModel } from '../../context/Navigation.js'
import { Show, For, createEffect, createSignal, createResource } from 'solid-js'
import { InfoBlock } from '../InfoBlock.js'
import { noop } from '../../util/noop.js'
import { useParameters } from '../../context/Parameters.js'
import {
	type ShareDeviceRequest,
	type AddModelRequest,
	addModel,
} from '../../resources/addModel.js'

const isEmail = (s?: string) => /.+@.+/.test(s ?? '')

export const AddDeviceForm = (props: {
	onRequest: (request: ShareDeviceRequest) => void
}) => {
	let emailInput!: HTMLInputElement
	let modelSelect!: HTMLSelectElement

	const params = useParameters()
	const [createRequest, setRequest] = createSignal<AddModelRequest>()
	const [shareDeviceRequest] = createResource(
		createRequest,
		addModel(params.shareAPIURL),
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
					<InfoBlock title={<h3>Known models ({PROTO_LWM2M_VERSION})</h3>}>
						<div class="about add-device-flow">
							<p>
								All devices must use a well-known model definition. Below is a
								list of defined models.
							</p>
							<p>
								If your model is not available to select, you can add it by
								creating a PR against{' '}
								<a
									href={`https://github.com/hello-nrfcloud/proto-lwm2m/tree/${PROTO_LWM2M_VERSION}/models`}
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
