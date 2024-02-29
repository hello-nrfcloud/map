import {
	type LwM2MObjectInstance,
	definitions,
	LwM2MObjectID,
} from '@hello.nrfcloud.com/proto-lwm2m'
import { createSignal, Show } from 'solid-js'
import { Documentation, Search, ViewSource } from '../../icons/LucideIcon.js'
import { ResourcesDL } from '../ResourcesDL.js'
import { SearchTermType } from '../../context/Search.js'
import { useNavigation } from '../../context/Navigation.js'
import { CollapsibleMenu } from '../CollapsibleMenu.js'
import { CollapseButton } from '../CollapseButton.jsx'

import './DescribeObject.css'

export const DescribeObject = (props: { instance: LwM2MObjectInstance }) => {
	const location = useNavigation()
	const definition = definitions[props.instance.ObjectID as LwM2MObjectID]
	const [expanded, setExpanded] = createSignal<boolean>(false)

	return (
		<aside class="object-definition">
			<header class="rounded-footer">
				<h3>
					<Documentation size={20} strokeWidth={1} />
					LwM2M Object definition
				</h3>
				<CollapseButton expanded={expanded} setExpanded={setExpanded} />
			</header>
			<Show when={expanded()}>
				<ResourcesDL>
					<dt>
						<span class="info">ObjectID</span>
						<CollapsibleMenu>
							<span class="meta">
								<nav>
									<a
										href={location.link({
											panel: 'search',
											search: [
												{
													type: SearchTermType.Has,
													term: definition.ObjectID.toString(),
												},
											],
										})}
										title={`Search for devices that have the object ${definition.ObjectID}`}
									>
										<Search strokeWidth={1} size={20} />
									</a>
								</nav>
							</span>
						</CollapsibleMenu>
					</dt>
					<dd>{definition.ObjectID}</dd>
					<dt>
						<span class="info">Description</span>
					</dt>
					<dd>{definition.Description}</dd>
					<dt>
						<span class="info">Version</span>
					</dt>
					<dd>{definition.ObjectVersion}</dd>
					<dt>
						<span class="info">Source</span>
					</dt>
					<dd>
						<a
							href={`https://github.com/hello-nrfcloud/proto-lwm2m/blob/saga/lwm2m/${definition.ObjectID}.xml`}
							target="_blank"
							title="View source"
						>
							<ViewSource strokeWidth={1} size={20} />
							<code>{definition.ObjectID}.xml</code>
						</a>
					</dd>
				</ResourcesDL>
			</Show>
		</aside>
	)
}
