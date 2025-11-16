import { Advertisement } from '@/app/api/types'
import {
	AlertCircle,
	Calendar,
	CheckCircle,
	Clock,
	Star,
	User,
	XCircle
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import cls from './style.module.scss'

interface ProductDetailViewProps {
	ad: Advertisement
}

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({ ad }) => {
	const navigate = useNavigate()

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString('ru-RU')
	}

	const getStatusIcon = (status: string) => {
		switch (status) {
			case 'approved':
				return <CheckCircle className={cls.statusIconApproved} />
			case 'rejected':
				return <XCircle className={cls.statusIconRejected} />
			case 'pending':
				return <AlertCircle className={cls.statusIconPending} />
			default:
				return null
		}
	}

	const getActionText = (action: 'approved' | 'rejected') => {
		return action === 'approved' ? 'Одобрено' : 'Отклонено'
	}

	return (
		<div className={cls.card}>
			<div className={cls.content}>
				<div className={cls.header}>
					<h1 className={cls.title}>{ad.title}</h1>

					<div className={cls.statusBadge}>
						{getStatusIcon(ad.status)}
						<span>
							{ad.status === 'approved' && 'Одобрено'}
							{ad.status === 'rejected' && 'Отклонено'}
							{ad.status === 'pending' && 'На модерации'}
							{ad.status === 'draft' && 'Черновик'}
						</span>
					</div>
				</div>

				<div className={cls.gallery}>
					{ad.images.length > 0 ? (
						ad.images.map((img, index) => (
							<img
								key={index}
								src={img}
								alt={`${ad.title} — изображение ${index + 1}`}
								className={cls.galleryImage}
							/>
						))
					) : (
						<div className={cls.noImages}>Изображения отсутствуют</div>
					)}
				</div>

				<div className={cls.pricePriority}>
					<div className={cls.price}>{ad.price.toLocaleString('ru-RU')} ₽</div>
					{ad.priority === 'urgent' && (
						<span className={cls.urgentBadge}>Срочно</span>
					)}
				</div>

				<section className={cls.section}>
					<h2 className={cls.sectionTitle}>Описание</h2>
					<p className={cls.description}>{ad.description}</p>
				</section>

				{Object.keys(ad.characteristics).length > 0 && (
					<section className={cls.section}>
						<h2 className={cls.sectionTitle}>Характеристики</h2>
						<table className={cls.characteristicsTable}>
							<tbody>
								{Object.entries(ad.characteristics).map(([key, value]) => (
									<tr key={key}>
										<td className={cls.charKey}>{key}</td>
										<td className={cls.charValue}>{value}</td>
									</tr>
								))}
							</tbody>
						</table>
					</section>
				)}

				<section className={cls.section}>
					<h2 className={cls.sectionTitle}>Продавец</h2>
					<div className={cls.sellerInfo}>
						<div className={cls.sellerRow}>
							<User size={18} />
							<span>{ad.seller.name}</span>
						</div>
						<div className={cls.sellerRow}>
							<Star size={18} />
							<span>Рейтинг: {ad.seller.rating}</span>
						</div>
						<div className={cls.sellerRow}>
							<span>Объявлений: {ad.seller.totalAds}</span>
						</div>
						<div className={cls.sellerRow}>
							<Calendar size={18} />
							<span>На платформе с {formatDate(ad.seller.registeredAt)}</span>
						</div>
					</div>
				</section>

				{ad.moderationHistory.length > 0 && (
					<section className={cls.section}>
						<h2 className={cls.sectionTitle}>История модерации</h2>
						<div className={cls.moderationList}>
							{ad.moderationHistory.map(action => (
								<div key={action.id} className={cls.moderationItem}>
									<div className={cls.moderationHeader}>
										<span className={cls.moderatorName}>
											{action.moderatorName}
										</span>
										<span className={cls.moderationAction}>
											{getActionText(action.action)}
										</span>
									</div>
									<div className={cls.moderationTime}>
										<Clock size={14} />
										{formatDate(action.timestamp)}
									</div>
									{action.comment && (
										<p className={cls.moderationComment}>{action.comment}</p>
									)}
									{action.reason && (
										<p className={cls.moderationReason}>
											<strong>Причина:</strong> {action.reason}
										</p>
									)}
								</div>
							))}
						</div>
					</section>
				)}

				<div className={cls.meta}>
					<small>Создано: {formatDate(ad.createdAt)}</small>
					{ad.updatedAt !== ad.createdAt && (
						<small> · Обновлено: {formatDate(ad.updatedAt)}</small>
					)}
				</div>
			</div>
		</div>
	)
}
