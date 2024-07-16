import { useNavigation } from '../../context/Navigation.tsx'
import type { ParentProps } from 'solid-js'
import type { ShareDeviceOwnershipConfirmed } from '@hello.nrfcloud.com/proto-map/api'
import { type Static } from '@sinclair/typebox'

export const ShareDeviceRequestConfirmed = (
	props: ParentProps<{
		confirmed: Static<typeof ShareDeviceOwnershipConfirmed>
	}>,
) => {
	const location = useNavigation()
	return (
		<section class="boxed bg-light pad add-device-flow">
			<header>
				<h2>We will now show data sent by the device on the map.</h2>
			</header>
			<div class="pad-t">
				<p>
					<a
						href={location.link({
							panel: `id:${props.confirmed.id}`,
							query: undefined,
						})}
					>
						Here is a link to your device <code>{props.confirmed.id}</code>
					</a>
				</p>
			</div>
		</section>
	)
}
