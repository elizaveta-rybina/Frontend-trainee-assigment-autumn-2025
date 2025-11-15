import { useEffect } from 'react'
import { useLocation, useNavigationType } from 'react-router-dom'

// Вспомогательный компонент для прокрутки страницы вверх при навигации
export const ScrollToTop = () => {
	const { pathname } = useLocation()
	const navigationType = useNavigationType()

	useEffect(() => {
		if (navigationType !== 'POP') {
			window.scrollTo(0, 0)
		}
	}, [pathname, navigationType])

	return null
}
