import { useAds } from '@/app/api/api'
import { GetAdsParams } from '@/app/api/types'
import clsx from 'clsx'
import React, { useState } from 'react'
import { Pagination } from '../Pagination'
import { ProductCard } from '../ProductCard'
import { SortSelect } from '../Sort'
import cls from './style.module.scss'

const SKELETON_COUNT = 10

export const ProductCardList: React.FC = () => {
	const [page, setPage] = useState(1)
	const limit = SKELETON_COUNT

	const [sortParams, setSortParams] = useState<GetAdsParams>({
		sortBy: 'createdAt',
		sortOrder: 'desc'
	})

	const { data, isLoading, error } = useAds({ page, limit, ...sortParams })

	const ads = data?.ads ?? []
	const totalItems = data?.pagination?.totalItems ?? 0

	const handleSortChange = (newParams: GetAdsParams) => {
		setSortParams(newParams)
		setPage(1)
	}

	const renderSkeletons = () =>
		Array.from({ length: SKELETON_COUNT }).map((_, i) => (
			<div key={i} className={clsx(cls.card, cls.skeleton)}>
				<div className={cls.placeholder} style={{ height: 200 }} />
				<div className={cls.content}>
					<div className={cls.title}>Загрузка...</div>
				</div>
			</div>
		))

	const renderAds = () =>
		ads.map(ad => (
			<ProductCard
				key={ad.id}
				ad={ad}
				onClick={() => console.log('Открыть объявление', ad.id)}
			/>
		))

	return (
		<div className={cls.container}>
			<header className={cls.header}>
				<h2 className={cls.title}>Объявления</h2>
				<p className={cls.total}>Всего: {totalItems} объявлений</p>
			</header>

			<SortSelect
				currentParams={{ ...sortParams, page, limit }}
				onParamsChange={handleSortChange}
			/>

			<div className={cls.grid}>
				{isLoading ? renderSkeletons() : renderAds()}
			</div>

			<Pagination
				currentPage={page}
				totalItems={totalItems}
				itemsPerPage={limit}
				onPageChange={setPage}
			/>

			{error && <div className={cls.error}>Ошибка загрузки объявлений</div>}
		</div>
	)
}
