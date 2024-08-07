import { type ParentProps } from 'solid-js'

import './Progress.css'

export const Progress = (
	props: ParentProps<{ title: string; class?: string }>,
) => (
	<div class={`progress ${props.class ?? ''}`}>
		<span>{props.title}</span>
	</div>
)
