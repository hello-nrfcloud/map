import {
	TriangleAlert,
	BatteryCharging,
	ChevronDown,
	ChevronUp,
	Clock10,
	CloudOff,
	CodeXml,
	FileText,
	Info as InfoIcon,
	LocateFixed,
	MapPinned,
	CirclePlus,
	RefreshCcwDot,
	Search as SearchIcon,
	SquareStack,
	X,
	ZoomIn as ZoomInIcon,
	ZoomOut as ZoomOutIcon,
	type IconNode,
	Star,
	StarOff,
	CloudUpload,
	Ellipsis,
	LineChart,
	MapPin,
	MapPinOff,
	Clipboard,
	ClipboardCheck,
	Filter,
	Hourglass,
	CircleHelp,
	ChevronRight,
	ZapOff,
	ChevronLeft,
	CircleCheckBig,
	CircleDashed,
	ArrowDownToLine,
} from 'lucide'
import { For } from 'solid-js'
import { Dynamic } from 'solid-js/web'

export const LucideIcon = (
	props: {
		icon: IconNode
	} & LucideProps,
) => {
	const [, attrs, children] = props.icon
	const svgProps = {
		'stroke-width': props.strokeWidth ?? attrs.strokeWidth ?? 2,
	}
	return (
		<svg
			{...{ ...attrs, ...svgProps }}
			style={{
				width: `${props.size ?? 24}px`,
				height: `${props.size ?? 24}px`,
			}}
			class={`icon ${props.class ?? ''}`}
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
	class?: string
}

export const Warning = (props: LucideProps) => (
	<LucideIcon icon={TriangleAlert} {...props} />
)

export const Close = (props: LucideProps) => <LucideIcon icon={X} {...props} />
export const Next = (props: LucideProps) => (
	<LucideIcon icon={ChevronRight} {...props} />
)
export const Prev = (props: LucideProps) => (
	<LucideIcon icon={ChevronLeft} {...props} />
)
export const Search = (props: LucideProps) => (
	<LucideIcon icon={SearchIcon} {...props} />
)

export const AddToSearch = (props: LucideProps) => (
	<LucideIcon icon={ZoomInIcon} {...props} />
)

export const AppUpdateRequired = (props: LucideProps) => (
	<LucideIcon icon={RefreshCcwDot} {...props} />
)

export const ViewSource = (props: LucideProps) => (
	<LucideIcon icon={CodeXml} {...props} />
)

export const Multiple = (props: LucideProps) => (
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

export const NoData = (props: LucideProps) => (
	<LucideIcon icon={CloudOff} {...props} />
)

export const NoConnection = (props: LucideProps) => (
	<LucideIcon icon={ZapOff} {...props} />
)

export const Add = (props: LucideProps) => (
	<LucideIcon icon={CirclePlus} {...props} />
)

export const Info = (props: LucideProps) => (
	<LucideIcon icon={InfoIcon} {...props} />
)

export const Battery = (props: LucideProps) => (
	<LucideIcon icon={BatteryCharging} {...props} />
)

export const Map = (props: LucideProps) => (
	<LucideIcon icon={MapPinned} {...props} />
)

export const ZoomIn = (props: LucideProps) => (
	<LucideIcon icon={ZoomInIcon} {...props} />
)

export const ZoomOut = (props: LucideProps) => (
	<LucideIcon icon={ZoomOutIcon} {...props} />
)

export const Center = (props: LucideProps) => (
	<LucideIcon icon={LocateFixed} {...props} />
)

export const Favorite = (props: LucideProps) => (
	<LucideIcon icon={Star} {...props} />
)

export const PinOnMap = (props: LucideProps) => (
	<LucideIcon icon={MapPin} {...props} />
)

export const UnpinFromMap = (props: LucideProps) => (
	<LucideIcon icon={MapPinOff} {...props} />
)

export const Unfavorite = (props: LucideProps) => (
	<LucideIcon icon={StarOff} {...props} />
)

export const Published = (props: LucideProps) => (
	<LucideIcon icon={CloudUpload} {...props} />
)

export const Menu = (props: LucideProps) => (
	<LucideIcon icon={Ellipsis} {...props} />
)

export const History = (props: LucideProps) => (
	<LucideIcon icon={LineChart} {...props} />
)

export const CopyToClipboard = (props: LucideProps) => (
	<LucideIcon icon={Clipboard} {...props} />
)

export const CopiedToClipboard = (props: LucideProps) => (
	<LucideIcon icon={ClipboardCheck} {...props} />
)

export const ActiveSearch = (props: LucideProps) => (
	<LucideIcon icon={Filter} {...props} />
)

export const Loading = (props: LucideProps) => (
	<LucideIcon icon={Hourglass} {...props} />
)

export const Tutorial = (props: LucideProps) => (
	<LucideIcon icon={CircleHelp} {...props} />
)

export const Done = (props: LucideProps) => (
	<LucideIcon icon={CircleCheckBig} {...props} />
)

export const ToDo = (props: LucideProps) => (
	<LucideIcon icon={CircleDashed} {...props} />
)

export const ScrollDown = (props: LucideProps) => (
	<LucideIcon icon={ArrowDownToLine} {...props} />
)
