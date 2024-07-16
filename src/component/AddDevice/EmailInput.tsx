import type { ParentProps } from 'solid-js'
import { InfoBlock } from '../InfoBlock.js'

const isEmail = (s?: string) => /.+@.+/.test(s ?? '')

export const EmailInput = (
	props: ParentProps<{ onUpdate: (email: string) => void }>,
) => {
	let emailInput!: HTMLInputElement
	return (
		<>
			<div class="row">
				<label for="email">Please provide your email:</label>
				<input
					id="email"
					type="email"
					placeholder='e.g. "alex@example.com'
					ref={emailInput}
					onBlur={() => {
						if (!isEmail(emailInput.value)) return
						props.onUpdate(emailInput.value)
					}}
				/>
			</div>
			<InfoBlock title={<h3>Why we need your email</h3>}>
				<p>
					Sharing cannot be done anonymously, and therefore you need to provide
					a valid email in order to activate sharing for your device.
				</p>
				<p>
					We will use your email only for contacting you about the devices you
					have shared.
				</p>
				<p>
					Every 30 days you need to confirm that you wish to continue sharing
					this device. Otherwise the device and all its public history will be
					deleted.
				</p>
				<p>You can revoke the sharing of the device at any time.</p>
			</InfoBlock>
		</>
	)
}
