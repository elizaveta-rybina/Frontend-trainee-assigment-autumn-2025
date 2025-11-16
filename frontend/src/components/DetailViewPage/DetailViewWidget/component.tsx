import { useAdById, usePendingAds } from '@/app/api/hooks'
import { useQueryClient } from '@tanstack/react-query'
import { AlertCircle } from 'lucide-react'
import { useParams } from 'react-router-dom'
import { ModerationPanel } from '../Moderation'
import { ModerationNavigation } from '../Navigation'
import { ProductDetailView } from '../ProductDetailView'
import cls from './style.module.scss'

export const DetailViewWidget = () => {
	const { id } = useParams<{ id: string }>()
	const adId = Number(id)
	const queryClient = useQueryClient()

	const { data: ad, isLoading: adLoading, isError, error } = useAdById(adId)
	const { data: pendingAdIds = [], isLoading: listLoading } = usePendingAds()

	const handleModerationSuccess = () => {
		queryClient.invalidateQueries({ queryKey: ['ad', adId] })
		queryClient.invalidateQueries({ queryKey: ['ads'] })
	}

	if (adLoading || listLoading) {
		return <div className={cls.loader}>Загрузка...</div>
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
			{pendingAdIds.length > 1 && (
				<ModerationNavigation adIds={pendingAdIds} currentAdId={adId} />
			)}

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
