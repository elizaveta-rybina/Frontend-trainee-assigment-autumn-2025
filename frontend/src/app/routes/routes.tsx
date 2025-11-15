import { lazy } from 'react'
import type { RouteObject } from 'react-router-dom'
import { Navigate } from 'react-router-dom'

const MainPage = lazy(() =>
	import('@/pages').then(m => ({ default: m.MainPage }))
)
const AnalyticsPage = lazy(() =>
	import('@/pages').then(m => ({ default: m.AnalyticsPage }))
)
const DetailViewPage = lazy(() =>
	import('@/pages').then(m => ({ default: m.DetailViewPage }))
)
const NotFoundPage = lazy(() =>
	import('@/pages').then(m => ({ default: m.NotFoundPage }))
)

export const routes: RouteObject[] = [
	{ path: '/', element: <Navigate to='/list' replace /> },
	{ path: '/list', element: <MainPage /> },
	{ path: '/stats', element: <AnalyticsPage /> },
	{ path: '/item/:id', element: <DetailViewPage /> },
	{ path: '*', element: <NotFoundPage /> }
]
