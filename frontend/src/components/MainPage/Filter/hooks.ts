import type { AdStatus, GetAdsParams } from '@/app/api/types'
import { useCallback, useEffect, useMemo, useState } from 'react'

const PRICE_DEBOUNCE_MS = 500

interface UseFiltersProps {
	currentParams: GetAdsParams
	onParamsChange: (params: GetAdsParams) => void
}

interface UseFiltersReturn {
	selectedStatuses: AdStatus[]
	selectedCategory: number | null
	minPrice: string
	maxPrice: string
	hasActiveFilters: boolean
	handleStatusToggle: (status: AdStatus) => void
	handleCategoryChange: (categoryId: number | null) => void
	handlePriceChange: (newMinPrice: string, newMaxPrice: string) => void
	handleResetFilters: () => void
}

export const useFilters = ({
	currentParams,
	onParamsChange
}: UseFiltersProps): UseFiltersReturn => {
	const [selectedStatuses, setSelectedStatuses] = useState<AdStatus[]>(
		Array.isArray(currentParams.status) ? currentParams.status : []
	)
	const [selectedCategory, setSelectedCategory] = useState<number | null>(
		currentParams.categoryId ?? null
	)
	const [minPrice, setMinPrice] = useState<string>(
		currentParams.minPrice?.toString() ?? ''
	)
	const [maxPrice, setMaxPrice] = useState<string>(
		currentParams.maxPrice?.toString() ?? ''
	)
	const [priceTimeout, setPriceTimeout] = useState<NodeJS.Timeout | null>(null)

	useEffect(() => {
		setSelectedStatuses(
			Array.isArray(currentParams.status) ? currentParams.status : []
		)
		setSelectedCategory(currentParams.categoryId ?? null)
		setMinPrice(currentParams.minPrice?.toString() ?? '')
		setMaxPrice(currentParams.maxPrice?.toString() ?? '')
	}, [currentParams])

	const handleStatusToggle = useCallback(
		(status: AdStatus) => {
			setSelectedStatuses(prev => {
				const newStatuses = prev.includes(status)
					? prev.filter(s => s !== status)
					: [...prev, status]

				onParamsChange({
					...currentParams,
					status: newStatuses.length > 0 ? newStatuses : undefined,
					page: 1
				})

				return newStatuses
			})
		},
		[currentParams, onParamsChange]
	)

	const handleCategoryChange = useCallback(
		(categoryId: number | null) => {
			setSelectedCategory(categoryId)
			onParamsChange({
				...currentParams,
				categoryId: categoryId ?? undefined,
				page: 1
			})
		},
		[currentParams, onParamsChange]
	)

	const handlePriceChange = useCallback(
		(newMinPrice: string, newMaxPrice: string) => {
			setMinPrice(newMinPrice)
			setMaxPrice(newMaxPrice)

			if (priceTimeout) clearTimeout(priceTimeout)

			const timeout = setTimeout(() => {
				onParamsChange({
					...currentParams,
					minPrice: newMinPrice ? Number(newMinPrice) : undefined,
					maxPrice: newMaxPrice ? Number(newMaxPrice) : undefined,
					page: 1
				})
			}, PRICE_DEBOUNCE_MS)

			setPriceTimeout(timeout)
		},
		[currentParams, onParamsChange, priceTimeout]
	)

	const handleResetFilters = useCallback(() => {
		setSelectedStatuses([])
		setSelectedCategory(null)
		setMinPrice('')
		setMaxPrice('')

		onParamsChange({
			page: 1,
			categoryId: undefined,
			minPrice: undefined,
			maxPrice: undefined,
			status: undefined,
			limit: currentParams.limit
		})
	}, [currentParams.limit, onParamsChange])

	const hasActiveFilters = useMemo<boolean>(() => {
		return (
			selectedStatuses.length > 0 ||
			selectedCategory !== null ||
			minPrice.length > 0 ||
			maxPrice.length > 0
		)
	}, [selectedStatuses, selectedCategory, minPrice, maxPrice])

	return {
		selectedStatuses,
		selectedCategory,
		minPrice,
		maxPrice,
		hasActiveFilters,
		handleStatusToggle,
		handleCategoryChange,
		handlePriceChange,
		handleResetFilters
	}
}
