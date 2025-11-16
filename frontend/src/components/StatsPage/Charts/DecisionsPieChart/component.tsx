import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js'
import { Pie } from 'react-chartjs-2'

ChartJS.register(ArcElement, Tooltip, Legend)

interface DecisionsPieChartProps {
	approvedPercentage: number
	rejectedPercentage: number
	requestChangesPercentage: number
}

const COLORS = ['#10b981', '#ef4444', '#f59e0b']

export default function DecisionsPieChart({
	approvedPercentage,
	rejectedPercentage,
	requestChangesPercentage
}: DecisionsPieChartProps) {
	const rawData = [
		{ name: 'Одобрено', value: approvedPercentage },
		{ name: 'Отклонено', value: rejectedPercentage },
		{ name: 'На доработку', value: requestChangesPercentage }
	]

	const dataFiltered = rawData.filter(d => d.value > 0)

	if (dataFiltered.length === 0) {
		return (
			<div>
				<p>Нет решений за период</p>
			</div>
		)
	}

	const data = {
		labels: dataFiltered.map(d => d.name),
		datasets: [
			{
				data: dataFiltered.map(d => d.value),
				backgroundColor: COLORS.slice(0, dataFiltered.length),
				borderWidth: 1,
				borderColor: '#fff'
			}
		]
	}

	const options = {
		plugins: {
			tooltip: {
				callbacks: {
					label: (tooltipItem: any) => `${tooltipItem.raw.toFixed(1)}%`
				}
			},
			legend: {
				position: 'bottom' as const,
				labels: {
					usePointStyle: true,
					pointStyle: 'circle'
				}
			}
		},
		cutout: '60%'
	}

	return (
		<div
			style={{
				width: 380,
				height: 300,
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center'
			}}
		>
			<Pie data={data} options={options} />
		</div>
	)
}
