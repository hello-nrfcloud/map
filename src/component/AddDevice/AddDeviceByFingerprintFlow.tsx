import { DeviceIdentity, typedFetch } from '@hello.nrfcloud.com/proto/hello'
import type { Static } from '@sinclair/typebox'
import { type ParentProps, createSignal, Show, createResource } from 'solid-js'
import { useParameters } from '../../context/Parameters.tsx'
import { Progress } from '../Progress.tsx'
import { Problem } from '../Problem.tsx'
import { noop } from '../../util/noop.ts'
import { ModelInfoBlock } from './ModelInfoBlock.tsx'
import { EmailInput } from './EmailInput.tsx'
import { ShareDeviceSubmit } from './ShareDeviceSubmit.tsx'
import type {
	ShareDeviceOwnershipConfirmed,
	ShareDeviceRequest,
} from '@hello.nrfcloud.com/proto-map/api'
import { ShareDeviceRequestCreated } from './ShareDeviceRequestCreated.tsx'
import { ConfirmRequestForm } from './ConfirmRequestForm.tsx'
import { ShareDeviceRequestConfirmed } from './ShareDeviceRequestConfirmed.tsx'

const fetchDeviceInfo = (
	apiURL: URL,
	fingerprint: string,
): (() => Promise<Static<typeof DeviceIdentity>>) => {
	const deviceInfoFetcher = typedFetch({
		responseBodySchema: DeviceIdentity,
	})
	return async () => {
		const res = await deviceInfoFetcher(
			new URL(
				`./device?${new URLSearchParams({ fingerprint }).toString()}`,
				apiURL,
			),
		)
		if ('error' in res) {
			console.error(res.error)
			throw new Error(res.error.title)
		}
		return res.result
	}
}

export const AddDeviceByFingerprintFlow = (
	props: ParentProps<{
		fingerprint: string
	}>,
) => {
	const [shareDeviceRequest, setShareDeviceRequest] =
		createSignal<Static<typeof ShareDeviceRequest>>()
	const [confirmed, setConfirmed] =
		createSignal<Static<typeof ShareDeviceOwnershipConfirmed>>()

	return (
		<>
			<Show
				when={shareDeviceRequest() === undefined && confirmed() === undefined}
			>
				<AddDeviceByFingerprintForm
					fingerprint={props.fingerprint}
					onRequest={setShareDeviceRequest}
				/>
			</Show>
			<Show
				when={shareDeviceRequest() !== undefined && confirmed() === undefined}
			>
				<ShareDeviceRequestCreated
					shareDeviceRequest={shareDeviceRequest()!}
					fromFingerprint
				/>
				<ConfirmRequestForm
					request={shareDeviceRequest()!}
					onConfirmed={setConfirmed}
				/>
			</Show>
			<Show
				when={shareDeviceRequest() !== undefined && confirmed() !== undefined}
			>
				<ShareDeviceRequestConfirmed confirmed={confirmed()!} />
			</Show>
		</>
	)
}

export const AddDeviceByFingerprintForm = (
	props: ParentProps<{
		fingerprint: string
		onRequest: (request: Static<typeof ShareDeviceRequest>) => void
	}>,
) => {
	const parameters = useParameters()
	const [deviceInfo] = createResource<Static<typeof DeviceIdentity>>(
		fetchDeviceInfo(parameters.helloApiURL, props.fingerprint),
	)
	const [email, setEmail] = createSignal<string>()

	return (
		<div class="pad">
			<Show when={deviceInfo.loading}>
				<Progress title={`Fetching device...`} />
			</Show>
			<Show when={deviceInfo.error}>
				<Problem
					problem={{
						title: `Failed to fetch device information for fingerprint ${props.fingerprint}!`,
					}}
				/>
			</Show>
			<Show when={deviceInfo() !== undefined}>
				<section class="boxed bg-light pad add-device-flow">
					<form onSubmit={noop}>
						<div class="row">
							<p class="label">
								<span>Device ID:</span>
								<br />
								<code data-testId="device-deviceId">{deviceInfo()!.id}</code>
							</p>
							<p class="label">
								<span>Your model:</span>
								<br />
								<code data-testId="device-model">{deviceInfo()!.model}</code>
							</p>
						</div>
						<ModelInfoBlock />
						<EmailInput onUpdate={setEmail} />
						<ShareDeviceSubmit
							onRequest={props.onRequest}
							fingerprint={props.fingerprint}
							email={email()}
						/>
					</form>
				</section>
			</Show>
		</div>
	)
}
