import { NordicHeader } from '#component/NordicHeader.tsx'
import { MapApplication } from '#icons/LucideIcon.tsx'
import { SidebarNav } from '#component/SidebarNav.tsx'
import { Card, CardHeader, CardBody } from '#dashboard/Card.tsx'

import './DashboardApp.css'

export const DashboardApp = () => {
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
			</SidebarNav>
			<main>
				<Card>
					<CardHeader>
						<h1>Dashboard</h1>
					</CardHeader>
					<CardBody>
						<p>
							Welcome to the dashboard. Here you can view and manage your
							devices.
						</p>
					</CardBody>
				</Card>
			</main>
		</div>
	)
}
