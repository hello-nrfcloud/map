import { ModelID, models } from '@hello.nrfcloud.com/proto-lwm2m'
import { useNavigation } from '../context/Navigation.js'
import { SearchTermType } from '../context/Search.js'
import { Documentation, Search, ViewSource } from '../icons/LucideIcon.js'
import { CollapseButton } from './CollapseButton.js'
import { CollapsibleMenu } from './CollapsibleMenu.js'
import { ResourcesDL } from './ResourcesDL.js'
import { createSignal, Show } from 'solid-js'

export const DescribeModel = (props: { model: ModelID }) => {
	const location = useNavigation()
	const [expanded, setExpanded] = createSignal<boolean>(false)
	return (
		<aside class="model-definition">
			<div>
				<header class="rounded-header">
					<h3>
						<Documentation size={20} strokeWidth={1} />
						{props.model}
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
														term: props.model,
													},
												],
											})}
											title={`Search for all devices with model ${props.model}`}
										>
											<Search strokeWidth={1} size={20} />
										</a>
									</nav>
								</span>
							</CollapsibleMenu>
						</dt>
						<dd>{models[props.model as ModelID].about.title}</dd>
						<dt>
							<span class="info">Description</span>
						</dt>
						<dd>{models[props.model as ModelID].about.description}</dd>
						<dt>
							<span class="info">Source</span>
						</dt>
						<dd>
							<a
								href={`https://github.com/hello-nrfcloud/proto-lwm2m/tree/saga/models/${encodeURIComponent(props.model)}`}
								target="_blank"
								title="View source"
							>
								<ViewSource strokeWidth={1} size={20} />
								<code>{props.model}</code>
							</a>
						</dd>
					</ResourcesDL>
				</Show>
			</div>
		</aside>
	)
}
