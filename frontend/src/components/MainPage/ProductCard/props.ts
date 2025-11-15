export interface ProductCardProps {
	image?: string
	title: string
	price: number
	category: string
	date: string
	onClick?: () => void
	className?: string
}
