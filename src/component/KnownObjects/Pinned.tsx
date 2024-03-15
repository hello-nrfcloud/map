import type { Resource } from '../../context/Navigation.js'
import { PinOnMap } from '../../icons/LucideIcon.js'
import { For, createMemo } from 'solid-js'
import {
	definitions,
	type LwM2MResourceInfo,
	type LwM2MResourceValue,
	LwM2MObjectID,
	instanceTs,
} from '@hello.nrfcloud.com/proto-map'
import { isLwM2MObjectID } from '@hello.nrfcloud.com/proto-map'
import type { Device } from '../../resources/fetchDevices.js'
import { ResourcesDL } from '../ResourcesDL.js'
import { DescribeResource } from '../lwm2m/DescribeResource.js'

import './DeviceInformation.css'

export const Icon = () => (
	<>
		<PinOnMap strokeWidth={1} size={24} />
		<small>Pinned</small>
	</>
)

type PinnedResource = {
	ObjectID: LwM2MObjectID
	resource: Resource
	definition: LwM2MResourceInfo
	value: LwM2MResourceValue | undefined
	InstanceID: number
	ts: Date | undefined
}

export const Card = (props: { resources: Resource[]; device: Device }) => {
	const resourceValues = createMemo(() =>
		props.resources
			.map((resource) => {
				const { ObjectID, ResourceID } = resource
				if (!isLwM2MObjectID(ObjectID)) return undefined
				const definition = definitions[ObjectID].Resources[ResourceID]
				if (definition === undefined) return undefined
				const instance = props.device.state?.find(
					({ ObjectID: id }) => id === ObjectID,
				)
				const resourceValue = instance?.Resources[ResourceID]
				const ts = instance !== undefined ? instanceTs(instance) : undefined
				return {
					ObjectID,
					resource,
					definition,
					value: resourceValue as LwM2MResourceValue | undefined,
					ts,
					InstanceID: instance?.ObjectInstanceID ?? 0,
				}
			})
			.filter((s): s is PinnedResource => s !== undefined),
	)

	return (
		<ResourcesDL>
			<For each={resourceValues().sort(byNewest)}>
				{(resource) => (
					<DescribeResource
						device={props.device}
						ObjectID={resource.ObjectID}
						info={resource.definition}
						value={resource.value}
						ts={resource.ts}
						InstanceID={resource.InstanceID}
					/>
				)}
			</For>
		</ResourcesDL>
	)
}

const byNewest = (r1: PinnedResource, r2: PinnedResource) =>
	(r2.ts?.getTime() ?? Number.MIN_SAFE_INTEGER) -
	(r1.ts?.getTime() ?? Number.MIN_SAFE_INTEGER)
