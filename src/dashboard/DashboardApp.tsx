import { NordicHeader } from '#component/NordicHeader.tsx'
import { SidebarNav } from '#component/SidebarNav.tsx'
import { useUser } from '#context/User.tsx'
import { Card, CardBody, CardHeader } from '#dashboard/Card.tsx'
import { Device } from '#icons/Device.tsx'
import { Add, LogOut, MapApplication } from '#icons/LucideIcon.tsx'
import { createEffect, createSignal, onCleanup, Show } from 'solid-js'
import { AddDevice } from './AddDevice.tsx'
import { DeviceList } from './DeviceList.tsx'
import { LoginForm } from './Login.tsx'

import './DashboardApp.css'

const panelFromLocation = () =>
	document.location.hash.slice(1)?.split('?')[0] ?? ''

export const DashboardApp = () => {
	const { user, logout } = useUser()
	const [panel, setPanel] = createSignal(panelFromLocation())

	const hashChange = () => {
		setPanel(panelFromLocation())
	}
	window.addEventListener('hashchange', hashChange)
	onCleanup(() => {
		window.removeEventListener('hashchange', hashChange)
	})

	// Remember deep links
	createEffect(() => {
		if (user() !== undefined) return
		if (panel() === '') return
		document.location.assign(
			`/map/dashboard/?${new URLSearchParams({ redirect: document.location.hash.slice(1) }).toString()}`,
		)
	})

	// Redirect to deep link
	createEffect(() => {
		if (user() === undefined) return
		const redirect = new URLSearchParams(document.location.search).get(
			'redirect',
		)
		if (redirect === null) return
		document.location.assign('/map/dashboard/#' + redirect)
	})

	return (
		<div id="layout">
			<NordicHeader />
			<SidebarNav>
				<a
					class="button"
					// eslint-disable-next-line no-restricted-globals
					href={new URL(BASE_URL, document.location.href).toString()}
					title="Back to the map"
				>
					<MapApplication strokeWidth={2} />
				</a>
				<hr />
				<Show when={user() !== undefined}>
					<a class="button" href="/map/dashboard/#devices">
						<Device class="logo" />
					</a>
					<hr />
					<a class="button" href="/map/dashboard/#add-device">
						<Add strokeWidth={2} />
					</a>
					<hr />
					<button
						type="button"
						class="button"
						onClick={() => {
							logout()
							document.location.assign('/map/dashboard/')
						}}
					>
						<LogOut strokeWidth={2} />
					</button>
					<hr />
				</Show>
			</SidebarNav>
			<main>
				<Show when={user() !== undefined} fallback={<Unauthenticated />}>
					<Show when={panel() === 'add-device'} fallback={<Home />}>
						<AddDevice />
					</Show>
				</Show>
			</main>
		</div>
	)
}

const Unauthenticated = () => (
	<Card>
		<CardHeader>
			<h1>Dashboard</h1>
		</CardHeader>
		<CardBody>
			<p>
				Welcome to the dashboard. Here you can view and manage your devices.
			</p>
			<hr />
			<p>Get started by logging in with your email.</p>
			<LoginForm />
		</CardBody>
	</Card>
)

const Home = () => {
	const { user } = useUser()
	return (
		<>
			<Card>
				<CardHeader>
					<h1>Dashboard</h1>
					<Show when={user() !== undefined}>
						<p>Welcome {user()?.email}!</p>
					</Show>
				</CardHeader>
				<CardBody>
					<p>
						Welcome to the dashboard. Here you can view and manage your devices.
					</p>
				</CardBody>
			</Card>
			<DeviceList />
		</>
	)
}
