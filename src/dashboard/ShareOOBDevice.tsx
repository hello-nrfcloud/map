import { ModelInfoBlock } from '#component/ModelInfoBlock.tsx'
import { Problem } from '#component/notifications/Problem.tsx'
import { Progress } from '#component/notifications/Progress.tsx'
import { Success } from '#component/notifications/Success.tsx'
import { ResourcesDL } from '#component/ResourcesDL.tsx'
import { useParameters } from '#context/Parameters.tsx'
import { useUser } from '#context/User.tsx'
import { fetchOOBDeviceInfo } from '#resources/fetchOOBDeviceInfo.ts'
import { shareDevice } from '#resources/shareDevice.ts'
import { models, type ModelID } from '@hello.nrfcloud.com/proto-map/models'
import type { DeviceIdentity } from '@hello.nrfcloud.com/proto/hello'
import type { Static } from '@sinclair/typebox'
import { Show, createResource, createSignal } from 'solid-js'
import { Card, CardBody, CardFooter, CardHeader } from './Card.tsx'
import { CopyableProp } from './CopyableProp.tsx'

export const ShareOOBDevice = (props: {
	model: string
	fingerprint: string
}) => {
	const parameters = useParameters()
	const [deviceInfoRequest] = createResource(
		() => props.fingerprint,
		fetchOOBDeviceInfo(parameters.helloApiURL),
	)
	const modelValid = () => Object.keys(models).includes(props.model as ModelID)

	return (
		<Card>
			<CardHeader>
				<h1>Share device</h1>
			</CardHeader>
			<Show when={modelValid()} fallback={<InvalidModel model={props.model} />}>
				<Show
					when={
						!deviceInfoRequest.loading &&
						deviceInfoRequest.error === undefined &&
						deviceInfoRequest() !== undefined
					}
				>
					<DoShare
						device={deviceInfoRequest()!}
						fingerprint={props.fingerprint}
						model={props.model as ModelID}
					/>
				</Show>
				<Show when={deviceInfoRequest.loading}>
					<CardBody>
						<Progress class="gap-t" title="Fetching device info ..." />
					</CardBody>
				</Show>
				<Show
					when={
						!deviceInfoRequest.loading && deviceInfoRequest.error !== undefined
					}
				>
					<CardBody>
						<Problem class="gap-t" problem={deviceInfoRequest.error} />
					</CardBody>
				</Show>
			</Show>
		</Card>
	)
}

const ShareInfo = (props: { device: Static<typeof DeviceIdentity> }) => (
	<section>
		<p>
			You're about to make your device <code>{props.device.id}</code> publicly
			available on{' '}
			<a href="/map" target="_blank">
				the map
			</a>
			.
		</p>
		<ResourcesDL>
			<CopyableProp
				name={'Device ID'}
				value={props.device.id}
				data-testId="device-deviceId"
			/>
			<CopyableProp
				name={'Model'}
				value={props.device.model}
				data-testId="device-model"
			/>
		</ResourcesDL>
		<p>
			Most of the devices on the map are owned and operated by our customers to
			demonstrate their diverse applications and capabilities to a global
			audience.
		</p>
		<p>
			Sharing your devices makes the data public for 30 days. After that you
			have to reconfirm the sharing setting.
		</p>
	</section>
)

const InvalidModel = (props: { model: string }) => (
	<>
		<Problem
			problem={{
				title: 'Invalid model',
				detail: `The model "${props.model}" is not a valid model.`,
			}}
		/>
		<p class="gap-t">
			It's seems you've used an outdated link that points to an unsupported
			model.
		</p>
		<ModelInfoBlock />
	</>
)

const DoShare = (props: {
	fingerprint: string
	model: ModelID
	device: Static<typeof DeviceIdentity>
}) => {
	const parameters = useParameters()
	const { jwt } = useUser()
	const [share, setShare] = createSignal(false)
	const [shareDeviceRequest] = createResource(() => {
		if (!share()) return
		if (jwt() === undefined) return
		return {
			model: props.model,
			fingerprint: props.fingerprint,
			jwt: jwt()!,
		}
	}, shareDevice(parameters.apiURL))

	return (
		<>
			<CardBody>
				<ShareInfo device={props.device} />
				<Show
					when={
						!shareDeviceRequest.loading &&
						shareDeviceRequest.error === undefined &&
						shareDeviceRequest() !== undefined
					}
				>
					<Success>
						<h2>We will now show data sent by the device on the map!</h2>
						<p>
							<a href={`/map/#id:${shareDeviceRequest()!.id}`}>
								Here is a link to your device{' '}
								<code>{shareDeviceRequest()!.id}</code>
							</a>
						</p>
					</Success>
					<div class="pad-t">
						<ResourcesDL>
							<CopyableProp
								name={'Public ID'}
								value={shareDeviceRequest()!.id}
								data-testId="device-id"
							/>
						</ResourcesDL>
					</div>
				</Show>
				<Show when={shareDeviceRequest.loading}>
					<Progress class="gap-t" title="Sharing ..." />
				</Show>
				<Show
					when={
						!shareDeviceRequest.loading &&
						shareDeviceRequest.error !== undefined
					}
				>
					<Problem class="gap-t" problem={shareDeviceRequest.error} />
				</Show>
			</CardBody>
			<CardFooter>
				<button
					class="btn btn-primary"
					onClick={() => setShare(true)}
					disabled={shareDeviceRequest.loading}
				>
					share device
				</button>
			</CardFooter>
		</>
	)
}
