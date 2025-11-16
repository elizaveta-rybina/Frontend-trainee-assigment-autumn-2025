import {
	useMutation,
	useQuery,
	useQueryClient,
	UseQueryOptions
} from '@tanstack/react-query'
import { useMemo } from 'react'
import {
	approveAd,
	fetchAdById,
	fetchAds,
	rejectAd,
	requestChanges
} from './api'
import type {
	AdsResponse,
	Advertisement,
	Category,
	GetAdsParams,
	ModerationRequestBody
} from './types'


// Get запросы
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

export const useAdById = (
	id: number,
	options?: UseQueryOptions<Advertisement, Error>
) =>
	useQuery<Advertisement, Error>({
		queryKey: ['ad', id],
		queryFn: () => fetchAdById(id),
		staleTime: 60_000,
		gcTime: 10 * 60_000,
		enabled: !!id && !isNaN(id),
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

// post запросы
export const useApproveAd = () => {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: approveAd,
		onSuccess: (_, id) => {
			queryClient.invalidateQueries({ queryKey: ['ads'] })
			queryClient.invalidateQueries({ queryKey: ['ad', id] })
		}
	})
}

export const useRejectAd = () => {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: ({ id, body }: { id: number; body: ModerationRequestBody }) =>
			rejectAd(id, body),
		onSuccess: (_, { id }) => {
			queryClient.invalidateQueries({ queryKey: ['ads'] })
			queryClient.invalidateQueries({ queryKey: ['ad', id] })
		}
	})
}

export const useRequestChanges = () => {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: ({ id, body }: { id: number; body: ModerationRequestBody }) =>
			requestChanges(id, body),
		onSuccess: (_, { id }) => {
			queryClient.invalidateQueries({ queryKey: ['ads'] })
			queryClient.invalidateQueries({ queryKey: ['ad', id] })
		}
	})
}
