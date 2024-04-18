import { Show, createEffect, createSignal, createResource } from 'solid-js'
import { noop } from '../../util/noop.js'
import { useParameters } from '../../context/Parameters.js'
import { confirmRequest } from '../../resources/confirmRequest.js'
import type {
	ShareDeviceOwnershipConfirmed,
	ShareDeviceRequest,
} from '@hello.nrfcloud.com/proto-map/api'
import type { Static } from '@sinclair/typebox'

export const ConfirmRequestForm = (props: {
	request: Static<typeof ShareDeviceRequest>
	onConfirmed: (
		confirmation: Static<typeof ShareDeviceOwnershipConfirmed>,
	) => void
}) => {
	let codeInput!: HTMLInputElement

	const params = useParameters()
	const [token, setToken] = createSignal<string>()
	const [requestConfirmed] = createResource(
		token,
		confirmRequest(params.confirmOwnershipAPIURL, props.request),
	)

	const submit = () => {
		const code = codeInput.value
		if (!isToken(code)) return
		setToken(code)
	}

	createEffect(() => {
		if (requestConfirmed() === undefined) return
		props.onConfirmed(requestConfirmed()!)
	})

	return (
		<section class="boxed bg-light pad add-device-flow">
			<p>
				Before your device's data can be published, you need to confirm your
				email address.
			</p>
			<form onSubmit={noop} class="pad-t">
				<div class="row">
					<label for="code">
						Please enter the code you have received via email:
					</label>
					<input
						id="code"
						minLength={6}
						maxLength={6}
						type="text"
						placeholder='e.g. "GABQ6H"'
						ref={codeInput}
						pattern="^[ABCDEFGHIJKMNPQRSTUVWXYZ23456789]{6}$"
					/>
				</div>
				<footer>
					<Show
						when={!requestConfirmed.loading}
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
	)
}
const isToken = (s?: string) =>
	/^[ABCDEFGHIJKMNPQRSTUVWXYZ23456789]{6}$/i.test(s ?? '')
