import { Problem } from '#component/notifications/Problem.tsx'
import { Progress } from '#component/notifications/Progress.tsx'
import { ResourcesDL } from '#component/ResourcesDL.tsx'
import { useParameters } from '#context/Parameters.tsx'
import { useUser } from '#context/User.tsx'
import { useViteEnv } from '#context/ViteEnv.tsx'
import { extendDeviceSharing } from '#resources/extendDeviceSharing.ts'
import { listUserDevices } from '#resources/listUserDevices.ts'
import { type ModelID, models } from '@hello.nrfcloud.com/proto-map/models'
import {
	createEffect,
	createResource,
	createSignal,
	Match,
	Show,
	Switch,
} from 'solid-js'
import { Card, CardBody, CardHeader } from './Card.tsx'
import { CopyableProp } from './CopyableProp.tsx'

const f = new Intl.DateTimeFormat(undefined, {
	dateStyle: 'short',
	timeStyle: 'short',
})

const formatAsDate = (d: Date) => f.format(d)

export const ShowDevice = () => {
	const { protoVersion } = useViteEnv()
	const deviceId = new URLSearchParams(
		document.location.hash.slice(1).split('?')[1],
	).get('id')
	const { jwt } = useUser()
	const { apiURL } = useParameters()
	const [devicesRequest] = createResource(jwt, listUserDevices(apiURL))

	const deviceInfo = () => {
		const device = devicesRequest()?.devices.find((d) => d.id === deviceId)
		if (device === undefined) return undefined
		return {
			...device,
			model: models[device.model as ModelID],
		}
	}

	return (
		<Card>
			<CardHeader>
				<h1>{deviceId}</h1>
			</CardHeader>
			<CardBody>
				<Show when={deviceInfo() !== undefined}>
					<ResourcesDL>
						<dt>Public ID</dt>
						<dd class="pad-b pad-t">
							<a href={`/map/#id:${deviceInfo()!.id}`}>
								<code>{deviceInfo()!.id}</code>
							</a>
						</dd>
						<CopyableProp name="Device ID" value={deviceInfo()!.deviceId} />
						<dt>Model</dt>
						<dd class="pad-b pad-t">
							<a
								href={`https://github.com/hello-nrfcloud/proto-map/tree/${protoVersion}/models/${deviceInfo()!.model.id}`}
								target="_blank"
							>
								{deviceInfo()!.model.about.title}
							</a>
						</dd>
						<dt>Sharing expires</dt>
						<dd class="pad-b pad-t">
							<ExtendSharing
								id={deviceInfo()!.id}
								expires={new Date(deviceInfo()!.expires)}
							/>
						</dd>
					</ResourcesDL>
				</Show>
				<Show
					when={
						!devicesRequest.loading &&
						devicesRequest.error !== undefined &&
						deviceInfo() === undefined
					}
				>
					<Problem
						class="gap-t"
						problem={{
							title: `Device ${deviceId} not found`,
						}}
					/>
				</Show>
				<Show when={devicesRequest.loading}>
					<Progress class="gap-t" title="Loading ..." />
				</Show>
				<Show
					when={!devicesRequest.loading && devicesRequest.error !== undefined}
				>
					<Problem class="gap-t" problem={devicesRequest.error} />
				</Show>
			</CardBody>
		</Card>
	)
}

const ExtendSharing = (props: { id: string; expires: Date }) => {
	const [extend, setExtend] = createSignal(false)
	const [currentExpires, setExpires] = createSignal(props.expires)
	const { jwt } = useUser()
	const { apiURL } = useParameters()
	const [extendRequest, { refetch }] = createResource(() => {
		if (!extend()) return undefined
		return {
			id: props.id,
			jwt: jwt()!,
		}
	}, extendDeviceSharing(apiURL))

	createEffect(() => {
		if (extendRequest.loading) return
		if (extendRequest.state !== 'ready') return
		setExpires(new Date(Date.now() + 1000 * 60 * 60 * 24 * 30))
	})

	return (
		<>
			<time datetime={currentExpires().toISOString()}>
				{formatAsDate(currentExpires())}
			</time>
			<Switch
				fallback={
					<button
						type="button"
						class="btn"
						onClick={() => {
							if (extend() === true) {
								void refetch()
							}
							setExtend(true)
						}}
					>
						extend sharing
					</button>
				}
			>
				<Match when={extendRequest.loading}>
					<button type="button" class="btn" disabled>
						extending ...
					</button>
				</Match>
				<Match
					when={!extendRequest.loading && extendRequest.error !== undefined}
				>
					<Problem class="gap-t" problem={extendRequest.error} />
				</Match>
			</Switch>
		</>
	)
}
