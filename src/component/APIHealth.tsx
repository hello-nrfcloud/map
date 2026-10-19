import { Show, createSignal, onCleanup } from 'solid-js'

import { NoConnection } from '#icons/LucideIcon.tsx'
import './APIHealth.css'

export const APIHealth = () => {
	const [apiHealthy, setApiHealthy] = createSignal<boolean>(true)

	const checkConnection = async () => {
		try {
			const res = await fetch(new URL('./health', API_URL))
			setApiHealthy(res.ok)
		} catch (err) {
			console.error(`[APIHealth] Failed to connect to API!`)
			console.error(err)
			setApiHealthy(false)
		}
	}

	void checkConnection()
	const i = setInterval(checkConnection, 60 * 1000)

	onCleanup(() => {
		clearInterval(i)
	})

	return (
		<Show when={!apiHealthy()}>
			<aside id="api-health-warning">
				<NoConnection />
				<strong>Not connected!</strong>
			</aside>
		</Show>
	)
}
