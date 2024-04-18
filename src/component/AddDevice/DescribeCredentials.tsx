import { For } from 'solid-js'
import { type DeviceCredentials } from '../../resources/createCredentials.ts'
import { CopyableProp } from '../CopyableProp.tsx'

export const DescribeCredentials = (props: {
	credentials: DeviceCredentials
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
