export const MODERATION_REASONS = [
	'Запрещенный товар',
	'Неверная категория',
	'Некорректное описание',
	'Проблемы с фото',
	'Подозрение на мошенничество',
	'Другое'
] as const

export const AD_STATUSES = ['pending', 'approved', 'rejected', 'draft'] as const
export const AD_PRIORITIES = ['normal', 'urgent'] as const
