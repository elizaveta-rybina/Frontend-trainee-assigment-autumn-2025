'use client'

import clsx from 'clsx'
import React, { useState } from 'react'
import { Pagination } from '../Pagination/component'
import { ProductCard } from '../ProductCard/component'
import { useAds } from './api'
import cls from './style.module.scss'

export const ProductCardList: React.FC = () => {
	const [page, setPage] = useState(1)
	const limit = 10

	const { data, isLoading, error } = useAds({ page, limit })

	const ads = data?.ads ?? []
	const pagination = data?.pagination

	const total = pagination?.total ?? 0
	const totalPages = pagination?.totalPages ?? 1
	const currentPage = pagination?.page ?? 1

	return (
		<div className={cls.container}>
			<div className={cls.header}>
				<h2 className={cls.title}>Объявления</h2>
				<p className={cls.total}>
					Всего: {total.toLocaleString('ru-RU')} объявлений
				</p>
			</div>

			<div className={cls.grid}>
				{isLoading
					? // Скелетоны
					  Array.from({ length: limit }).map((_, i) => (
							<div key={i} className={clsx(cls.card, cls.skeleton)}>
								<div className={cls.placeholder} style={{ height: 200 }} />
								<div className={cls.content}>
									<div className={cls.title}>Загрузка...</div>
								</div>
							</div>
					  ))
					: // Реальные карточки
					  ads.map(ad => (
							<ProductCard
								key={ad.id}
								ad={ad}
								onClick={() => console.log('Открыть объявление', ad.id)}
							/>
					  ))}
			</div>

			{totalPages > 1 && (
				<Pagination
					onPrevPageClick={() => setPage(page - 1)}
					onNextPageClick={() => setPage(page + 1)}
					disable={{ left: page === 1, right: page === totalPages }}
					nav={{ current: page, total: totalPages }}
				/>
			)}

			{error && <div className={cls.error}>Ошибка загрузки объявлений</div>}
		</div>
	)
}
