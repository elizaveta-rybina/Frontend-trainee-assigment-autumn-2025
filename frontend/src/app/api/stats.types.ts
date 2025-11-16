export type StatsPeriod = 'today' | 'week' | 'month' | 'custom'

export interface StatsPeriodParams {
	period?: StatsPeriod
	startDate?: string
	endDate?: string
}

export interface StatsSummaryRaw {
	totalReviewed: number
	totalReviewedToday: number
	totalReviewedThisWeek: number
	totalReviewedThisMonth: number
	approvedPercentage: number
	rejectedPercentage: number
	requestChangesPercentage: number
	averageReviewTime: number
}

export interface ApiStatsResponse<T> {
	data: T
	meta?: {
		generatedAt: string
		period: StatsPeriod | 'custom'
		startDate?: string
		endDate?: string
	}
}

export interface ActivityData {
	date: string
	approved: number
	rejected: number
	requestChanges: number
}

export interface DecisionsData {
	approved: number
	rejected: number
	requestChanges: number
}

export type CategoryStats = Record<string, number>

export interface ModeratorStats {
	totalReviewed: number
	todayReviewed: number
	thisWeekReviewed: number
	thisMonthReviewed: number
	averageReviewTime: number
	approvalRate: number
}

export interface Moderator {
	id: number
	name: string
	email: string
	role: 'moderator' | 'senior_moderator' | 'admin'
	avatar?: string
	joinedAt?: string
	isActive?: boolean
	statistics?: ModeratorStats
	permissions?: string[]
}

export type ModeratorResponse = ApiStatsResponse<Moderator>

export type StatsSummaryResponse = StatsSummaryRaw
export type ActivityChartResponse = ApiStatsResponse<ActivityData[]>
export type DecisionsChartResponse = DecisionsData
export type CategoriesChartResponse = ApiStatsResponse<CategoryStats>
