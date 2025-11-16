export const MODERATION_REASONS = [
	{
		id: 'Запрещенный товар' as const,
		label: 'Запрещённый товар',
		requiresComment: false
	},
	{
		id: 'Неверная категория' as const,
		label: 'Неверная категория',
		requiresComment: false
	},
	{
		id: 'Некорректное описание' as const,
		label: 'Некорректное описание',
		requiresComment: false
	},
	{
		id: 'Проблемы с фото' as const,
		label: 'Проблемы с фото',
		requiresComment: false
	},
	{
		id: 'Подозрение на мошенничество' as const,
		label: 'Подозрение на мошенничество',
		requiresComment: false
	},
	{ id: 'Другое' as const, label: 'Другое', requiresComment: true }
] as const

export type ModerationReasonItem = (typeof MODERATION_REASONS)[number]

export type ModerationReason = ModerationReasonItem['id']
