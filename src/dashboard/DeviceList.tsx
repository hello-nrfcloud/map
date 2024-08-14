import { Problem } from '#component/notifications/Problem.tsx'
import { Progress } from '#component/notifications/Progress.tsx'
import { useParameters } from '#context/Parameters.tsx'
import { useUser } from '#context/User.tsx'
import { useViteEnv } from '#context/ViteEnv.tsx'
import { Card, CardBody, CardFooter, CardHeader } from '#dashboard/Card.tsx'
import { Checked, Failed, OK, Unchecked } from '#icons/LucideIcon.tsx'
import { extendDeviceSharing } from '#resources/extendDeviceSharing.ts'
import { listUserDevices } from '#resources/listUserDevices.ts'
import type { UserDevices } from '@hello.nrfcloud.com/proto-map/api'
import { type ModelID, models } from '@hello.nrfcloud.com/proto-map/models'
import type { Static } from '@sinclair/typebox'
import {
	For,
	Show,
	batch,
	createEffect,
	createResource,
	createSignal,
} from 'solid-js'

import './DeviceList.css'

export const DeviceList = () => {
	const { jwt } = useUser()
	const { apiURL } = useParameters()
	const [devicesRequest, { refetch }] = createResource(
		jwt,
		listUserDevices(apiURL),
	)
	const [checkAll, setCheckAll] = createSignal(false)
	const [checked, setChecked] = createSignal(new Set<string>())
	const [submit, setSubmit] = createSignal(false)
	const [updated, setUpdated] = createSignal(new Map<string, boolean>())
	const extend = extendDeviceSharing(apiURL)

	createEffect(() => {
		if (!checkAll()) {
			setChecked(new Set<string>())
		} else {
			setChecked(new Set(devicesRequest()!.devices.map((d) => d.id)))
		}
	})

	createEffect(() => {
		if (jwt() === undefined) return
		if (submit() !== true) return
		if (checked().size === 0) {
			// setSubmit(false)
			// refetch()
			return
		}

		const nextDevice = checked().values().next().value
		extend({ id: nextDevice, jwt: jwt()! })
			.then(() => {
				batch(() => {
					setChecked(new Set([...checked()].filter((id) => id !== nextDevice)))
					setUpdated(new Map([...updated(), [nextDevice, true]]))
				})
			})
			.catch((e) => {
				console.error('failed to extend', nextDevice, e)
				batch(() => {
					setChecked(new Set([...checked()].filter((id) => id !== nextDevice)))
					setUpdated(new Map([...updated(), [nextDevice, false]]))
				})
			})
	})

	return (
		<Card>
			<CardHeader>
				<h1>Your devices</h1>
				<p>
					To extend the time the device is visible on the map by 30 days select
					one or more devices below and click &quot;extend sharing&quot;.
				</p>
				<div class="one-line">
					<p>Click here to extend the sharing for all devices:</p>
					<Show when={submit() === false}>
						<button
							type="button"
							class="btn"
							onClick={() => {
								batch(() => {
									setCheckAll(true)
									setSubmit(true)
								})
							}}
						>
							extend all
						</button>
					</Show>
				</div>
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
					<Show
						when={submit() === false}
						fallback={
							<>
								<CardBody>
									<Show when={checked().size > 0}>
										<Progress
											class="gap-b"
											title={`Extending sharing (${updated().size}/${updated().size + checked().size}) ...`}
										/>
									</Show>
									<For each={[...updated()]}>
										{([id, success]) => (
											<p
												style={{
													display: 'flex',
													'align-items': 'center',
												}}
											>
												<Show
													when={success}
													fallback={
														<Failed
															strokeWidth={2}
															size={20}
															class="color-error gap-e-medium"
														/>
													}
												>
													<OK
														strokeWidth={2}
														size={20}
														class="color-success gap-e-medium"
													/>
												</Show>
												<code>
													{
														devicesRequest()!.devices.find(
															({ id: d }) => d === id,
														)!.id
													}
												</code>
											</p>
										)}
									</For>
									<For each={[...checked()]}>
										{(id) => (
											<p
												style={{
													display: 'flex',
													'align-items': 'center',
												}}
											>
												<Unchecked
													strokeWidth={1}
													size={20}
													class="gap-e-medium"
												/>
												<code>
													{
														devicesRequest()!.devices.find(
															({ id: d }) => d === id,
														)!.id
													}
												</code>
											</p>
										)}
									</For>
								</CardBody>
								<CardFooter>
									<button
										type="button"
										class="btn"
										onClick={() => {
											setSubmit(false)
											void refetch()
										}}
									>
										dismiss
									</button>
								</CardFooter>
							</>
						}
					>
						<table class="devices">
							<thead>
								<tr>
									<th>
										<button
											type="button"
											onClick={() => setCheckAll((c) => !c)}
											title="Select all devices"
										>
											<Show
												when={checkAll()}
												fallback={<Unchecked strokeWidth={1} size={20} />}
											>
												<Checked strokeWidth={1} size={20} />
											</Show>
										</button>
									</th>
									<th>
										ID
										<br />
										Model
									</th>
									<th>Expires</th>
								</tr>
							</thead>
							<tbody>
								<For each={devicesRequest()!.devices}>
									{(device) => (
										<ShowDevice
											device={device}
											checked={checked().has(device.id)}
											onCheck={() => {
												setChecked((c) =>
													c.has(device.id)
														? new Set([...c].filter((id) => id !== device.id))
														: new Set([...c, device.id]),
												)
											}}
										/>
									)}
								</For>
							</tbody>
						</table>
						<CardFooter>
							<Show
								when={checked().size > 0}
								fallback={
									<button type="button" class="btn" disabled>
										extend sharing
									</button>
								}
							>
								<button
									type="button"
									class="btn"
									onClick={() => {
										batch(() => {
											setSubmit(true)
											setUpdated(new Map<string, boolean>())
										})
									}}
								>
									extend sharing
								</button>
							</Show>
						</CardFooter>
					</Show>
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
	checked: boolean
	device: Static<(typeof UserDevices)['devices'][number]>
	onCheck: () => void
}) => {
	const model = models[props.device.model as ModelID]
	const { protoVersion } = useViteEnv()
	const exp = new Date(props.device.expires)
	return (
		<tr>
			<td>
				<button
					type="button"
					onClick={props.onCheck}
					title={`select ${props.device.id}`}
				>
					<Show
						when={props.checked}
						fallback={<Unchecked strokeWidth={1} size={20} />}
					>
						<Checked strokeWidth={1} size={20} />
					</Show>
				</button>
			</td>
			<td>
				<a
					href={`/map/dashboard/#device?${new URLSearchParams({ id: props.device.id }).toString()}`}
				>
					<code>{props.device.id}</code>
				</a>
				<br />
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
