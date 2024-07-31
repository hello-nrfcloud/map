import { useNavigation } from '../context/Navigation.js'
import { Close, Add } from '../icons/LucideIcon.js'
import { SidebarContent } from './Sidebar/SidebarContent.js'
import { Show } from 'solid-js'
import { AddCustomDeviceFlow } from './AddDevice/AddCustomDeviceFlow.js'
import { AddDeviceByFingerprintFlow } from './AddDevice/AddDeviceByFingerprintFlow.js'
import {
	type ModelID,
	models,
	type Model,
} from '@hello.nrfcloud.com/proto-map/models'

import './AddDevice.css'
import { Problem } from './Problem.js'
import { ModelInfoBlock } from './AddDevice/ModelInfoBlock.js'
import { panelId as ProtocolPanelId } from './Protocol.tsx'

export const panelId = 'add-device'

export const Sidebar = () => {
	const location = useNavigation()
	const fingerprint = () => location.current().query?.get('fingerprint')
	const modelParam = () => location.current().query?.get('model')
	const hasModelParam = () => modelParam() !== undefined
	const model = (): Model | undefined => {
		const modelId = Object.keys(models).find(
			(modelId) => modelId === modelParam(),
		) as ModelID | undefined
		return models[modelId!]
	}
	return (
		<Show when={location.current().panel === panelId}>
			<SidebarContent class="add-device" id={panelId}>
				<header>
					<h1>Add your device</h1>
					<a href={location.linkToHome()} class="close">
						<Close size={20} />
					</a>
				</header>
				<div class="scrollable">
					<section class="separator">
						<p>
							<code>hello.nrfcloud.com/map</code> is made to showcase real-world
							deployments of cellular IoT devices powered by Nordic
							Semiconductor hardware, demonstrating their diverse applications
							and capabilities to a global audience.
						</p>
						<p>
							We invite you to participate in this effort by adding your own
							devices to the map.
						</p>
						<p>
							After registering your device, you will have the necessary device
							credentials to start publishing data. Please refer to the{' '}
							<a href={location.link({ panel: ProtocolPanelId })}>
								protocol definition
							</a>{' '}
							for more information.
						</p>
					</section>
					<Show when={hasModelParam()}>
						<Show
							when={model() !== undefined}
							fallback={
								<section>
									<Show
										when={modelParam() !== null}
										fallback={
											<Problem
												problem={{
													title: `No model ID provided.`,
												}}
											/>
										}
									>
										<Problem
											problem={{
												title: `The provided model ID "${modelParam()}" is not valid.`,
											}}
										/>
										<ModelInfoBlock />
									</Show>
								</section>
							}
						>
							<AddDeviceByFingerprintFlow
								fingerprint={fingerprint()!}
								model={model()!}
							/>
						</Show>
					</Show>
					<Show when={!hasModelParam()}>
						<AddCustomDeviceFlow />
					</Show>
				</div>
			</SidebarContent>
		</Show>
	)
}

export const SidebarButton = () => {
	const location = useNavigation()

	return (
		<>
			<Show
				when={location.current().panel === panelId}
				fallback={
					<a class="button" href={location.link({ panel: panelId })}>
						<Add strokeWidth={2} />
					</a>
				}
			>
				<a class="button active" href={location.linkToHome()}>
					<Add strokeWidth={2} />
				</a>
			</Show>
			<hr />
		</>
	)
}
