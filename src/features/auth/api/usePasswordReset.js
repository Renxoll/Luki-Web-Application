import { useMutation } from '@tanstack/react-query'
import { requestPasswordReset, confirmPasswordReset } from './authApi'

export function useRequestPasswordReset() {
  return useMutation({ mutationFn: requestPasswordReset })
}

export function useConfirmPasswordReset() {
  return useMutation({ mutationFn: confirmPasswordReset })
}
