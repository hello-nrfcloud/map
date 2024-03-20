import {
	definitions,
	type LwM2MObjectInstance,
} from '@hello.nrfcloud.com/proto-map'
import { useNavigation } from '../../context/Navigation.js'
import { SearchTermType } from '../../search.ts'
import { Documentation, Search, ViewSource } from '../../icons/LucideIcon.js'
import { ToggleButton } from '../ToggleButton.jsx'
import { CollapsibleMenu } from '../CollapsibleMenu.js'
import { ResourcesDL } from '../ResourcesDL.js'
import { WhenToggled } from '../WhenToggled.jsx'

export const DescribeObject = (props: { instance: LwM2MObjectInstance }) => {
	const location = useNavigation()
	const definition = definitions[props.instance.ObjectID]
	const toggleId = `do;${props.instance.ObjectID}`

	return (
		<div>
			<header class="pad">
				<h3>
					<Documentation size={20} strokeWidth={1} />
					LwM2M Object definition
				</h3>
				<ToggleButton id={toggleId} />
			</header>
			<WhenToggled id={toggleId}>
				<ResourcesDL class="pad bg-light">
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
							href={`https://github.com/hello-nrfcloud/proto-map/blob/saga/lwm2m/${definition.ObjectID}.xml`}
							target="_blank"
							title="View source"
						>
							<ViewSource strokeWidth={1} size={20} />
							<code>{definition.ObjectID}.xml</code>
						</a>
					</dd>
				</ResourcesDL>
			</WhenToggled>
		</div>
	)
}
