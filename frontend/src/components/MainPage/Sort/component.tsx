import { GetAdsParams } from '@/app/api/types'
import clsx from 'clsx'
import { ChevronDown, ChevronUp } from 'lucide-react'
import React, { useCallback, useMemo } from 'react'
import cls from './style.module.scss'

interface SortSelectProps {
	currentParams: GetAdsParams
	onParamsChange: (params: GetAdsParams) => void
}

const SORT_OPTIONS = [
	{ key: 'createdAt', label: 'Дата', defaultOrder: 'desc' as const },
	{ key: 'price', label: 'Цена', defaultOrder: 'asc' as const },
	{ key: 'priority', label: 'Приоритет', defaultOrder: 'desc' as const }
] as const

type SortKey = (typeof SORT_OPTIONS)[number]['key']
type SortOrder = 'asc' | 'desc'

const getDefaultOrder = (key: SortKey): SortOrder =>
	SORT_OPTIONS.find(o => o.key === key)?.defaultOrder ?? 'desc'

export const SortSelect: React.FC<SortSelectProps> = React.memo(
	({ currentParams, onParamsChange }) => {
		const sortBy = (currentParams.sortBy ?? 'createdAt') as SortKey
		const sortOrder = (currentParams.sortOrder ?? 'desc') as SortOrder

		const handleSortChange = useCallback(
			(newSortBy: SortKey) => {
				const isSame = sortBy === newSortBy
				const newOrder: SortOrder = isSame
					? sortOrder === 'desc'
						? 'asc'
						: 'desc'
					: getDefaultOrder(newSortBy)

				onParamsChange({
					...currentParams,
					sortBy: newSortBy,
					sortOrder: newOrder,
					page: 1
				})
			},
			[currentParams, onParamsChange, sortBy, sortOrder]
		)

		const currentLabel = useMemo(() => {
			if (sortBy === 'createdAt') {
				return sortOrder === 'desc' ? 'Сначала новые' : 'Сначала старые'
			}
			if (sortBy === 'price') {
				return sortOrder === 'asc' ? 'Сначала дешевле' : 'Сначала дороже'
			}
			if (sortBy === 'priority') {
				return sortOrder === 'desc' ? 'Сначала срочные' : 'Сначала обычные'
			}
			return 'Сортировка'
		}, [sortBy, sortOrder])

		return (
			<nav className={cls.sortContainer} aria-label='Сортировка объявлений'>
				<span className={cls.label}>Сортировать по:</span>

				<div
					className={cls.buttons}
					role='tablist'
					aria-label='Параметры сортировки'
				>
					{SORT_OPTIONS.map(({ key, label }) => {
						const isActive = sortBy === key
						const Icon =
							isActive && sortOrder === 'desc' ? ChevronDown : ChevronUp

						return (
							<button
								key={key}
								type='button'
								role='tab'
								aria-selected={isActive}
								aria-pressed={isActive}
								className={clsx(cls.sortBtn, { [cls.active]: isActive })}
								onClick={() => handleSortChange(key)}
							>
								<span>{label}</span>
								{isActive && <Icon size={14} className={cls.icon} />}
							</button>
						)
					})}
				</div>

				<div className={cls.current} aria-live='polite'>
					{currentLabel}
				</div>
			</nav>
		)
	}
)

SortSelect.displayName = 'SortSelect'
