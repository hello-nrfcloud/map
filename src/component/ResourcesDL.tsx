import { type ParentProps } from 'solid-js'
import './ResourcesDL.css'

export const ResourcesDL = (props: ParentProps<{ class?: string }>) => (
	<dl class={`resources ${props.class ?? ''}`}>{props.children}</dl>
)
