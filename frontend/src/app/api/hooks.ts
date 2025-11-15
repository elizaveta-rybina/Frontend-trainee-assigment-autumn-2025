import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import { useMemo } from 'react'
import { fetchAds } from './api'
import type {
	AdsResponse,
	Advertisement,
	Category,
	GetAdsParams
} from './types'

export const useAds = (
	params: GetAdsParams = {},
	options?: UseQueryOptions<AdsResponse, Error>
) =>
	useQuery<AdsResponse, Error>({
		queryKey: ['ads', params],
		queryFn: () => fetchAds(params),
		staleTime: 60_000,
		gcTime: 5 * 60_000,
		...options
	})

// найти более простой способ получения категорий без отдельного запроса
export const useCategoriesFromAds = (ads: Advertisement[]): Category[] => {
	return useMemo(() => {
		const map = new Map<number, string>()

		for (const ad of ads) {
			if (ad.categoryId && ad.category) {
				map.set(ad.categoryId, ad.category)
			}
		}

		return Array.from(map.entries()).map(([id, name]) => ({ id, name }))
	}, [ads])
}
