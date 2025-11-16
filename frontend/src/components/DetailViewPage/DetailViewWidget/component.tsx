import { useAdById } from '@/app/api/hooks'
import { useQueryClient } from '@tanstack/react-query'
import { AlertCircle } from 'lucide-react'
import { useParams } from 'react-router-dom'
import ModerationPanel from '../Moderation/component'
import { ProductDetailView } from '../ProductDetailView'
import cls from './style.module.scss'

export const DetailViewWidget = () => {
	const { id } = useParams<{ id: string }>()
	const adId = Number(id)
	const queryClient = useQueryClient()

	const { data: ad, isLoading, isError, error } = useAdById(adId)
	const handleModerationSuccess = () => {
		queryClient.invalidateQueries({ queryKey: ['ad', adId] })
		queryClient.invalidateQueries({ queryKey: ['ads'] })
	}

	if (isLoading) {
		return <div className={cls.loader}>Загрузка объявления...</div>
	}

	if (isError || !ad) {
		return (
			<div className={cls.error}>
				<AlertCircle size={24} />
				<p>{error?.message || 'Объявление не найдено'}</p>
			</div>
		)
	}

	const showModeration = ad.status === 'pending'

	return (
		<div className={cls.container}>
			<div className={cls.detailView}>
				<ProductDetailView ad={ad} />
			</div>
			
			{showModeration && (
				<div className={cls.moderationSection}>
					<ModerationPanel adId={adId} onSuccess={handleModerationSuccess} />
				</div>
			)}
		</div>
	)
}
