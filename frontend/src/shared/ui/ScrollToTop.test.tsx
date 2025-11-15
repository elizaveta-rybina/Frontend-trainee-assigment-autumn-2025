import { render } from '@testing-library/react'
import { MemoryRouter, useNavigationType } from 'react-router-dom'
import { ScrollToTop } from './ScrollToTop'

// Мокаем useNavigationType для управления типом навигации в тестах
jest.mock('react-router-dom', () => {
	const original = jest.requireActual('react-router-dom')
	return {
		...original,
		useNavigationType: jest.fn()
	}
})

describe('ScrollToTop', () => {
	let mockNavigationType: jest.Mock

	beforeEach(() => {
		mockNavigationType = useNavigationType as unknown as jest.Mock
		window.scrollTo = jest.fn() as any
	})

	it('scrolls to top when navigation type is PUSH', () => {
		mockNavigationType.mockReturnValue('PUSH')

		render(
			<MemoryRouter initialEntries={['/start']}>
				<ScrollToTop />
			</MemoryRouter>
		)

		expect(window.scrollTo).toHaveBeenCalledWith(0, 0)
	})

	it('scrolls to top when navigation type is REPLACE', () => {
		mockNavigationType.mockReturnValue('REPLACE')

		render(
			<MemoryRouter initialEntries={['/start']}>
				<ScrollToTop />
			</MemoryRouter>
		)

		expect(window.scrollTo).toHaveBeenCalledWith(0, 0)
	})

	it('does NOT scroll to top when navigation type is POP', () => {
		mockNavigationType.mockReturnValue('POP')

		render(
			<MemoryRouter initialEntries={['/start']}>
				<ScrollToTop />
			</MemoryRouter>
		)

		expect(window.scrollTo).not.toHaveBeenCalled()
	})
})
