import { ScrollToTop } from '@/shared/ui'
import React, { Suspense } from 'react'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import { routes } from './routes'

// TODO: добавить ErrorBoundary
const AppRoutes: React.FC = () => {
	return (
		<Router>
			<ScrollToTop />
			<Suspense fallback={<div className='loading'>Загрузка...</div>}>
				<Routes>
					{routes.map(({ path, element }) => (
						<Route key={path} path={path} element={element} />
					))}
				</Routes>
			</Suspense>
		</Router>
	)
}

export default AppRoutes
