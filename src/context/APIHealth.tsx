import { type ParentProps, type Accessor } from 'solid-js'
import {
	createContext,
	createResource,
	useContext,
	createSignal,
	createEffect,
} from 'solid-js'
import { Context } from '@hello.nrfcloud.com/proto-map/api'
import { typedFetch } from '@hello.nrfcloud.com/proto/hello'
import { Type, type Static } from '@sinclair/typebox'
import { useViteEnv } from './ViteEnv.tsx'

const ApiHealth = Type.Object({
	'@context': Type.Literal(Context.apiHealth.toString()),
	version: Type.String({ minLength: 1 }),
})

const fetchHealthRequest = typedFetch({
	responseBodySchema: ApiHealth,
})

const fetchHealth =
	(url: URL) => async (): Promise<Static<typeof ApiHealth>> => {
		const res = await fetchHealthRequest(url)
		if ('error' in res) {
			console.error(`[ApiHealth]`, res.error)
			throw new Error(`Failed to fetch API health: ${res.error.title}!`)
		}
		return res.result
	}

export const APIHealthContext = createContext<
	Accessor<
		| {
				version: string
		  }
		| undefined
	>
>(() => undefined)
export const useParameters = () => {
	const context = useContext(APIHealthContext)

	if (context === undefined) {
		throw new Error('useParameters: cannot find a APIContext')
	}
	return context
}

export const APIHealthProvider = (props: ParentProps) => {
	const { apiURL } = useViteEnv()
	const [health, updateHealth] = createSignal<Static<typeof ApiHealth>>()
	const [healthResource] = createResource<Static<typeof ApiHealth>>(
		fetchHealth(new URL('./health', apiURL)),
	)

	createEffect(() => {
		updateHealth(healthResource())
	})

	return (
		<APIHealthContext.Provider value={health}>
			{props.children}
		</APIHealthContext.Provider>
	)
}

export const useAPIHealth = () => useContext(APIHealthContext)
