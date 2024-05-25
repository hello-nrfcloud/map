import { Show, createSignal } from 'solid-js'
import { AddDeviceForm } from './AddDeviceForm.tsx'
import type {
	ShareDeviceOwnershipConfirmed,
	ShareDeviceRequest,
} from '@hello.nrfcloud.com/proto-map/api'
import { ConfirmRequestForm } from './ConfirmRequestForm.tsx'
import { type Static } from '@sinclair/typebox'
import { CreateDeviceCredentialsForm } from './CreateCredentials.tsx'
import { type DeviceCredentials } from '../../resources/createCredentials.ts'
import { DescribeConnectionSettings } from '../DescribeConnectionSettings.tsx'
import { DescribeCredentials } from './DescribeCredentials.tsx'
import { ShareDeviceRequestCreated } from './ShareDeviceRequestCreated.tsx'
import { ShareDeviceRequestConfirmed } from './ShareDeviceRequestConfirmed.tsx'

export const AddCustomDeviceFlow = () => {
	const [shareDeviceRequest, setShareDeviceRequest] =
		createSignal<Static<typeof ShareDeviceRequest>>()
	const [confirmed, setConfirmed] =
		createSignal<Static<typeof ShareDeviceOwnershipConfirmed>>()
	const [credentials, setCredentials] = createSignal<DeviceCredentials>()

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
