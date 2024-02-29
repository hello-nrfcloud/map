import type { Device } from '../context/Devices.js'
import { useNavigation } from '../context/Navigation.js'
import { SearchTermType } from '../context/Search.js'
import { Documentation, Search, ViewSource } from '../icons/LucideIcon.js'
import { CollapseButton } from './CollapseButton.js'
import { CollapsibleMenu } from './CollapsibleMenu.js'
import { ResourcesDL } from './ResourcesDL.js'
import { createSignal, Show } from 'solid-js'

export const DescribeModel = (props: { device: Device }) => {
	const location = useNavigation()
	const [expanded, setExpanded] = createSignal<boolean>(false)
	return (
		<aside class="model-definition boxed">
			<header class="rounded-footer">
				<h3>
					<Documentation size={20} strokeWidth={1} />
					Model definition
				</h3>
				<CollapseButton expanded={expanded} setExpanded={setExpanded} />
			</header>
			<Show when={expanded()}>
				<ResourcesDL class="pad">
					<dt>
						<span class="info">Model</span>
						<CollapsibleMenu>
							<span class="meta">
								<nav>
									<a
										href={location.link({
											panel: 'search',
											search: [
												{
													type: SearchTermType.Model,
													term: props.device.model,
												},
											],
										})}
										title={`Search for all devices with model ${props.device.model}`}
									>
										<Search strokeWidth={1} size={20} />
									</a>
								</nav>
							</span>
						</CollapsibleMenu>
					</dt>
					<dd>{props.device.model}</dd>
					<dt>
						<span class="info">Source</span>
					</dt>
					<dd>
						<a
							href={`https://github.com/hello-nrfcloud/proto-lwm2m/tree/saga/models/${encodeURIComponent(props.device.model)}`}
							target="_blank"
							title="View source"
						>
							<ViewSource strokeWidth={1} size={20} />
							<code>{props.device.model}</code>
						</a>
					</dd>
				</ResourcesDL>
			</Show>
		</aside>
	)
}
