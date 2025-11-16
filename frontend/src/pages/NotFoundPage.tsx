import cls from './NotFoundPage.module.scss'

export const NotFoundPage = () => {
	return (
		<div className={cls.container}>
			<h1 className={cls.code}>404</h1>
			<p className={cls.message}>Страница не найдена</p>
			<a href='/' className={cls.link}>
				Вернуться на главную
			</a>
		</div>
	)
}
