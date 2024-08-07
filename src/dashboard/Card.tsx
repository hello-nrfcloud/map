import type { ParentProps } from 'solid-js'

export const Card = (props: ParentProps) => (
	<section class="card">{props.children}</section>
)
export const CardHeader = (props: ParentProps) => (
	<header>{props.children}</header>
)
export const CardBody = (props: ParentProps) => <div>{props.children}</div>
