import { format } from '#util/lwm2m.js'
import type { LwM2MResourceInfo } from '@hello.nrfcloud.com/proto-map/lwm2m'
import { Show } from 'solid-js'

export const DescribeScalarValue = (props: {
	value: string | number | boolean
	info: LwM2MResourceInfo
}) => {
	const v =
		props.value !== undefined ? format(props.value, props.info) : undefined
	return (
		<span class="resource-value">
			<span class="value">{v!.value}</span>
			<Show when={v!.units !== undefined}>
				<span class="units">{v!.units}</span>
			</Show>
		</span>
	)
}
