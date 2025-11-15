import { API_BASE_URL } from '@/shared/config/apiConfig'
import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import axios, { AxiosResponse } from 'axios'
import type { AdsResponse, GetAdsParams } from './types'

const fetchAds = async (params: GetAdsParams = {}): Promise<AdsResponse> => {
	const response: AxiosResponse<AdsResponse> = await axios.get(
		`${API_BASE_URL}/ads`,
		{
			params: {
				...params,
				status: params.status?.join(',')
			}
		}
	)
	return response.data
}

export const useAds = (
	params: GetAdsParams = {},
	options?: UseQueryOptions<AdsResponse, Error>
) => {
	return useQuery<AdsResponse, Error>({
		queryKey: ['ads', params],
		queryFn: () => fetchAds(params),
		staleTime: 1000 * 60,
		...options
	})
}
