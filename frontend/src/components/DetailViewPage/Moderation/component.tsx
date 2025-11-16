import { AlertCircle, Check, RotateCcw, X } from 'lucide-react'
import { ModerationReason } from './consts'
import { useModeration } from './hooks'
import cls from './style.module.scss'

interface ModerationPanelProps {
	adId: number
	onSuccess?: () => void
}

export const ModerationPanel = ({ adId, onSuccess }: ModerationPanelProps) => {
	const {
		isModerating,
		moderationMode,
		selectedReason,
		customComment,
		error,
		reasons,
		isPending,
		openReject,
		openRequestChanges,
		closeModeration,
		approve,
		reject,
		requestChanges,
		setSelectedReason,
		setCustomComment
	} = useModeration(adId, onSuccess)

	const isRejectMode = moderationMode === 'reject'
	const modeConfig = {
		title: isRejectMode ? 'Причина отклонения' : 'Причина доработки',
		submitLabel: isRejectMode ? 'Отклонить' : 'Отправить на доработку',
		submitAction: isRejectMode ? reject : requestChanges
	}

	if (isModerating) {
		return (
			<div className={cls.rejectForm}>
				<div className={cls.rejectHeader}>
					<AlertCircle className='w-5 h-5' />
					<h3>{modeConfig.title}</h3>
				</div>

				<div className={cls.reasonsList}>
					{reasons.map(reason => {
						const isChecked = selectedReason === reason.id

						return (
							<label
								key={reason.id}
								className={`${cls.reasonLabel} ${isChecked ? cls.checked : ''}`}
							>
								<input
									type='radio'
									name='reason'
									value={reason.id}
									checked={isChecked}
									onChange={e =>
										setSelectedReason(e.target.value as ModerationReason)
									}
									className={cls.reasonRadio}
								/>
								<span>{reason.label}</span>
							</label>
						)
					})}
				</div>

				{selectedReason === 'Другое' && (
					<textarea
						placeholder='Укажите подробную причину...'
						value={customComment}
						onChange={e => setCustomComment(e.target.value)}
						className={cls.commentTextarea}
						rows={3}
					/>
				)}

				{error && <p className={cls.errorText}>{error}</p>}

				<div className={cls.formActions}>
					<button
						onClick={modeConfig.submitAction}
						disabled={isPending}
						className={cls.btnReject}
					>
						{isPending ? 'Обработка...' : modeConfig.submitLabel}
					</button>
					<button onClick={closeModeration} className={cls.btnCancel}>
						Отмена
					</button>
				</div>
			</div>
		)
	}

	const ActionButton = ({
		onClick,
		disabled,
		className,
		icon: Icon,
		label,
		hotkey,
		showPending
	}: any) => (
		<button
			onClick={onClick}
			disabled={disabled}
			className={`${cls.actionButton} ${className}`}
			title={`Горячая клавиша: ${hotkey}`}
		>
			<Icon className={cls.icon} />
			<span className={cls.label}>{label}</span>
			<kbd className={cls.kbd}>{hotkey}</kbd>
			{showPending && isPending && (
				<span className={cls.status}>Обработка...</span>
			)}
		</button>
	)

	return (
		<div className={cls.buttonsGrid}>
			<ActionButton
				onClick={approve}
				disabled={isPending}
				className={cls.approve}
				icon={Check}
				label='Одобрить'
				hotkey='A'
				showPending
			/>

			<ActionButton
				onClick={openReject}
				disabled={isPending}
				className={cls.reject}
				icon={X}
				label='Отклонить'
				hotkey='D'
			/>

			<ActionButton
				onClick={openRequestChanges}
				disabled={isPending}
				className={cls.requestChanges}
				icon={RotateCcw}
				label='На доработку'
				hotkey='R'
				showPending
			/>
		</div>
	)
}
