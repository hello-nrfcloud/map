import { fetchRelease } from '#resources/fetchRelease.js'
import { compare, type SemVer } from 'semver'
import {
	createContext,
	createEffect,
	createResource,
	createSignal,
	onCleanup,
	useContext,
	type ParentProps,
} from 'solid-js'
import { useViteEnv } from './ViteEnv.js'

const logPrefix = '[AppUpdate]'

type AppUpdateInfo = {
	releasedVersion: string
	updateRequired: boolean
}

export const AppUpdateProvider = (props: ParentProps) => {
	const { version } = useViteEnv()
	const [info, setInfo] = createSignal<AppUpdateInfo>({
		updateRequired: false,
		releasedVersion: '0.0.0-development',
	})

	const [versionResource, { refetch }] = createResource<SemVer | undefined>(
		fetchRelease,
	)

	createEffect(() => {
		const releasedVersion = versionResource()
		if (releasedVersion !== undefined) {
			const updateRequired = compare(releasedVersion, version) > 0
			setInfo(() => ({
				updateRequired,
				releasedVersion: releasedVersion.toString(),
			}))
			if (updateRequired) {
				console.warn(logPrefix, `a newer version is available`, releasedVersion)
			} else {
				console.debug(
					logPrefix,
					`release version`,
					releasedVersion.raw,
					`is same or older`,
				)
			}
		}
	})

	const i = setInterval(
		() => {
			void refetch()
		},
		10 * 60 * 1000,
	)

	onCleanup(() => {
		clearInterval(i)
	})

	return (
		<AppUpdateContext.Provider value={info}>
			{props.children}
		</AppUpdateContext.Provider>
	)
}

export const AppUpdateContext = createContext<() => AppUpdateInfo>(() => ({
	updateRequired: false,
	releasedVersion: '0.0.0-development',
}))

export const useAppUpdate = () => useContext(AppUpdateContext)
