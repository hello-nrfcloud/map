import {
	LwM2MObjectID,
	definitions,
	timestampResources,
	type LwM2MObjectInstance,
	type LwM2MResourceInfo,
	type LwM2MResourceValue,
} from '@hello.nrfcloud.com/proto-lwm2m'
import { For, createMemo } from 'solid-js'
import type { Device } from '../../context/Devices.js'
import { ResourcesDL } from '../ResourcesDL.js'
import { DescribeResource } from './DescribeResource.js'

export const DescribeResources = (props: {
	instance: LwM2MObjectInstance
	device: Device
}) => {
	const definition = definitions[props.instance.ObjectID as LwM2MObjectID]
	const tsResourceId = timestampResources[definition.ObjectID] as number

	const resources = createMemo(() => {
		const r: { info: LwM2MResourceInfo; value: LwM2MResourceValue }[] = []
		for (const [resourceID, value] of Object.entries(
			props.instance.Resources,
		).filter(([resourceId]) => parseInt(resourceId, 10) !== tsResourceId)) {
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
		<div class="instance-resources">
			<ResourcesDL>
				<For each={resources()}>
					{({ info, value }) => (
						<DescribeResource
							device={props.device}
							ObjectID={props.instance.ObjectID}
							info={info}
							value={value}
						/>
					)}
				</For>
			</ResourcesDL>
		</div>
	)
}
