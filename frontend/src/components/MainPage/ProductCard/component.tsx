import clsx from 'clsx'
import React from 'react'
import cls from './style.module.scss'

export const ProductCard: React.FC<{
	ad: {
		id: number
		title: string
		price: number
		category: string
		createdAt: string
		images: string[]
	}
	onClick?: () => void
}> = ({ ad, onClick }) => {
	const imageUrl = ad.images[0] || null
	const formattedDate = new Date(ad.createdAt).toLocaleDateString('ru-RU')

	return (
		<div className={clsx(cls.card)} onClick={onClick}>
			<div className={cls.image}>
				{imageUrl ? (
					<img src={imageUrl} alt={ad.title} loading='lazy' />
				) : (
					<div className={cls.placeholder} />
				)}
			</div>

			<div className={cls.content}>
				<h3 className={cls.title}>{ad.title}</h3>
				<div className={cls.price}>{ad.price.toLocaleString('ru-RU')} ₽</div>
				<div className={cls.meta}>
					{ad.category} • {formattedDate}
				</div>
			</div>

			<button
				className={cls.button}
				onClick={e => {
					e.stopPropagation()
					onClick?.()
				}}
			>
				Открыть
			</button>
		</div>
	)
}
