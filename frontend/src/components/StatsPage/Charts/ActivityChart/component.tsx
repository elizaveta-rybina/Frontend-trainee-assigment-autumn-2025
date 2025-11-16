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

interface ActivityChartProps {
	data: {
		date: string
		approved: number
		rejected: number
		requestChanges: number
	}[]
}

export default function ActivityChart({ data }: ActivityChartProps) {
	const chartData = data.map(d => {
		const total = d.approved + d.rejected + (d.requestChanges || 0)
		return {
			date: new Date(d.date).toLocaleDateString('ru', { weekday: 'short' }),
			total
		}
	})

	if (!chartData.length || chartData.every(d => d.total === 0)) {
		return <div className={cls.empty}>Нет активности</div>
	}

	const dataChart = {
		labels: chartData.map(d => d.date),
		datasets: [
			{
				label: 'Активность',
				data: chartData.map(d => d.total),
				backgroundColor: '#0d8c8b',
				borderRadius: 4
			}
		]
	}

	const options = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: { display: false },
			tooltip: { enabled: true }
		},
		scales: {
			x: {
				ticks: { font: { size: 12 }, color: '#6b7280' },
				grid: { display: false }
			},
			y: {
				ticks: { font: { size: 12 }, color: '#6b7280' },
				grid: { color: '#e5e7eb' }
			}
		}
	}

	return (
		<div
			className={cls.chartContainer}
			style={{ width: '100%', height: 250, padding: 10 }}
		>
			<Bar data={dataChart} options={options} />
		</div>
	)
}
