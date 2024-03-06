import { ModelID, models } from '@hello.nrfcloud.com/proto-lwm2m'
import { isModel } from '../../context/Navigation.js'
import { Show, For, createEffect, createSignal, createResource } from 'solid-js'
import { InfoBlock } from '../InfoBlock.js'
import { DescribeModel } from '../DescribeModel.js'
import { noop } from '../../util/noop.js'
import { useParameters } from '../../context/Parameters.js'

const isEmail = (s?: string) => /.+@.+/.test(s ?? '')

type AddModelRequest = {
	email: string
	model: ModelID
}
export type ShareDeviceRequest = {
	'@context': 'https://github.com/hello-nrfcloud/proto/map/share-device-request'
	// This is the public ID, as it will appear on the map
	id: string // e.g. 'driveway-addition-fecifork'

	// This is the secret device ID, which will be used by the device to connect
	deviceId: string // 'map-6ba03279-2d08-4a3c-bb05-1a88889465af'
}
const addModel =
	(url: URL) =>
	async ({ email, model }: AddModelRequest): Promise<ShareDeviceRequest> => {
		try {
			return (
				await fetch(url, {
					method: 'POST',
					body: JSON.stringify({ email, model }),
				})
			).json()
		} catch (err) {
			throw new Error(
				`Failed to add a device (${url.toString()}): ${(err as Error).message}!`,
			)
		}
	}
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
			<section class="boxed pad light add-device-flow">
				<form onSubmit={noop}>
					<div class="row">
						<label for="model">Select your model:</label>
						<select id="model" ref={modelSelect}>
							<For each={Object.values(models)}>
								{(model) => <option value={model.id}>{model.id}</option>}
							</For>
						</select>
					</div>
					<div class="row">
						<label for="email">Provide your email:</label>
						<input
							id="email"
							type="email"
							placeholder='e.g. "alex@example.com'
							ref={emailInput}
						/>
					</div>
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
			<section class="add-device-flow">
				<InfoBlock title="Why we need your email">
					<p>
						Sharing cannot be done anonymously, and therefore you need to
						provide a valid email in order to activate sharing for your device.
					</p>
					<p>
						We will use your email only for contacting you about the devices you
						have shared.
					</p>
					<p>
						Every 30 days you need to confirm that you wish to continue sharing
						this device. Otherwise the device and all its public history will be
						deleted.
					</p>
					<p>You can revoke the sharing of the device at any time.</p>
				</InfoBlock>
			</section>
			<section class="known-models add-device-flow">
				<InfoBlock title="Known models">
					<div class="about pad-b">
						<p>
							All devices must use a well-known model definition. Below is a
							list of defined models.
						</p>
						<p>
							If your model is not listed, you can add it by creating a PR
							against{' '}
							<a
								href="https://github.com/hello-nrfcloud/proto-lwm2m/tree/saga/models"
								target="_blank"
							>
								our protocol repository
							</a>
							.
						</p>
					</div>
					<For each={Object.values(models)}>
						{(model) => <DescribeModel model={model.id} />}
					</For>
				</InfoBlock>
			</section>
		</>
	)
}
