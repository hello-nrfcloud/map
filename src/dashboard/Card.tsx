import type { ParentProps } from 'solid-js'

import './Card.css'

export const Card = (props: ParentProps<{ class?: string }>) => (
	<section class={`card boxed bg-lighter ${props.class ?? ''}`}>
		{props.children}
	</section>
)
export const CardHeader = (props: ParentProps<{ class?: string }>) => (
	<header class={`pad bg-light ${props.class ?? ''}`}>{props.children}</header>
)
export const CardBody = (props: ParentProps<{ class?: string }>) => (
	<div class={`pad ${props.class ?? ''}`}>{props.children}</div>
)

export const CardFooter = (props: ParentProps<{ class?: string }>) => (
	<footer class={`pad bg-light ${props.class ?? ''}`}>{props.children}</footer>
)
