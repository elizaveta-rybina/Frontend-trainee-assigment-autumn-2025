import { API_BASE_URL } from '@/shared/config/apiConfig'
import axios, { AxiosInstance } from 'axios'
import type { AdsResponse, GetAdsParams } from './types'

const api: AxiosInstance = axios.create({
	baseURL: API_BASE_URL
})

export const buildQueryParams = (params: GetAdsParams = {}): string => {
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
