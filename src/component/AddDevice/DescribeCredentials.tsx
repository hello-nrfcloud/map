import { For } from 'solid-js'
import { CopyableProp } from '../CopyableProp.js'
import type { Static } from '@sinclair/typebox'
import type { DeviceCredentials } from '@hello.nrfcloud.com/proto-map/api'

export const DescribeCredentials = (props: {
	credentials: Static<typeof DeviceCredentials>
}) => (
	<section class="boxed bg-light pad add-device-flow">
		<header>
			<h2>Fantastic!</h2>
		</header>
		<div class="pad-t">
			<p>Use these credentials to connect your device.</p>
			<dl>
				<For
					each={
						[
							['Private Key', props.credentials.credentials.privateKey],
							['Certificate', props.credentials.credentials.certificate],
						] as Array<[string, string]>
					}
				>
					{([k, v]) => <CopyableProp name={k} value={v} />}
				</For>
			</dl>
		</div>
	</section>
)
