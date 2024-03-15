import {
	instanceTs,
	type LwM2MObjectInstance,
} from '@hello.nrfcloud.com/proto-map'

export const newestInstanceFirst = (
	i1: LwM2MObjectInstance,
	i2: LwM2MObjectInstance,
): number => instanceTs(i2).getTime() - instanceTs(i1).getTime()
