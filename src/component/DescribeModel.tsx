import type { ModelID } from '@hello.nrfcloud.com/proto-map/models'
import { models } from '@hello.nrfcloud.com/proto-map/models'
import { useNavigation } from '../context/Navigation.js'
import { SearchTermType } from '../search.ts'
import { Documentation, Search, ViewSource } from '../icons/LucideIcon.js'
import { ToggleButton } from './ToggleButton.jsx'
import { CollapsibleMenu } from './CollapsibleMenu.js'
import { ResourcesDL } from './ResourcesDL.js'
import { WhenToggled } from './WhenToggled.jsx'

export const DescribeModel = (props: { model: ModelID }) => {
	const location = useNavigation()
	const model = models[props.model]
	return (
		<aside class="model-definition boxed">
			<header class="pad">
				<h3>
					<Documentation size={20} strokeWidth={1} />
					{model.about.title}
				</h3>
				<ToggleButton id="describe-model" />
			</header>
			<WhenToggled id="describe-model">
				<ResourcesDL class="pad bg-light">
					<dt>
						<span class="info">ID</span>
						<CollapsibleMenu class="meta">
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
								title={`Search for all ${model.about.title} devices`}
							>
								<Search strokeWidth={1} size={20} />
							</a>
						</CollapsibleMenu>
					</dt>
					<dd>
						<code>{props.model}</code>
					</dd>
					<dt>
						<span class="info">Description</span>
					</dt>
					<dd>{model.about.description}</dd>
					<dt>
						<span class="info">Source</span>
					</dt>
					<dd>
						<a
							href={`https://github.com/hello-nrfcloud/proto-map/tree/saga/models/${encodeURIComponent(props.model)}`}
							target="_blank"
							title="View source"
						>
							<ViewSource strokeWidth={1} size={20} />
							<code>{props.model}</code>
						</a>
					</dd>
				</ResourcesDL>
			</WhenToggled>
		</aside>
	)
}
