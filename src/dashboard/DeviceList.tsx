import { Problem } from '#component/notifications/Problem.tsx'
import { Progress } from '#component/notifications/Progress.tsx'
import { useParameters } from '#context/Parameters.tsx'
import { useUser } from '#context/User.tsx'
import { useViteEnv } from '#context/ViteEnv.tsx'
import { Card, CardBody, CardHeader } from '#dashboard/Card.tsx'
import { listUserDevices } from '#resources/listUserDevices.ts'
import type { UserDevices } from '@hello.nrfcloud.com/proto-map/api'
import { type ModelID, models } from '@hello.nrfcloud.com/proto-map/models'
import type { Static } from '@sinclair/typebox'
import { For, Show, createResource } from 'solid-js'

import './DeviceList.css'

export const DeviceList = () => {
	const { jwt } = useUser()
	const { apiURL } = useParameters()
	const [devicesRequest] = createResource(jwt, listUserDevices(apiURL))

	return (
		<Card>
			<CardHeader>
				<h1>Your devices</h1>
			</CardHeader>
			<Show
				when={
					!devicesRequest.loading &&
					devicesRequest.error === undefined &&
					devicesRequest() !== undefined
				}
			>
				<Show
					when={devicesRequest()!.devices.length > 0}
					fallback={
						<CardBody>
							<p>You currently have no devices.</p>
							<p>
								<a href="/map/dashboard/#add-device">Add a new device.</a>
							</p>
						</CardBody>
					}
				>
					<table class="devices">
						<thead>
							<tr>
								<th>ID</th>
								<th>Model</th>
								<th>Expires</th>
							</tr>
						</thead>
						<tbody>
							<For each={devicesRequest()!.devices}>
								{(device) => <ShowDevice device={device} />}
							</For>
						</tbody>
					</table>
				</Show>
			</Show>
			<Show when={devicesRequest.loading}>
				<CardBody>
					<Progress class="gap-t" title="Loading ..." />
				</CardBody>
			</Show>
			<Show
				when={!devicesRequest.loading && devicesRequest.error !== undefined}
			>
				<CardBody>
					<Problem class="gap-t" problem={devicesRequest.error} />
				</CardBody>
			</Show>
		</Card>
	)
}

const distanceInDays = (d: Date) =>
	Math.floor((d.getTime() - Date.now()) / 1000 / 60 / 60 / 24)

export const ShowDevice = (props: {
	device: Static<(typeof UserDevices)['devices'][number]>
}) => {
	const model = models[props.device.model as ModelID]
	const { protoVersion } = useViteEnv()
	const exp = new Date(props.device.expires)
	return (
		<tr>
			<td>
				<a href={`/map/#id:${props.device.id}`} target="_blank">
					<code>{props.device.id}</code>
				</a>
			</td>
			<td>
				<a
					href={`https://github.com/hello-nrfcloud/proto-map/tree/${protoVersion}/models/${model.id}`}
					target="_blank"
				>
					{model.about.title}
				</a>
			</td>
			<td>
				in <time dateTime={exp.toISOString()}>{distanceInDays(exp)} days</time>
			</td>
		</tr>
	)
}
