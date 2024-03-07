import { Show, createEffect, createSignal, createResource } from 'solid-js'
import { noop } from '../../util/noop.js'
import { useParameters } from '../../context/Parameters.js'
import type { ShareDeviceRequest } from './AddDeviceForm.js'

export type OwnershipConfirmed = {
	'@context': 'https://github.com/hello-nrfcloud/proto/map/share-device-ownership-confirmed'
	// Public ID
	id: string // e.g. "driveway-addition-fecifork"
}
const confirmRequest =
	(url: URL, request: ShareDeviceRequest) =>
	async (token: string): Promise<OwnershipConfirmed> => {
		try {
			return (
				await fetch(url, {
					method: 'POST',
					body: JSON.stringify({ deviceId: request.deviceId, token }),
				})
			).json()
		} catch (err) {
			throw new Error(
				`Failed to confirm sharing request for a device (${url.toString()}): ${(err as Error).message}!`,
			)
		}
	}
export const ConfirmRequestForm = (props: {
	request: ShareDeviceRequest
	onConfirmed: (confirmation: OwnershipConfirmed) => void
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
		<section class="boxed pad light add-device-flow">
			<p>
				Before you can generate device credentials, you need to confirm your
				email address.
			</p>
			<form onSubmit={noop}>
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