import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import cls from './style.module.scss'

export const Back = () => {
	const navigate = useNavigate()

	const handleBack = () => {
		navigate('/list')
	}

	return (
		<button className={cls.backButton} onClick={handleBack}>
			<ArrowLeft size={20} />
			<span>Вернуться к списку</span>
		</button>
	)
}
