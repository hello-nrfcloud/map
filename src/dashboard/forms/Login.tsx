import { InfoBlock } from '#component/InfoBlock.js'
import { Problem } from '#component/notifications/Problem.tsx'
import { Progress } from '#component/notifications/Progress.tsx'
import { Success } from '#component/notifications/Success.tsx'
import { useParameters } from '#context/Parameters.tsx'
import { useUser } from '#context/User.tsx'
import { requestJWT } from '#resources/requestJWT.ts'
import { requestToken } from '#resources/requestToken.ts'
import { noop } from '#util/noop.ts'
import { createEffect, createResource, createSignal, Show } from 'solid-js'

const isEmail = (s?: string): s is string => /^.+@.+\..+$/.test(s ?? '')
const isToken = (s?: string): s is string => /^[A-Z0-9]{6}$/.test(s ?? '')

export const LoginForm = () => {
	let emailInput!: HTMLInputElement
	let tokenInput!: HTMLInputElement
	const [email, setEmail] = createSignal<string | undefined>()
	const [submit, setSubmit] = createSignal(false)
	const [token, setToken] = createSignal<string | undefined>()
	const { apiURL } = useParameters()
	const [tokenRequest, { refetch: resendTokenRequest }] = createResource(
		() => submit() && email(),
		requestToken(apiURL),
	)
	const [jwtRequest, { refetch: resendLoginRequest }] = createResource(() => {
		const e = email()
		const t = token()
		if (e === undefined || t === undefined) return undefined
		return {
			email: e,
			token: t,
		}
	}, requestJWT(apiURL))
	const { setUserJWT } = useUser()

	createEffect(() => {
		if (jwtRequest() !== undefined) {
			setUserJWT(jwtRequest()!)
		}
	})

	return (
		<form onsubmit={noop}>
			<div class="row">
				<label for="email">Please provide your email:</label>
				<div class="one-line">
					<input
						id="email"
						type="email"
						placeholder='e.g. "alex@example.com"'
						ref={emailInput}
						onInput={() => {
							setEmail(emailInput.value)
							setSubmit(false)
						}}
					/>
					<button
						class="btn"
						type="button"
						onClick={() => {
							setToken(undefined)
							if (!submit()) {
								setSubmit(true)
							} else {
								void resendTokenRequest()
							}
						}}
						disabled={tokenRequest.loading || !isEmail(email())}
					>
						send confirmation token
					</button>
				</div>
			</div>
			<Show
				when={
					!tokenRequest.loading &&
					tokenRequest.error === undefined &&
					tokenRequest() !== undefined
				}
			>
				<Success class="gap-t">Please check your inbox!</Success>
			</Show>
			<Show when={tokenRequest.loading}>
				<Progress class="gap-t" title="Sending ..." />
			</Show>
			<Show when={!tokenRequest.loading && tokenRequest.error !== undefined}>
				<Problem class="gap-t" problem={tokenRequest.error} />
			</Show>
			<InfoBlock title={<h3>Why we need your email</h3>}>
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
			<div class="row">
				<label for="token">
					Please enter the token you have received in your mailbox:
				</label>
				<div class="one-line">
					<input
						id="token"
						type="string"
						placeholder='e.g. "3S5N7Q"'
						ref={tokenInput}
						onInput={() => {
							setToken(tokenInput.value)
						}}
						maxLength={6}
						minLength={6}
						pattern="[A-Z0-9]{6}"
					/>
					<button
						class="btn"
						type="button"
						disabled={!isToken(token())}
						onClick={() => {
							void resendLoginRequest()
						}}
					>
						log in
					</button>
				</div>
			</div>
			<Show
				when={
					!jwtRequest.loading &&
					jwtRequest.error === undefined &&
					jwtRequest() !== undefined
				}
			>
				<Success class="gap-t">Welcome!</Success>
			</Show>
			<Show when={jwtRequest.loading}>
				<Progress class="gap-t" title="Sending ..." />
			</Show>
			<Show when={!jwtRequest.loading && jwtRequest.error !== undefined}>
				<Problem class="gap-t" problem={jwtRequest.error} />
			</Show>
		</form>
	)
}
