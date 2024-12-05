import { Problem } from '#component/notifications/Problem.tsx'
import { Progress } from '#component/notifications/Progress.tsx'
import { ResourcesDL } from '#component/ResourcesDL.tsx'
import { useParameters } from '#context/Parameters.tsx'
import { useUser } from '#context/User.tsx'
import { useViteEnv } from '#context/ViteEnv.tsx'
import { extendDeviceSharing } from '#resources/extendDeviceSharing.ts'
import { listUserDevices } from '#resources/listUserDevices.ts'
import { stopDeviceSharing } from '#resources/stopDeviceSharing.ts'
import { type ModelID, models } from '@hello.nrfcloud.com/proto-map/models'
import {
	createEffect,
	createResource,
	createSignal,
	Match,
	Show,
	Switch,
} from 'solid-js'
import { Card, CardBody, CardFooter, CardHeader } from './Card.tsx'
import { CopyableProp } from './CopyableProp.tsx'

const f = new Intl.DateTimeFormat(undefined, {
	dateStyle: 'short',
	timeStyle: 'short',
})

const formatAsDate = (d: Date) => f.format(d)

import { Success } from '#component/notifications/Success.tsx'
import { Checked, Unchecked } from '#icons/LucideIcon.tsx'
import './ShowDevice.css'

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
						<dt>Public until</dt>
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
				<Show
					when={
						!devicesRequest.loading &&
						devicesRequest.error === undefined &&
						deviceInfo() === undefined
					}
				>
					<Problem
						problem={{
							status: 404,
							title: `Device ${deviceId} not found!`,
						}}
					/>
				</Show>
			</CardBody>
			<Show when={deviceInfo() !== undefined}>
				<CardFooter class="stop-sharing">
					<StopSharing id={deviceId!} />
				</CardFooter>
			</Show>
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
						extend publication for 30 days
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

const StopSharing = (props: { id: string }) => {
	const [stop, setStopped] = createSignal(false)
	const [unlocked, setUnlocked] = createSignal(false)
	const { jwt } = useUser()
	const { apiURL } = useParameters()
	const [stopRequest] = createResource(() => {
		if (!stop()) return undefined
		return {
			id: props.id,
			jwt: jwt()!,
		}
	}, stopDeviceSharing(apiURL))

	createEffect(() => {
		if (stopRequest.loading) return
		if (stopRequest.state !== 'ready') return
		setStopped(true)
	})

	return (
		<>
			<p>
				You can stop the publication of this device at any time. If you stop the
				publication, the device will no longer be visible on the map. You can
				start the publication again at any time. It may take a few minutes for
				the device to disappear from the map.
			</p>
			<p class="confirm">
				<button
					class="pad-e"
					type="button"
					onClick={() => setUnlocked((l) => !l)}
				>
					<Show
						when={unlocked()}
						fallback={<Unchecked strokeWidth={1} size={20} />}
					>
						<Checked strokeWidth={1} size={20} />
					</Show>
					Yes, I want to stop the publication of this device.
				</button>
				<Show
					when={unlocked()}
					fallback={
						<Show
							when={!stopRequest.loading}
							fallback={
								<button type="button" class="btn" disabled>
									stopping ...
								</button>
							}
						>
							<button type="button" class="btn" disabled>
								stop publication
							</button>
						</Show>
					}
				>
					<button
						type="button"
						class="btn"
						onClick={() => {
							setStopped(true)
						}}
					>
						stop publication
					</button>
				</Show>
			</p>
			<Switch>
				<Match when={!stopRequest.loading && stopRequest.error !== undefined}>
					<Problem class="gap-t" problem={stopRequest.error} />
				</Match>
				<Match when={!stopRequest.loading && stopRequest.state === 'ready'}>
					<Success>The publication of this device has been stopped.</Success>
				</Match>
			</Switch>
		</>
	)
}
