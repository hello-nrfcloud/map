import { type ParentProps } from 'solid-js'

import './Progress.css'

export const Progress = (props: ParentProps<{ title: string }>) => (
	<div class="progress">
		<span>{props.title}</span>
	</div>
)
