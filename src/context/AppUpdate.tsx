import { compare, parse, type SemVer } from 'semver'
import { type ParentProps } from 'solid-js'
import {
	createContext,
	createEffect,
	createResource,
	createSignal,
	onCleanup,
	useContext,
} from 'solid-js'

type AppUpdateInfo = {
	releasedVersion?: string
	updateRequired: boolean
}

const logPrefix = `[AppUpdate]`

export const fetchRelease = async (): Promise<SemVer | undefined> => {
	const url = new URL(
		`${BASE_URL}/.well-known/release?v=${Date.now()}`,
		document.location.href,
	)
	console.debug(logPrefix, `Checking ${url.toString()}...`)
	let res: Response
	try {
		res = await fetch(url, { mode: 'no-cors' })
	} catch (err) {
		console.error(
			logPrefix,
			`Failed to fetch ${url.toString()}: ${(err as Error).message}!`,
		)
		return undefined
	}
	if (!res.ok) {
		console.error(logPrefix, `Version information not found!`)
		console.debug(logPrefix, `Not found: ${res.status}`)
		return undefined
	}
	const versionString = (await res.text()).trim().slice(0, 20)
	const v = parse(versionString)
	if (v === null) {
		console.error(logPrefix, `Could not parse response as semver!`)
		console.debug(logPrefix, versionString)
		return undefined
	}
	return v
}

export const AppUpdateProvider = (props: ParentProps) => {
	const [info, setInfo] = createSignal<AppUpdateInfo>({
		updateRequired: false,
	})

	const [versionResource, { refetch }] = createResource<SemVer | undefined>(
		fetchRelease,
	)

	createEffect(() => {
		const releasedVersion = versionResource()
		if (releasedVersion !== undefined) {
			const updateRequired = compare(releasedVersion, VERSION) > 0
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
}))

export const useAppUpdate = () => useContext(AppUpdateContext)
