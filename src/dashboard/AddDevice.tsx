import { CreateDevice } from '#dashboard/CreateDevice.tsx'
import { ShareOOBDevice } from '#dashboard/ShareOOBDevice.tsx'
import { createSignal, onCleanup, Show } from 'solid-js'

const queryFromHash = () =>
	new URLSearchParams(document.location.hash.slice(1).split('?')[1])

export const AddDevice = () => {
	const [query, setQuery] = createSignal(queryFromHash())

	const hashChange = () => {
		setQuery(queryFromHash())
	}
	window.addEventListener('hashchange', hashChange)
	onCleanup(() => {
		window.removeEventListener('hashchange', hashChange)
	})

	const oobDeviceDetails = () => {
		const fingerprint = query().get('fingerprint')
		const model = query().get('model')

		if (fingerprint === null || model === null) {
			return null
		}
		return { fingerprint, model }
	}

	return (
		<Show when={oobDeviceDetails() !== null} fallback={<CreateDevice />}>
			<ShareOOBDevice
				fingerprint={oobDeviceDetails()!.fingerprint}
				model={oobDeviceDetails()!.model}
			/>
		</Show>
	)
}
