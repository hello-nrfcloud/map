import {
	instanceTs,
	type LwM2MObjectInstance,
} from '@hello.nrfcloud.com/proto-map/lwm2m'

export const newestInstanceFirst = (
	i1: LwM2MObjectInstance,
	i2: LwM2MObjectInstance,
): number => instanceTs(i2) - instanceTs(i1)
