import { type ParentProps } from 'solid-js'

import './Warning.css'

export const Warning = (props: ParentProps<{ class?: string }>) => (
	<div class={`warning ${props.class ?? ''}`}>{props.children}</div>
)
