import { ProblemDetailError } from '#component/notifications/Problem.tsx'
import { typedFetch } from '@hello.nrfcloud.com/proto/hello'
import { Type } from '@sinclair/typebox'

export const stopDeviceSharing =
	(apiURL: URL) =>
	async ({ id, jwt }: { id: string; jwt: string }): Promise<void> => {
		const res = await typedFetch({
			responseBodySchema: Type.Undefined(),
		})(new URL(`./user/device/${id}`, apiURL), undefined, {
			method: 'DELETE',
			headers: { Authorization: `Bearer ${jwt}` },
		})
		if ('error' in res) {
			console.error(res.error)
			throw new ProblemDetailError(res.error)
		}
		return res.result
	}
