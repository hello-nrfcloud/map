import { type ParentProps } from 'solid-js'

import './Success.css'

export const Success = (props: ParentProps<{ class?: string }>) => (
	<div class={`success ${props.class ?? ''}`}>{props.children}</div>
)
