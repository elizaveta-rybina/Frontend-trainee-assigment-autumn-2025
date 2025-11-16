import { useApproveAd, useRejectAd, useRequestChanges } from '@/app/api/hooks'
import { useCallback, useEffect, useState } from 'react'
import {
	MODERATION_REASONS,
	ModerationReason,
	ModerationReasonItem
} from './consts'

export interface UseModerationReturn {
	isModerating: boolean
	moderationMode: 'reject' | 'requestChanges' | null
	selectedReason: ModerationReason | ''
	customComment: string
	error: string
	reasons: readonly ModerationReasonItem[]
	isPending: boolean

	openReject: () => void
	openRequestChanges: () => void
	closeModeration: () => void
	approve: () => void
	reject: () => void
	requestChanges: () => void

	setSelectedReason: (reason: ModerationReason | '') => void
	setCustomComment: (comment: string) => void
	setError: (error: string) => void
}

export function useModeration(
	adId: number,
	onSuccess?: () => void
): UseModerationReturn {
	const [moderationMode, setModerationMode] = useState<
		'reject' | 'requestChanges' | null
	>(null)
	const [selectedReason, setSelectedReason] = useState<ModerationReason | ''>(
		''
	)
	const [customComment, setCustomComment] = useState('')
	const [error, setError] = useState('')

	const approveMutation = useApproveAd()
	const rejectMutation = useRejectAd()
	const requestChangesMutation = useRequestChanges()

	const isPending =
		approveMutation.isPending ||
		rejectMutation.isPending ||
		requestChangesMutation.isPending

	const isModerating = moderationMode !== null

	// Доп.задание - горячие клавиши
	useEffect(() => {
		const handler = (e: KeyboardEvent) => {
			if (e.key === 'a' || e.key === 'A') {
				e.preventDefault()
				if (!isModerating && !approveMutation.isPending) {
					approveMutation.mutate(adId, { onSuccess })
				}
			}
			if (e.key === 'd' || e.key === 'D') {
				e.preventDefault()
				if (!isModerating && !rejectMutation.isPending) {
					openReject()
				}
			}
			if (e.key === 'r' || e.key === 'R') {
				e.preventDefault()
				if (!isModerating && !requestChangesMutation.isPending) {
					openRequestChanges()
				}
			}
		}

		window.addEventListener('keydown', handler)
		return () => window.removeEventListener('keydown', handler)
	}, [
		isModerating,
		approveMutation.isPending,
		rejectMutation.isPending,
		requestChangesMutation.isPending,
		adId,
		onSuccess
	])

	const openReject = useCallback(() => {
		setModerationMode('reject')
		setSelectedReason('')
		setCustomComment('')
		setError('')
	}, [])

	const openRequestChanges = useCallback(() => {
		setModerationMode('requestChanges')
		setSelectedReason('')
		setCustomComment('')
		setError('')
	}, [])

	const closeModeration = useCallback(() => {
		setModerationMode(null)
		setSelectedReason('')
		setCustomComment('')
		setError('')
	}, [])

	const approve = useCallback(() => {
		approveMutation.mutate(adId, { onSuccess })
	}, [adId, approveMutation, onSuccess])

	const reject = useCallback(() => {
		if (moderationMode !== 'reject') return

		const reasonItem = MODERATION_REASONS.find(r => r.id === selectedReason)
		if (
			!selectedReason ||
			(reasonItem?.requiresComment && !customComment.trim())
		) {
			setError('Укажите причину и комментарий')
			return
		}

		rejectMutation.mutate(
			{
				id: adId,
				body: { reason: selectedReason, comment: customComment || undefined }
			},
			{ onSuccess }
		)
		closeModeration()
	}, [
		moderationMode,
		selectedReason,
		customComment,
		adId,
		rejectMutation,
		onSuccess,
		closeModeration
	])

	const requestChanges = useCallback(() => {
		if (moderationMode !== 'requestChanges') return

		const reasonItem = MODERATION_REASONS.find(r => r.id === selectedReason)
		if (
			!selectedReason ||
			(reasonItem?.requiresComment && !customComment.trim())
		) {
			setError('Укажите причину и комментарий')
			return
		}

		requestChangesMutation.mutate(
			{
				id: adId,
				body: { reason: selectedReason, comment: customComment || undefined }
			},
			{ onSuccess }
		)
		closeModeration()
	}, [
		moderationMode,
		selectedReason,
		customComment,
		adId,
		requestChangesMutation,
		onSuccess,
		closeModeration
	])

	return {
		isModerating,
		moderationMode,
		selectedReason,
		customComment,
		error,
		reasons: MODERATION_REASONS,
		isPending,

		openReject,
		openRequestChanges,
		closeModeration,
		approve,
		reject,
		requestChanges,

		setSelectedReason,
		setCustomComment,
		setError
	}
}
