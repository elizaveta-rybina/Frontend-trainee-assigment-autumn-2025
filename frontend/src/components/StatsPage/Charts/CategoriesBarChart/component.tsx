import {
	BarElement,
	CategoryScale,
	Chart as ChartJS,
	Legend,
	LinearScale,
	Tooltip
} from 'chart.js'
import { Bar } from 'react-chartjs-2'
import cls from './style.module.scss'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

interface CategoriesBarChartProps {
	data: Record<string, number>
}

const COLORS = [
	'#8b5cf6',
	'#6366f1',
	'#f59e0b',
	'#10b981',
	'#ef4444',
	'#3b82f6',
	'#ec4899',
	'#14b8a6'
]

export default function CategoriesBarChart({ data }: CategoriesBarChartProps) {
	const chartData = Object.entries(data)
		.map(([name, value]) => ({ name, value }))
		.sort((a, b) => b.value - a.value)
		.slice(0, 8)

	if (!chartData.length) {
		return (
			<div
				style={{
					height: 300,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					color: '#9ca3af'
				}}
			>
				Нет данных по категориям
			</div>
		)
	}

	const dataChart = {
		labels: chartData.map(d => d.name),
		datasets: [
			{
				label: 'Количество',
				data: chartData.map(d => d.value),
				backgroundColor: COLORS.slice(0, chartData.length),
				borderRadius: 4
			}
		]
	}

	const options = {
		indexAxis: 'y' as const,
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: { display: false },
			tooltip: { enabled: true }
		},
		scales: {
			x: {
				ticks: { font: { size: 12 }, color: '#6b7280' },
				grid: { color: '#e5e7eb' }
			},
			y: {
				ticks: { font: { size: 12 }, color: '#6b7280' },
				grid: { display: false }
			}
		}
	}

	return (
		<div className={cls.chartContainer} style={{ height: 300 }}>
			<Bar data={dataChart} options={options} />
		</div>
	)
}
