import { useAdById } from '@/app/api/hooks'
import { AlertCircle } from 'lucide-react'
import { useParams } from 'react-router-dom'
import { ProductDetailView } from '../ProductDetailView'
import cls from './style.module.scss'

export const DetailViewWidget = () => {
	const { id } = useParams<{ id: string }>()
	const adId = Number(id)

	const { data: ad, isLoading, isError, error } = useAdById(adId)

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

	return <ProductDetailView ad={ad} />
}
