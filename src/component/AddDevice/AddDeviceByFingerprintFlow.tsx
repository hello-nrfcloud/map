import type {
	ShareDeviceOwnershipConfirmed,
	ShareDeviceRequest,
} from '@hello.nrfcloud.com/proto-map/api'
import type { Model } from '@hello.nrfcloud.com/proto-map/models'
import { DeviceIdentity, typedFetch } from '@hello.nrfcloud.com/proto/hello'
import type { Static } from '@sinclair/typebox'
import { type ParentProps, Show, createResource, createSignal } from 'solid-js'
import { useParameters } from '../../context/Parameters.tsx'
import { noop } from '../../util/noop.ts'
import { Problem, ProblemDetailError } from '../Problem.tsx'
import { Progress } from '../Progress.tsx'
import { ConfirmRequestForm } from './ConfirmRequestForm.tsx'
import { EmailInput } from './EmailInput.tsx'
import { ModelInfoBlock } from './ModelInfoBlock.tsx'
import { ShareDeviceRequestConfirmed } from './ShareDeviceRequestConfirmed.tsx'
import { ShareDeviceRequestCreated } from './ShareDeviceRequestCreated.tsx'
import { ShareDeviceSubmit } from './ShareDeviceSubmit.tsx'

const deviceInfoFetcher = typedFetch({
	responseBodySchema: DeviceIdentity,
})

const fetchDeviceInfo =
	(
		apiURL: URL,
		fingerprint: string,
	): (() => Promise<Static<typeof DeviceIdentity> | undefined>) =>
	async () => {
		const res = await deviceInfoFetcher(
			new URL(
				`./device?${new URLSearchParams({ fingerprint }).toString()}`,
				apiURL,
			),
		)
		if ('error' in res) {
			console.error(res.error)
			throw new ProblemDetailError(res.error)
		}
		return res.result
	}

export const AddDeviceByFingerprintFlow = (
	props: ParentProps<{
		fingerprint: string
		model: Model
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
					model={props.model}
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
		model: Model
		onRequest: (request: Static<typeof ShareDeviceRequest>) => void
	}>,
) => {
	const parameters = useParameters()
	const [deviceInfo] = createResource<
		Static<typeof DeviceIdentity> | undefined
	>(fetchDeviceInfo(parameters.helloApiURL, props.fingerprint))
	const [email, setEmail] = createSignal<string>()

	return (
		<div class="pad">
			<Show when={deviceInfo.loading}>
				<Progress title={`Fetching device...`} />
			</Show>
			<Show when={deviceInfo.error}>
				<Problem problem={deviceInfo.error} />
			</Show>
			<Show
				when={
					!deviceInfo.loading &&
					deviceInfo.error === undefined &&
					deviceInfo() !== undefined
				}
			>
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
								{props.model.about.title} (
								<code data-testId="device-model">{props.model.id}</code>)
							</p>
						</div>
						<ModelInfoBlock />
						<EmailInput onUpdate={setEmail} />
						<ShareDeviceSubmit
							onRequest={props.onRequest}
							fingerprint={props.fingerprint}
							email={email()}
							model={props.model}
						/>
					</form>
				</section>
			</Show>
		</div>
	)
}
