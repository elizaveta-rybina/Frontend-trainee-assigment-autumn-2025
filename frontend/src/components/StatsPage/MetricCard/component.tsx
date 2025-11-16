import { StatsPeriod } from '@/app/api/stats.types'
import cls from './style.module.scss'

interface MetricCardProps {
	title: string
	value: string
	period?: StatsPeriod
	trend?: number
	color?: string
}

export default function MetricCard({
	title,
	value,
	period,
	trend,
	color = 'text-blue-600'
}: MetricCardProps) {
	return (
		<div className={cls.metricCard}>
			<div className={cls.metricHeader}>
				<h3 className={cls.metricTitle}>{title}</h3>
				{period && (
					<span className={cls.periodBadge}>
						{period === 'today'
							? 'Сегодня'
							: period === 'week'
							? 'Неделя'
							: 'Месяц'}
					</span>
				)}
			</div>
			<p className={`${cls.metricValue} ${color}`}>{value}</p>
			{trend !== undefined && (
				<div className={cls.trend}>
					<span className={trend > 50 ? 'text-green-600' : 'text-orange-600'}>
						{trend > 50 ? 'Высокий' : 'Низкий'} процент
					</span>
				</div>
			)}
		</div>
	)
}
