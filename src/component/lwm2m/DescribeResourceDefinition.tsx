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
					{props.ObjectID}/{props.info.ResourceID}
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
			<dd class="value">
				<p>
					{objectInfo.Name}/<strong>{props.info.Name}</strong>{' '}
					<Show when={props.info.Units !== undefined}>
						<span>in {props.info.Units} </span>
					</Show>
					(<code>{props.info.Type}</code>): {props.info.Description}
				</p>
			</dd>
		</>
	)
}
