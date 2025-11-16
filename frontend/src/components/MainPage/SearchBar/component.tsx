import React, { useEffect, useRef } from 'react'
import cls from './style.module.scss'

interface SearchBarProps {
	value: string
	onChange: (value: string) => void
}

export const SearchBar: React.FC<SearchBarProps> = React.memo(
	({ value, onChange }) => {
		const inputRef = useRef<HTMLInputElement>(null)

		useEffect(() => {
			const handleKeydown = (e: KeyboardEvent) => {
				if (
					e.key === '/' &&
					!['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName) &&
					!e.ctrlKey &&
					!e.metaKey &&
					!e.altKey &&
					!e.shiftKey
				) {
					e.preventDefault()
					inputRef.current?.focus()
				}
			}

			window.addEventListener('keydown', handleKeydown)
			return () => window.removeEventListener('keydown', handleKeydown)
		}, [])

		return (
			<fieldset className={cls.field}>
				<legend className={cls.legend}>Поиск</legend>
				<input
					ref={inputRef}
					type='search'
					placeholder='Поиск по названию...'
					value={value}
					onChange={e => onChange(e.target.value)}
					className={cls.input}
					aria-label='Поиск по названию объявления'
				/>
			</fieldset>
		)
	}
)

SearchBar.displayName = 'SearchBar'
