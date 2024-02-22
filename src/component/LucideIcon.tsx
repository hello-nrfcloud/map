import {
	AlertTriangle,
	X,
	type IconNode,
	Search as SearchIcon,
	ZoomIn,
	RefreshCcwDot,
	Code2,
	SquareStack,
	ChevronDown,
	ChevronUp,
	Clock10,
	FileText,
	ExternalLink as ExternalLinkIcon,
	CloudOff,
} from 'lucide'
import { For } from 'solid-js'
import { Dynamic } from 'solid-js/web'

export const LucideIcon = ({
	icon,
	strokeWidth,
	size,
	class: className,
}: {
	icon: IconNode
	class?: string
} & LucideProps) => {
	const [, attrs, children] = icon
	const svgProps = {
		'stroke-width': strokeWidth ?? attrs.strokeWidth ?? 2,
	}
	return (
		<svg
			{...{ ...attrs, ...svgProps }}
			style={{ width: `${size ?? 24}px`, height: `${size ?? 24}px` }}
			class={`icon ${className ?? ''}`}
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
export const Search = (props: LucideProps) => (
	<LucideIcon icon={SearchIcon} {...props} />
)

export const AddToSearch = (props: LucideProps) => (
	<LucideIcon icon={ZoomIn} {...props} />
)

export const AppUpdateRequired = (props: LucideProps) => (
	<LucideIcon icon={RefreshCcwDot} {...props} />
)

export const ViewSourceIcon = (props: LucideProps) => (
	<LucideIcon icon={Code2} {...props} />
)

export const MultipleIcon = (props: LucideProps) => (
	<LucideIcon icon={SquareStack} {...props} />
)

export const Expand = (props: LucideProps) => (
	<LucideIcon icon={ChevronDown} {...props} />
)

export const Collapse = (props: LucideProps) => (
	<LucideIcon icon={ChevronUp} {...props} />
)

export const Updated = (props: LucideProps) => (
	<LucideIcon icon={Clock10} {...props} />
)

export const Documentation = (props: LucideProps) => (
	<LucideIcon icon={FileText} {...props} />
)

export const ExternalLink = (props: LucideProps) => (
	<LucideIcon icon={ExternalLinkIcon} {...props} />
)

export const NoData = (props: LucideProps) => (
	<LucideIcon icon={CloudOff} {...props} />
)
