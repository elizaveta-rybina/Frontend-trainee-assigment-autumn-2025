import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from 'recharts'
import cls from './style.module.scss'

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

	console.log('chartData:', chartData)

	if (!chartData.length || chartData.every(d => d.total === 0)) {
		return <div className={cls.empty}>Нет активности</div>
	}

	return (
		<div style={{ width: '100%', height: '250px', padding: '10px' }}>
			<BarChart
				width={1100}
				height={200}
				data={chartData}
				margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
			>
				<CartesianGrid strokeDasharray='3 3' stroke='#e5e7eb' />
				<XAxis dataKey='date' tick={{ fontSize: 12 }} />
				<YAxis tick={{ fontSize: 12 }} />
				<Tooltip />
				<Bar dataKey='total' fill='#0d8c8b' radius={[4, 4, 0, 0]} />
			</BarChart>
		</div>
	)
}
