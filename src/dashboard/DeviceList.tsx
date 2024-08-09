import { Card, CardBody, CardHeader } from '#dashboard/Card.tsx'

export const DeviceList = () => {
	return (
		<Card>
			<CardHeader>
				<h1>Your devices</h1>
			</CardHeader>
			<CardBody>
				<p>You currently have no devices.</p>
				<p>
					<a href="/map/dashboard/#add-device">Add a new device.</a>
				</p>
			</CardBody>
		</Card>
	)
}
