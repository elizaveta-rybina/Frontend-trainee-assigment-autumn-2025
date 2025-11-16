import { API_BASE_URL } from '@/shared/config/apiConfig'
import axios, { AxiosInstance } from 'axios'
import {
	ActivityChartResponse,
	ApiStatsResponse,
	CategoriesChartResponse,
	DecisionsChartResponse,
	Moderator,
	StatsPeriodParams,
	StatsSummaryResponse
} from './stats.types'
import type {
	AdsResponse,
	Advertisement,
	ApiSuccessResponse,
	ApproveAdResponse,
	GetAdsParams,
	ModerationRequestBody,
	RejectAdResponse,
	RequestChangesResponse
} from './types'

const api: AxiosInstance = axios.create({
	baseURL: API_BASE_URL
})

export const buildQueryParams = (params: Record<string, any> = {}): string => {
	const query = new URLSearchParams()

	Object.entries(params).forEach(([key, value]) => {
		if (value === undefined || value === null) return

		if (key === 'status') {
			const statuses = Array.isArray(value) ? value : [value]
			statuses.forEach(s => query.append('status', s))
			return
		}

		query.append(key, String(value))
	})

	return query.toString()
}

export const fetchAds = async (
	params: GetAdsParams = {}
): Promise<AdsResponse> => {
	const queryString = buildQueryParams(params)
	const { data } = await api.get<AdsResponse>(`/ads?${queryString}`)
	return data
}

export const fetchAdById = async (id: number): Promise<Advertisement> => {
	const { data } = await api.get<Advertisement>(`/ads/${id}`)
	return data
}

const moderateAd = async <
	TBody extends Record<string, any> | void,
	TResponse extends ApiSuccessResponse
>(
	id: number,
	endpoint: 'approve' | 'reject' | 'request-changes',
	body?: TBody
): Promise<TResponse> => {
	const { data } = await api.post<TResponse>(`/ads/${id}/${endpoint}`, body)
	return data
}

export const approveAd = (id: number): Promise<ApproveAdResponse> =>
	moderateAd(id, 'approve')

export const rejectAd = (
	id: number,
	body: ModerationRequestBody
): Promise<RejectAdResponse> => moderateAd(id, 'reject', body)

export const requestChanges = (
	id: number,
	body: ModerationRequestBody
): Promise<RequestChangesResponse> => moderateAd(id, 'request-changes', body)

export const fetchStatsSummary = async (
	params?: StatsPeriodParams
): Promise<StatsSummaryResponse> => {
	const queryString = buildQueryParams(params)
	const { data } = await api.get<StatsSummaryResponse>(
		`/stats/summary${queryString ? `?${queryString}` : ''}`
	)
	return data
}

export const fetchActivityChart = async (
	params?: StatsPeriodParams
): Promise<ActivityChartResponse> => {
	const queryString = buildQueryParams(params)
	const { data } = await api.get<ActivityChartResponse>(
		`/stats/chart/activity${queryString ? `?${queryString}` : ''}`
	)
	return data
}

export const fetchDecisionsChart = async (
	params?: StatsPeriodParams
): Promise<DecisionsChartResponse> => {
	const queryString = buildQueryParams(params)
	const { data } = await api.get<DecisionsChartResponse>(
		`/stats/chart/decisions${queryString ? `?${queryString}` : ''}`
	)
	return data
}

export const fetchCategoriesChart = async (
	params?: StatsPeriodParams
): Promise<CategoriesChartResponse> => {
	const queryString = buildQueryParams(params)
	const { data } = await api.get<CategoriesChartResponse>(
		`/stats/chart/categories${queryString ? `?${queryString}` : ''}`
	)
	return data
}

export const fetchCurrentModerator = async (): Promise<
	ApiStatsResponse<Moderator>
> => {
	const { data } = await api.get<ApiStatsResponse<Moderator>>('/moderators/me')
	return data
}
