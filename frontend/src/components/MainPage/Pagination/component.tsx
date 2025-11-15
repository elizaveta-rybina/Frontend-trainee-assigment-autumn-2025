import React from 'react'
import cls from './style.module.scss'

interface PaginationProps {
	onPrevPageClick: () => void
	onNextPageClick: () => void
	disable: { left: boolean; right: boolean }
	nav?: { current: number; total: number }
}

export const Pagination: React.FC<PaginationProps> = React.memo(
	({ onPrevPageClick, onNextPageClick, disable, nav }) => {
		return (
			<div className={cls.paginator}>
				<button
					className={cls.arrow}
					onClick={onPrevPageClick}
					disabled={disable.left}
					aria-label='Previous page'
				>
					&lt;
				</button>

				{nav && (
					<span className={cls.navigation}>
						{nav.current} / {nav.total}
					</span>
				)}

				<button
					className={cls.arrow}
					onClick={onNextPageClick}
					disabled={disable.right}
					aria-label='Next page'
				>
					&gt;
				</button>
			</div>
		)
	}
)
