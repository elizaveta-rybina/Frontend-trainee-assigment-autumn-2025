import { StatsPeriod } from '@/app/api/stats.types'
import cls from './style.module.scss'

interface PeriodSelectorProps {
	value: StatsPeriod
	onChange: (value: StatsPeriod) => void
}

const periods: { value: StatsPeriod; label: string }[] = [
	{ value: 'today', label: 'Сегодня' },
	{ value: 'week', label: 'Неделя' },
	{ value: 'month', label: 'Месяц' }
]

export default function PeriodSelector({
	value,
	onChange
}: PeriodSelectorProps) {
	return (
		<div className={cls.periodSelector}>
			{periods.map(p => (
				<button
					key={p.value}
					onClick={() => onChange(p.value)}
					className={`${cls.periodBtn} ${value === p.value ? cls.active : ''}`}
				>
					{p.label}
				</button>
			))}
		</div>
	)
}
