import {
	LwM2MObjectID,
	definitions,
	type LwM2MResourceInfo,
} from '@hello.nrfcloud.com/proto-lwm2m'
import { Show } from 'solid-js'
import { Close } from '../../icons/LucideIcon.js'

export const DescribeResourceDefinition = (props: {
	ObjectID: LwM2MObjectID
	info: LwM2MResourceInfo
	close: () => void
}) => {
	const objectInfo = definitions[props.ObjectID]
	return (
		<>
			<dt>
				<span class="info">
					<abbr class="name" title={props.info.Description}>
						<small>
							{props.ObjectID}/{props.info.ResourceID}:
						</small>
						({objectInfo.Name}) {props.info.Name}
						<Show when={props.info.Units !== undefined}>
							<small>in {props.info.Units}</small>
						</Show>
						<small>({props.info.Type})</small>
					</abbr>
				</span>
				<nav>
					<button
						type="button"
						title="Close definition"
						onClick={() => props.close()}
					>
						<Close strokeWidth={1} size={20} />
					</button>
				</nav>
			</dt>
			<dd class="value">{props.info.Description}</dd>
		</>
	)
}
