import { type ParentProps, Show } from 'solid-js'
import type { ShareDeviceRequest } from '@hello.nrfcloud.com/proto-map/api'
import { type Static } from '@sinclair/typebox'
import { CopyableProp } from '../CopyableProp.tsx'

export const ShareDeviceRequestCreated = (
	props: ParentProps<{
		shareDeviceRequest: Static<typeof ShareDeviceRequest>
		fromFingerprint?: boolean
	}>,
) => (
	<section class="boxed bg-light pad add-device-flow">
		<header>
			<Show
				when={props.fromFingerprint}
				fallback={<h2>A new device was registered.</h2>}
			>
				<h2>Your device was registered.</h2>
			</Show>
		</header>
		<div class="pad-t">
			<dl>
				<CopyableProp
					name={'Device ID'}
					value={props.shareDeviceRequest.deviceId}
				/>
				<CopyableProp
					name={'Public ID'}
					value={props.shareDeviceRequest.id}
					data-testId="device-id"
				/>
			</dl>
		</div>
	</section>
)
