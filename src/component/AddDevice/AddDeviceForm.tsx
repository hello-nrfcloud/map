import { models } from '@hello.nrfcloud.com/proto-map'
import type { ShareDeviceRequest } from '@hello.nrfcloud.com/proto-map/api'
import type { Static } from '@sinclair/typebox'
import { For, createSignal } from 'solid-js'
import { noop } from '../../util/noop.js'
import { EmailInput } from './EmailInput.tsx'
import { ModelInfoBlock } from './ModelInfoBlock.tsx'
import { ShareDeviceSubmit } from './ShareDeviceSubmit.tsx'

export const AddDeviceForm = (props: {
	onRequest: (request: Static<typeof ShareDeviceRequest>) => void
}) => {
	let modelSelect!: HTMLSelectElement
	const [email, setEmail] = createSignal<string>()
	return (
		<section class="boxed bg-light pad add-device-flow">
			<form onSubmit={noop}>
				<div class="row">
					<label for="model">Select your model:</label>
					<select id="model" ref={modelSelect}>
						<For each={Object.values(models)}>
							{(model) => <option value={model.id}>{model.id}</option>}
						</For>
					</select>
				</div>
				<ModelInfoBlock />
				<EmailInput onUpdate={setEmail} />
				<ShareDeviceSubmit
					email={email()}
					model={modelSelect.value as keyof typeof models}
					onRequest={props.onRequest}
				/>
			</form>
		</section>
	)
}
