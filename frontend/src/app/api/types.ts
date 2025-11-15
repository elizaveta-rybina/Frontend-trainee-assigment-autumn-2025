export const AD_STATUSES = ['pending', 'approved', 'rejected', 'draft'] as const
export type AdStatus = (typeof AD_STATUSES)[number]

export const AD_PRIORITIES = ['normal', 'urgent'] as const
export type AdPriority = (typeof AD_PRIORITIES)[number]

export interface Seller {
	id: number
	name: string
	rating: string
	totalAds: number
	registeredAt: string
}

export interface Category {
	id: number
	name: string
}

export interface ModerationAction {
	id: number
	moderatorId: number
	moderatorName: string
	action: 'approved' | 'rejected'
	reason: string | null
	comment: string | null
	timestamp: string
}

export interface Characteristics {
	[key: string]: string
}

export interface Advertisement {
	id: number
	title: string
	description: string
	price: number
	category: string
	categoryId: number
	status: AdStatus
	priority: AdPriority
	createdAt: string
	updatedAt: string
	images: string[]
	seller: Seller
	characteristics: Characteristics
	moderationHistory: ModerationAction[]
}

export interface Pagination {
	page: number
	limit: number
	totalItems: number
	totalPages: number
}

export interface AdsResponse {
	ads: Advertisement[]
	pagination: Pagination
}

export interface GetAdsParams {
	page?: number
	limit?: number
	status?: AdStatus[]
	categoryId?: number
	minPrice?: number
	maxPrice?: number
	search?: string
	sortBy?: 'createdAt' | 'price' | 'priority'
	sortOrder?: 'asc' | 'desc'
}
