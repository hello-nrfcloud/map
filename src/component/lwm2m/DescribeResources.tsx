import type { Device } from '#resources/fetchDevices.js'
import {
	definitions,
	timestampResources,
	type LwM2MObjectInstance,
	type LwM2MResourceInfo,
	type LwM2MResourceValue,
} from '@hello.nrfcloud.com/proto-map/lwm2m'
import { For, createMemo } from 'solid-js'
import { ResourcesDL } from '../ResourcesDL.js'
import { DescribeResource } from './DescribeResource.js'

export const DescribeResources = (props: {
	instance: LwM2MObjectInstance
	device: Device
}) => {
	const definition = definitions[props.instance.ObjectID]
	const tsResourceId = timestampResources.get(definition.ObjectID) as number

	const resources = createMemo(() => {
		const r: { info: LwM2MResourceInfo; value: LwM2MResourceValue }[] = []
		for (const [resourceID, value] of Object.entries(props.instance.Resources)
			.filter(
				(res): res is [string, LwM2MResourceValue] => res[1] !== undefined,
			)
			.filter(([resourceId]) => parseInt(resourceId, 10) !== tsResourceId)) {
			const ResourceID = parseInt(resourceID, 10)
			const info = definition.Resources[ResourceID]
			if (info === undefined) {
				console.warn(
					`[DescribeResources]`,
					`Unknown resource on device ${props.device.id}: ${props.instance.ObjectID}:${ResourceID}`,
				)
				continue
			}
			r.push({ info, value })
		}
		return r
	})

	return (
		<ResourcesDL class="instance-resources bg-light">
			<For each={resources()}>
				{({ info, value }) => (
					<DescribeResource
						device={props.device}
						ObjectID={props.instance.ObjectID}
						info={info}
						value={value}
						InstanceID={props.instance.ObjectInstanceID ?? 0}
					/>
				)}
			</For>
		</ResourcesDL>
	)
}
