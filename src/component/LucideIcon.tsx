import { AlertTriangle, X, type IconNode } from 'lucide'
import { For } from 'solid-js'
import { Dynamic } from 'solid-js/web'

export const LucideIcon = ({
	icon,
	strokeWidth,
	size,
}: {
	icon: IconNode
} & LucideProps) => {
	const [, attrs, children] = icon
	const svgProps = {
		'stroke-width': strokeWidth ?? attrs.strokeWidth ?? 2,
	}
	return (
		<svg
			{...{ ...attrs, ...svgProps }}
			style={{ width: `${size ?? 24}px`, height: `${size ?? 24}px` }}
		>
			<For each={children}>
				{([elementName, attrs]) => (
					<Dynamic component={elementName} {...attrs} />
				)}
			</For>
		</svg>
	)
}

export type LucideProps = {
	size?: number
	strokeWidth?: number
}

export const Warning = (props: LucideProps) => (
	<LucideIcon icon={AlertTriangle} {...props} />
)

export const Close = (props: LucideProps) => <LucideIcon icon={X} {...props} />
