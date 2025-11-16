import { useMemo, useState } from 'react'
import cls from './style.module.scss'

import {
	useActivityChart,
	useCategoriesChart,
	useDecisionsChart,
	useStatsSummary
} from '@/app/api/hooks'
import { StatsPeriod } from '@/app/api/stats.types'

import ActivityChart from '../Charts/ActivityChart/component'
import CategoriesBarChart from '../Charts/CategoriesBarChart/component'
import DecisionsPieChart from '../Charts/DecisionsPieChart/component'
import MetricCard from '../MetricCard/component'
import PeriodSelector from '../PeriodSelector/component'

export default function ModeratorDashboard() {
	const [period, setPeriod] = useState<StatsPeriod>('week')

	const {
		data: stats,
		isLoading: loadingSummary,
		error: errorSummary
	} = useStatsSummary({ period })

	const {
		data: activityResponse,
		isLoading: loadingActivity,
		error: errorActivity
	} = useActivityChart({ period })

	const {
		data: categoriesResponse,
		isLoading: loadingCategories,
		error: errorCategories
	} = useCategoriesChart({ period })

	console.log('categoriesResponse:', categoriesResponse)

	const {
		data: decisionsResponse,
		isLoading: loadingDecisions,
		error: errorDecisions
	} = useDecisionsChart({ period })

	const activityData = useMemo(() => {
		if (!Array.isArray(activityResponse)) return []
		return activityResponse.map(item => ({
			date: item.date,
			approved: item.approved ?? 0,
			rejected: item.rejected ?? 0,
			requestChanges: item.requestChanges ?? 0
		}))
	}, [activityResponse])

	const decisionsData = useMemo(() => {
		if (!decisionsResponse) {
			return null
		}

		const { approved, rejected, requestChanges } = decisionsResponse

		return {
			approved: Number((approved ?? 0).toFixed(1)),
			rejected: Number((rejected ?? 0).toFixed(1)),
			requestChanges: Number((requestChanges ?? 0).toFixed(1))
		}
	}, [decisionsResponse])

	const categoriesData = useMemo(() => {
		return categoriesResponse || {}
	}, [categoriesResponse])

	const isLoading =
		loadingSummary || loadingActivity || loadingCategories || loadingDecisions

	const hasError =
		errorSummary || errorActivity || errorCategories || errorDecisions

	if (hasError) {
		return <div className={cls.error}>Ошибка загрузки данных</div>
	}

	if (isLoading) {
		return (
			<div className={cls.loader}>
				<div className={cls.skeleton} />
				<div className={cls.skeleton} />
				<div className={cls.skeleton} />
			</div>
		)
	}

	if (!stats) {
		return <div className={cls.error}>Нет данных за выбранный период</div>
	}

	console.log('decisionsData:', decisionsResponse)
	const total =
		period === 'today'
			? stats.totalReviewedToday
			: period === 'week'
			? stats.totalReviewedThisWeek
			: period === 'month'
			? stats.totalReviewedThisMonth
			: stats.totalReviewed

	const avgTime = stats.averageReviewTime
		? `${(stats.averageReviewTime / 1000 / 60).toFixed(1)} мин`
		: '—'

	return (
		<div className={cls.dashboard}>

			<header className={cls.header}>
				<h1 className={cls.title}>Статистика модерации</h1>
				<PeriodSelector value={period} onChange={setPeriod} />
			</header>


			<div className={cls.metricsGrid}>
				<MetricCard
					title='Проверено объявлений'
					value={total.toLocaleString('ru')}
					period={period}
				/>
				<MetricCard
					title='Одобрено'
					value={`${stats.approvedPercentage.toFixed(1)}%`}
					trend={stats.approvedPercentage}
					color='text-green-600'
				/>
				<MetricCard
					title='Отклонено'
					value={`${stats.rejectedPercentage.toFixed(1)}%`}
					trend={stats.rejectedPercentage}
					color='text-red-600'
				/>
				<MetricCard
					title='Запрос изменений'
					value={`${stats.requestChangesPercentage.toFixed(1)}%`}
					trend={stats.requestChangesPercentage}
					color='text-amber-600'
				/>
				<MetricCard title='Среднее время' value={avgTime} period={period} />
			</div>

			<div className={cls.chartsContainer}>
				<div className={cls.activityChartFull}>
					<div className={cls.chartCardFull}>
						<h3 className={cls.chartTitle}>Активность по дням</h3>
						{activityData.length === 0 ? (
							<div className={cls.emptyChartFull}>Нет активности за период</div>
						) : (
							<ActivityChart data={activityData} />
						)}
					</div>
				</div>

				<div className={cls.chartsGrid}>
					<div className={cls.chartCard}>
						<h3 className={cls.chartTitle}>Распределение решений</h3>
						<DecisionsPieChart
							approvedPercentage={decisionsData.approved ?? 0}
							rejectedPercentage={decisionsData.rejected ?? 0}
							requestChangesPercentage={decisionsData.requestChanges ?? 0}
						/>
					</div>

					<div className={cls.activityChartFull}>
						<div className={cls.chartCardFull}>
							<h3 className={cls.chartTitle}>По категориям</h3>
							{!categoriesData || Object.keys(categoriesData).length === 0 ? (
								<div className={cls.emptyChart}>Нет данных по категориям</div>
							) : (
								<CategoriesBarChart data={categoriesData} />
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
