import {
	useMutation,
	useQuery,
	useQueryClient,
	UseQueryOptions
} from '@tanstack/react-query'
import { useMemo } from 'react'
import {
	approveAd,
	fetchActivityChart,
	fetchAdById,
	fetchAds,
	fetchCategoriesChart,
	fetchCurrentModerator,
	fetchDecisionsChart,
	fetchStatsSummary,
	rejectAd,
	requestChanges
} from './api'
import {
	ActivityChartResponse,
	CategoriesChartResponse,
	DecisionsChartResponse,
	ModeratorResponse,
	StatsPeriodParams,
	StatsSummaryResponse
} from './stats.types'
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

export const usePendingAds = () => {
	return useQuery<number[], Error>({
		queryKey: ['pending-ad-ids', 'all'],
		queryFn: async (): Promise<number[]> => {
			const allIds: number[] = []
			let page = 1
			let hasMore = true

			while (hasMore) {
				const response: AdsResponse = await fetchAds({
					status: ['pending'],
					page,
					limit: 100
				})

				const ids = response.ads.map(ad => ad.id)
				allIds.push(...ids)

				hasMore = page < response.pagination.totalPages
				page++
			}

			return allIds
		},
		staleTime: 5 * 60_000,
		gcTime: 10 * 60_000,
		refetchOnWindowFocus: false
	})
}

export const useStatsSummary = (
	params?: StatsPeriodParams,
	options?: UseQueryOptions<StatsSummaryResponse, Error>
) =>
	useQuery<StatsSummaryResponse, Error>({
		queryKey: [
			'stats',
			'summary',
			params?.period,
			params?.startDate,
			params?.endDate
		],
		queryFn: () => fetchStatsSummary(params),
		staleTime: 5 * 60_000,
		gcTime: 10 * 60_000,
		...options
	})

export const useActivityChart = (
	params?: StatsPeriodParams,
	options?: UseQueryOptions<ActivityChartResponse, Error>
) =>
	useQuery<ActivityChartResponse, Error>({
		queryKey: [
			'stats',
			'chart',
			'activity',
			params?.period,
			params?.startDate,
			params?.endDate
		],
		queryFn: () => fetchActivityChart(params),
		staleTime: 5 * 60_000,
		gcTime: 10 * 60_000,
		...options
	})

export const useDecisionsChart = (
	params?: StatsPeriodParams,
	options?: UseQueryOptions<DecisionsChartResponse, Error>
) =>
	useQuery<DecisionsChartResponse, Error>({
		queryKey: [
			'stats',
			'chart',
			'decisions',
			params?.period,
			params?.startDate,
			params?.endDate
		],
		queryFn: () => fetchDecisionsChart(params),
		staleTime: 5 * 60_000,
		gcTime: 10 * 60_000,
		...options
	})

export const useCategoriesChart = (
	params?: StatsPeriodParams,
	options?: UseQueryOptions<CategoriesChartResponse, Error>
) =>
	useQuery<CategoriesChartResponse, Error>({
		queryKey: [
			'stats',
			'chart',
			'categories',
			params?.period,
			params?.startDate,
			params?.endDate
		],
		queryFn: () => fetchCategoriesChart(params),
		staleTime: 5 * 60_000,
		gcTime: 10 * 60_000,
		...options
	})

export const useCurrentModerator = (
	options?: UseQueryOptions<ModeratorResponse, Error>
) =>
	useQuery<ModeratorResponse, Error>({
		queryKey: ['moderator', 'me'],
		queryFn: () => fetchCurrentModerator(),
		staleTime: 10 * 60_000,
		gcTime: 30 * 60_000,
		...options
	})
