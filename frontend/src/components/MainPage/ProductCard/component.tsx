import { AdPriority, AdStatus, Advertisement } from '@/app/api/types'
import clsx from 'clsx'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import cls from './style.module.scss'

const statusConfig: Record<AdStatus, { text: string; class: string }> = {
	pending: { text: 'На модерации', class: cls.statusPending },
	approved: { text: 'Одобрено', class: cls.statusApproved },
	rejected: { text: 'Отклонено', class: cls.statusRejected },
	draft: { text: 'Черновик', class: cls.statusDraft }
}

const priorityConfig: Partial<
	Record<AdPriority, { text: string; class: string }>
> = {
	urgent: { text: 'Срочно', class: cls.priorityUrgent }
}

export const ProductCard: React.FC<{
	ad: Advertisement
	onClick?: () => void
}> = ({ ad, onClick }) => {
	const navigate = useNavigate()
	const imageUrl = ad.images[0] || null
	const formattedDate = new Date(ad.createdAt).toLocaleDateString('ru-RU')

	const { text: statusText, class: statusClass } = statusConfig[ad.status]
	const priority = priorityConfig[ad.priority]

	const handleOpen = (e: React.MouseEvent) => {
		e.stopPropagation()
		navigate(`/item/${ad.id}`)
	}

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

				<div className={cls.status}>
					<span className={clsx(cls.statusBadge, statusClass)}>
						{statusText}
					</span>
				</div>

				{priority && (
					<div className={cls.priority}>
						<span className={clsx(cls.priorityBadge, priority.class)}>
							{priority.text}
						</span>
					</div>
				)}
			</div>

			<button className={cls.button} onClick={handleOpen}>
				Открыть
			</button>
		</div>
	)
}
