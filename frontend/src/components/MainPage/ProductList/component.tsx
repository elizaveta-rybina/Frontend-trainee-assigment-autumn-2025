import { useAds, useCategoriesFromAds } from '@/app/api/hooks'
import { GetAdsParams } from '@/app/api/types'
import clsx from 'clsx'
import React, { useState } from 'react'
import { Filters } from '../Filter/component'
import { Pagination } from '../Pagination'
import { ProductCard } from '../ProductCard'
import { SearchBar } from '../SearchBar'
import { SortSelect } from '../Sort'
import cls from './style.module.scss'

const SKELETON_COUNT = 10

export const ProductCardList: React.FC = () => {
	const [page, setPage] = useState(1)
	const limit = SKELETON_COUNT

	const [params, setParams] = useState<GetAdsParams>({
		page,
		limit,
		sortBy: 'createdAt',
		sortOrder: 'desc',
		search: ''
	})

	const { data, isLoading, error } = useAds(params)

	const ads = data?.ads ?? []
	const totalItems = data?.pagination?.totalItems ?? 0
	const categories = useCategoriesFromAds(ads)

	const handleParamsChange = (newParams: GetAdsParams) => {
		setParams(prev => ({ ...prev, ...newParams }))
		setPage(1)
	}

	const handlePageChange = (newPage: number) => {
		setPage(newPage)
		setParams(prev => ({ ...prev, page: newPage }))
	}

	const handleSearchChange = (searchTerm: string) => {
		setParams(prev => ({ ...prev, search: searchTerm.trim() || undefined }))
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

	const renderAds = () => {
		if (ads.length === 0) {
			return <div className={cls.noAds}>Нет объявлений</div>
		}
		return ads.map(ad => (
			<ProductCard
				key={ad.id}
				ad={ad}
				onClick={() => console.log('Открыть объявление', ad.id)}
			/>
		))
	}

	return (
		<div className={cls.container}>
			<header className={cls.header}>
				<h2 className={cls.title}>Объявления</h2>
				<p className={cls.total}>Всего: {totalItems} объявлений</p>
			</header>

			<div className={cls.sidebar}>
				<Filters
					currentParams={params}
					onParamsChange={handleParamsChange}
					categories={categories}
				/>
			</div>

			<SearchBar value={params.search || ''} onChange={handleSearchChange} />

			<main className={cls.content}>
				<header className={cls.header}>
					<h2 className={cls.title}>Объявления</h2>
					<SortSelect
						currentParams={params}
						onParamsChange={handleParamsChange}
					/>
				</header>

				{error && <div className={cls.error}>Ошибка загрузки объявлений</div>}

				<div className={cls.grid}>
					{isLoading ? renderSkeletons() : renderAds()}
				</div>

				<Pagination
					currentPage={page}
					totalItems={totalItems}
					itemsPerPage={limit}
					onPageChange={handlePageChange}
				/>
			</main>
		</div>
	)
}
