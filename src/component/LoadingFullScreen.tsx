import { Loading as LoadingIcon } from '#icons/LucideIcon.js'

import './LoadingFullScreen.css'

export const LoadingFullScreen = (props: { what: string }) => (
	<div id="loading">
		<LoadingIcon />
		Loading {props.what} …
	</div>
)
