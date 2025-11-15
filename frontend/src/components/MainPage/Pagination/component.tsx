import React from 'react'
import cls from './style.module.scss'

interface PaginationProps {
	currentPage: number
	totalItems: number
	itemsPerPage?: number
	onPageChange: (page: number) => void
}

export const Pagination: React.FC<PaginationProps> = React.memo(
	({ currentPage, totalItems, itemsPerPage = 10, onPageChange }) => {
		const totalPages = Math.ceil(totalItems / itemsPerPage)

		if (totalItems === 0 || totalPages <= 1) {
			return null
		}

		const handlePageClick = (page: number) => {
			if (page >= 1 && page <= totalPages && page !== currentPage) {
				onPageChange(page)
			}
		}

		const renderPageNumbers = () => {
			const pages: (number | string)[] = []

			if (totalPages <= 7) {
				for (let i = 1; i <= totalPages; i++) {
					pages.push(i)
				}
			} else if (currentPage <= 4) {
				pages.push(1, 2, 3, 4, 5, '...', totalPages)
			} else if (currentPage >= totalPages - 3) {
				pages.push(
					1,
					'...',
					totalPages - 4,
					totalPages - 3,
					totalPages - 2,
					totalPages - 1,
					totalPages
				)
			} else {
				pages.push(
					1,
					'...',
					currentPage - 1,
					currentPage,
					currentPage + 1,
					'...',
					totalPages
				)
			}

			return pages.map((page, index) =>
				page === '...' ? (
					<span key={`ellipsis-${index}`} className={cls.ellipsis}>
						...
					</span>
				) : (
					<button
						key={page}
						onClick={() => handlePageClick(page as number)}
						className={`${cls.page} ${currentPage === page ? cls.active : ''}`}
						aria-label={`Page ${page}`}
						aria-current={currentPage === page ? 'page' : undefined}
					>
						{page}
					</button>
				)
			)
		}

		const prevDisabled = currentPage === 1
		const nextDisabled = currentPage === totalPages

		return (
			<div className={cls.paginator}>
				<button
					className={cls.arrow}
					onClick={() => handlePageClick(currentPage - 1)}
					disabled={prevDisabled}
					aria-label='Previous page'
				>
					&lt;
				</button>

				<div className={cls.pages}>{renderPageNumbers()}</div>

				<button
					className={cls.arrow}
					onClick={() => handlePageClick(currentPage + 1)}
					disabled={nextDisabled}
					aria-label='Next page'
				>
					&gt;
				</button>
			</div>
		)
	}
)

Pagination.displayName = 'Pagination'
