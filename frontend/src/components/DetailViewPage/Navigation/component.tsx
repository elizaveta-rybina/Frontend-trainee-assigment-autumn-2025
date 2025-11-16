import { useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import cls from './style.module.scss'

interface ModerationNavigationProps {
	adIds: number[]
	currentAdId: number
}

export const ModerationNavigation = ({
	adIds,
	currentAdId
}: ModerationNavigationProps) => {
	const navigate = useNavigate()
	const queryClient = useQueryClient()

	const currentIndex = adIds.indexOf(currentAdId)
	const hasPrev = currentIndex > 0
	const hasNext = currentIndex < adIds.length - 1

	const goToPrev = useCallback(() => {
		if (!hasPrev) return
		const prevId = adIds[currentIndex - 1]
		navigate(`/item/${prevId}`)
		queryClient.prefetchQuery({ queryKey: ['ad', prevId] })
	}, [currentIndex, adIds, navigate, queryClient, hasPrev])

	const goToNext = useCallback(() => {
		if (!hasNext) return
		const nextId = adIds[currentIndex + 1]
		navigate(`/item/${nextId}`)
		queryClient.prefetchQuery({ queryKey: ['ad', nextId] })
	}, [currentIndex, adIds, navigate, queryClient, hasNext])

	useEffect(() => {
		const handler = (e: KeyboardEvent) => {
			if (e.key === 'ArrowLeft') {
				e.preventDefault()
				goToPrev()
			}
			if (e.key === 'ArrowRight') {
				e.preventDefault()
				goToNext()
			}
		}
		window.addEventListener('keydown', handler)
		return () => window.removeEventListener('keydown', handler)
	}, [goToPrev, goToNext])

	return (
		<div className={cls.navContainer}>
			<button
				onClick={goToPrev}
				disabled={!hasPrev}
				className={`${cls.navButton} ${cls.prev}`}
				title='Предыдущее объявление (←)'
			>
				<ArrowLeft className={cls.icon} />
				<span className={cls.label}>Предыдущее</span>
			</button>

			<div className={cls.counter}>
				{currentIndex + 1} / {adIds.length}
			</div>

			<button
				onClick={goToNext}
				disabled={!hasNext}
				className={`${cls.navButton} ${cls.next}`}
				title='Следующее объявление (→)'
			>
				<span className={cls.label}>Следующее</span>
				<ArrowRight className={cls.icon} />
			</button>
		</div>
	)
}
