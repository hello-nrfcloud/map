import { Show, createSignal } from 'solid-js'
import { AddDeviceForm } from './AddDeviceForm.js'
import type {
	DeviceCredentials,
	ShareDeviceOwnershipConfirmed,
	ShareDeviceRequest,
} from '@hello.nrfcloud.com/proto-map/api'
import { ConfirmRequestForm } from './ConfirmRequestForm.js'
import { type Static } from '@sinclair/typebox'
import { CreateDeviceCredentialsForm } from './CreateCredentials.js'
import { DescribeConnectionSettings } from '../DescribeConnectionSettings.js'
import { DescribeCredentials } from './DescribeCredentials.js'
import { ShareDeviceRequestCreated } from './ShareDeviceRequestCreated.js'
import { ShareDeviceRequestConfirmed } from './ShareDeviceRequestConfirmed.js'

export const AddCustomDeviceFlow = () => {
	const [shareDeviceRequest, setShareDeviceRequest] =
		createSignal<Static<typeof ShareDeviceRequest>>()
	const [confirmed, setConfirmed] =
		createSignal<Static<typeof ShareDeviceOwnershipConfirmed>>()
	const [credentials, setCredentials] =
		createSignal<Static<typeof DeviceCredentials>>()

	return (
		<>
			<Show
				when={
					shareDeviceRequest() === undefined &&
					confirmed() === undefined &&
					credentials() === undefined
				}
			>
				<AddDeviceForm onRequest={setShareDeviceRequest} />
			</Show>
			<Show
				when={
					shareDeviceRequest() !== undefined &&
					confirmed() === undefined &&
					credentials() === undefined
				}
			>
				<ShareDeviceRequestCreated shareDeviceRequest={shareDeviceRequest()!} />
				<ConfirmRequestForm
					request={shareDeviceRequest()!}
					onConfirmed={setConfirmed}
				/>
			</Show>
			<Show
				when={
					shareDeviceRequest() !== undefined &&
					confirmed() !== undefined &&
					credentials() === undefined
				}
			>
				<ShareDeviceRequestConfirmed confirmed={confirmed()!} />
				<CreateDeviceCredentialsForm
					device={shareDeviceRequest()!}
					onCredentials={setCredentials}
				/>
			</Show>
			<Show
				when={credentials() !== undefined && shareDeviceRequest() !== undefined}
			>
				<DescribeCredentials credentials={credentials()!} />
				<section>
					<DescribeConnectionSettings
						deviceId={shareDeviceRequest()!.deviceId}
					/>
				</section>
			</Show>
		</>
	)
}
