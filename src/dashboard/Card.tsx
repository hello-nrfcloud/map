import type { ParentProps } from 'solid-js'

import './Card.css'

export const Card = (props: ParentProps) => (
	<section class="card boxed bg-lighter">{props.children}</section>
)
export const CardHeader = (props: ParentProps) => (
	<header class="pad bg-light">{props.children}</header>
)
export const CardBody = (props: ParentProps) => (
	<div class="pad">{props.children}</div>
)

export const CardFooter = (props: ParentProps) => (
	<footer class="pad bg-light">{props.children}</footer>
)
