import { models } from '@hello.nrfcloud.com/proto-map/models'
import type { ShareDeviceRequest } from '@hello.nrfcloud.com/proto-map/api'
import type { Static } from '@sinclair/typebox'
import { For, createSignal } from 'solid-js'
import { noop } from '../../util/noop.js'
import { EmailInput } from './EmailInput.js'
import { ModelInfoBlock } from './ModelInfoBlock.js'
import { ShareDeviceSubmit } from './ShareDeviceSubmit.js'

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
							{(model) => <option value={model.id}>{model.about.title}</option>}
						</For>
					</select>
				</div>
				<ModelInfoBlock />
				<EmailInput onUpdate={setEmail} />
				<ShareDeviceSubmit
					email={email()}
					model={models[modelSelect.value as keyof typeof models]}
					onRequest={props.onRequest}
				/>
			</form>
		</section>
	)
}
