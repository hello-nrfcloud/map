import { ModelInfoBlock } from '#component/ModelInfoBlock.tsx'
import { Problem } from '#component/notifications/Problem.tsx'
import { Progress } from '#component/notifications/Progress.tsx'
import { Success } from '#component/notifications/Success.tsx'
import { ResourcesDL } from '#component/ResourcesDL.tsx'
import { useParameters } from '#context/Parameters.tsx'
import { useUser } from '#context/User.tsx'
import { createDevice } from '#resources/createDevice.ts'
import type { DeviceCredentials } from '@hello.nrfcloud.com/proto-map/api'
import { type ModelID, models } from '@hello.nrfcloud.com/proto-map/models'
import type { Static } from '@sinclair/typebox'
import { createEffect, createResource, createSignal, For, Show } from 'solid-js'
import { Card, CardBody, CardFooter, CardHeader } from './Card.tsx'
import { CopyableProp } from './CopyableProp.tsx'
import { DescribeConnectionSettings } from './DescribeConnectionSettings.tsx'

const download = async (blob: Blob, filename: string) => {
	const file = new File([await blob.arrayBuffer()], filename)
	const link = document.createElement('a')
	link.style.display = 'none'
	link.href = URL.createObjectURL(file)
	link.download = file.name

	document.body.appendChild(link)
	link.click()

	setTimeout(() => {
		URL.revokeObjectURL(link.href)
		link.parentNode?.removeChild(link)
	}, 0)
}

const downloadCredentials = (credentials: Static<typeof DeviceCredentials>) => {
	download(
		new Blob(
			[
				JSON.stringify(
					{
						clientId: credentials.deviceId,
						privateKey: credentials.credentials.privateKey,
						certificate: credentials.credentials.certificate,
					},
					null,
					2,
				),
			],
			{
				type: 'application/json',
			},
		),
		`${credentials.deviceId}.json`,
	).catch(console.error)
}

export const CreateDevice = () => {
	const [model, selectModel] = createSignal<ModelID>()
	const { apiURL } = useParameters()
	const { jwt } = useUser()
	const [submit, setSubmit] = createSignal(false)
	const [deviceRequest, { refetch: resendRequest }] = createResource(() => {
		if (!submit()) return
		if (model() === undefined) return
		if (jwt() === undefined) return
		return { model: model()!, jwt: jwt()! }
	}, createDevice(apiURL))

	createEffect(() => {
		if (deviceRequest() === undefined) return
		downloadCredentials(deviceRequest()!)
	})

	return (
		<>
			<Card>
				<CardHeader>
					<h1>Add device</h1>
				</CardHeader>
				<CardBody>
					<div class="row">
						<label for="model">Select your model:</label>
						<For each={Object.values(models)}>
							{({ id, about }) => (
								<label
									onClick={() => {
										selectModel(id)
									}}
									style={{ cursor: 'pointer' }}
								>
									<Show
										when={model() === id}
										fallback={
											<input type="radio" name="model" value={id} id={id} />
										}
									>
										<input
											type="radio"
											name="model"
											id={id}
											value={id}
											checked
										/>
									</Show>{' '}
									{about.title} (<code>{id}</code>)
								</label>
							)}
						</For>
					</div>
					<ModelInfoBlock />
					<Show
						when={
							!deviceRequest.loading &&
							deviceRequest.error === undefined &&
							deviceRequest() !== undefined
						}
					>
						<Success class="gap-t">
							Great! Make sure you have saved the private key and certificate!
						</Success>
					</Show>
					<Show when={deviceRequest.loading}>
						<Progress class="gap-t" title="Sending ..." />
					</Show>
					<Show
						when={!deviceRequest.loading && deviceRequest.error !== undefined}
					>
						<Problem class="gap-t" problem={deviceRequest.error} />
					</Show>
				</CardBody>
				<CardFooter>
					<button
						type="button"
						class="btn"
						onClick={() => {
							if (!submit()) {
								setSubmit(true)
							} else {
								void resendRequest()
							}
						}}
						disabled={
							model() === undefined ||
							deviceRequest.loading ||
							deviceRequest() !== undefined
						}
					>
						create
					</button>
				</CardFooter>
			</Card>
			<Show when={deviceRequest() !== undefined}>
				<Card>
					<CardHeader>
						<h1>{deviceRequest()!.id}</h1>
					</CardHeader>
					<CardBody>
						<p>Use these credentials to connect your device.</p>
						<ResourcesDL>
							<For
								each={
									[
										['Private Key', deviceRequest()!.credentials.privateKey],
										['Certificate', deviceRequest()!.credentials.certificate],
									] as Array<[string, string]>
								}
							>
								{([k, v]) => <CopyableProp name={k} value={v} />}
							</For>
						</ResourcesDL>
						<DescribeConnectionSettings
							class="pad-t"
							deviceId={deviceRequest()!.deviceId}
						/>
					</CardBody>
					<CardFooter>
						<button
							type="button"
							class="btn"
							onClick={() => {
								downloadCredentials(deviceRequest()!)
							}}
						>
							download credentials
						</button>
					</CardFooter>
				</Card>
			</Show>
		</>
	)
}
