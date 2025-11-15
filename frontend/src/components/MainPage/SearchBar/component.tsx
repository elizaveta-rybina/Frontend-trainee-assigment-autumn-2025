import React from 'react'
import cls from './style.module.scss'

interface SearchBarProps {
	value: string
	onChange: (value: string) => void
}

export const SearchBar: React.FC<SearchBarProps> = React.memo(
	({ value, onChange }) => {
		return (
			<fieldset className={cls.field}>
				<legend className={cls.legend}>Поиск</legend>
				<input
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
