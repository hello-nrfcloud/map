import { NordicHeader } from '#component/NordicHeader.tsx'
import { SidebarNav } from '#component/SidebarNav.tsx'
import { useUser } from '#context/User.tsx'
import { Card, CardBody, CardHeader } from '#dashboard/Card.tsx'
import { LogOut, MapApplication } from '#icons/LucideIcon.tsx'
import { Show } from 'solid-js'
import { LoginForm } from './forms/Login.tsx'

import './DashboardApp.css'

export const DashboardApp = () => {
	const { user, logout } = useUser()
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
					<button type="button" class="button" onClick={() => logout()}>
						<LogOut strokeWidth={2} />
					</button>
					<hr />
				</Show>
			</SidebarNav>
			<main>
				<Card>
					<CardHeader>
						<h1>Dashboard</h1>
						<Show when={user() !== undefined}>
							<p>Welcome {user()?.email}!</p>
						</Show>
					</CardHeader>
					<CardBody>
						<p>
							Welcome to the dashboard. Here you can view and manage your
							devices.
						</p>
						<Show when={user() === undefined}>
							<p>Get started by logging in with your email.</p>
							<LoginForm />
						</Show>
					</CardBody>
				</Card>
			</main>
		</div>
	)
}
