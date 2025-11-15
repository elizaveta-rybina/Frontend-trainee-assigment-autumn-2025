import type { AdStatus, GetAdsParams } from '@/app/api/types'
import { AD_STATUSES } from '@/app/api/types'
import React from 'react'
import { useFilters } from './hooks'
import cls from './style.module.scss'

interface FiltersProps {
	currentParams: GetAdsParams
	onParamsChange: (params: GetAdsParams) => void
	categories: Array<{ id: number; name: string }>
}

const STATUS_CONFIG: Record<AdStatus, string> = {
	pending: 'На модерации',
	approved: 'Одобрено',
	rejected: 'Отклонено',
	draft: 'Черновик'
}

export const Filters: React.FC<FiltersProps> = ({
	currentParams,
	onParamsChange,
	categories
}) => {
	const {
		selectedStatuses,
		selectedCategory,
		minPrice,
		maxPrice,
		hasActiveFilters,
		handleStatusToggle,
		handleCategoryChange,
		handlePriceChange,
		handleResetFilters
	} = useFilters({ currentParams, onParamsChange })

	return (
		<aside
			className={cls.filters}
			role='region'
			aria-label='Фильтры объявлений'
		>
			<fieldset className={cls.field}>
				<legend className={cls.legend}>Статус</legend>
				<div className={cls.checkboxes}>
					{AD_STATUSES.map(status => (
						<label key={status} className={cls.checkbox}>
							<input
								type='checkbox'
								checked={selectedStatuses.includes(status)}
								onChange={() => handleStatusToggle(status)}
								aria-label={`Фильтр по статусу: ${STATUS_CONFIG[status]}`}
							/>
							<span className={cls.checkmark} aria-hidden='true' />
							{STATUS_CONFIG[status]}
						</label>
					))}
				</div>
			</fieldset>

			<fieldset className={cls.field}>
				<legend className={cls.legend}>Категория</legend>
				<select
					value={selectedCategory ?? ''}
					onChange={e =>
						handleCategoryChange(e.target.value ? Number(e.target.value) : null)
					}
					className={cls.select}
					aria-label='Выберите категорию'
				>
					<option value=''>Все категории</option>
					{categories.map(category => (
						<option key={category.id} value={category.id}>
							{category.name}
						</option>
					))}
				</select>
			</fieldset>

			<fieldset className={cls.field}>
				<legend className={cls.legend}>Цена (₽)</legend>
				<div className={cls.priceRange}>
					<input
						type='number'
						placeholder='От'
						value={minPrice}
						onChange={e => handlePriceChange(e.target.value, maxPrice)}
						min='0'
						className={cls.priceInput}
						aria-label='Минимальная цена'
					/>
					<span className={cls.dash} aria-hidden='true'>
						—
					</span>
					<input
						type='number'
						placeholder='До'
						value={maxPrice}
						onChange={e => handlePriceChange(minPrice, e.target.value)}
						min='0'
						className={cls.priceInput}
						aria-label='Максимальная цена'
					/>
				</div>
			</fieldset>

			{hasActiveFilters && (
				<button
					onClick={handleResetFilters}
					className={cls.resetBtn}
					type='button'
					aria-label='Сбросить все фильтры'
				>
					Сбросить все
				</button>
			)}
		</aside>
	)
}
