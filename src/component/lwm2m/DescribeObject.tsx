import { useNavigation } from '#context/Navigation.tsx'
import { Documentation, Search, ViewSource } from '#icons/LucideIcon.tsx'
import {
	definitions,
	type LwM2MObjectInstance,
} from '@hello.nrfcloud.com/proto-map/lwm2m'
import { SearchTermType } from '../../search.ts'
import { CollapsibleMenu } from '../CollapsibleMenu.tsx'
import { ResourcesDL } from '../ResourcesDL.tsx'
import { ToggleButton } from '../ToggleButton.tsx'
import { WhenToggled } from '../WhenToggled.tsx'

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
				<ToggleButton id={toggleId} title="resources" />
			</header>
			<WhenToggled id={toggleId}>
				<ResourcesDL class="pad bg-light">
					<dt>
						<span class="info">ObjectID</span>
						<CollapsibleMenu
							id={`object-${props.instance.ObjectID}`}
							class="meta"
						>
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
