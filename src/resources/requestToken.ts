import { ProblemDetailError } from '#component/notifications/Problem.tsx'
import { typedFetch } from '@hello.nrfcloud.com/proto/hello'
import { Type } from '@sinclair/typebox'

export const requestToken =
	(apiURL: URL) =>
	async (email: string): Promise<boolean> => {
		const res = await typedFetch({
			responseBodySchema: Type.Undefined(),
		})(new URL('./auth', apiURL), { email }, { method: 'POST' })
		if ('error' in res) {
			console.error(res.error)
			throw new ProblemDetailError(res.error)
		}
		return true
	}
