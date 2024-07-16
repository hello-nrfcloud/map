import type { ShareDeviceRequest } from '@hello.nrfcloud.com/proto-map/api'
import type { Model } from '@hello.nrfcloud.com/proto-map/models'
import type { Static } from '@sinclair/typebox'
import {
	Show,
	createEffect,
	createResource,
	createSignal,
	type ParentProps,
} from 'solid-js'
import { useParameters } from '../../context/Parameters.js'
import { shareDevice, type ShareDevice } from '../../resources/shareDevice.ts'
import { Problem } from '../Problem.tsx'

export const ShareDeviceSubmit = (
	props: ParentProps<{
		email?: string
		model: Model
		fingerprint?: string
		onRequest: (request: Static<typeof ShareDeviceRequest>) => void
	}>,
) => {
	const params = useParameters()
	const [createRequest, setRequest] = createSignal<ShareDevice>()
	const [shareDeviceRequest] = createResource(
		createRequest,
		shareDevice(params.shareAPIURL),
	)

	const submit = () => {
		if (props.email === undefined) return
		setRequest({
			email: props.email,
			fingerprint: props.fingerprint,
			model: props.model.id,
		})
	}

	createEffect(() => {
		if (shareDeviceRequest() === undefined) return
		if (shareDeviceRequest.error !== undefined) return
		if (shareDeviceRequest.loading) return
		console.log('ShareDeviceSubmit', shareDeviceRequest())
		props.onRequest(shareDeviceRequest()!)
	})

	return (
		<footer>
			<Show
				when={
					!shareDeviceRequest.loading &&
					shareDeviceRequest.error === undefined &&
					shareDeviceRequest() === undefined
				}
			>
				<button
					type="button"
					class="btn"
					onClick={() => submit()}
					disabled={props.email === undefined}
				>
					continue
				</button>
			</Show>
			<Show when={shareDeviceRequest.loading}>
				<button type="button" class="btn" disabled>
					Loading ...
				</button>
			</Show>
			<Show when={shareDeviceRequest.error}>
				<Problem problem={shareDeviceRequest.error} />
			</Show>
		</footer>
	)
}
