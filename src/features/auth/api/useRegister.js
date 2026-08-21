import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { signUp, signInAndFetchProfile } from './authApi'
import { useAuthStore } from '../../../store/useAuthStore'

/**
 * @param {{ email: string, password: string, displayName: string }} data
 */
async function register({ email, password, displayName }) {
  await signUp({ email, password, displayName })
  // Sign-up doesn't return tokens, only the new userId, so we sign in right
  // after to get the user logged in without a second manual step.
  return signInAndFetchProfile({ email, password })
}

export function useRegister() {
  const navigate = useNavigate()
  const setCredentials = useAuthStore((state) => state.setCredentials)

  return useMutation({
    mutationFn: register,
    onSuccess: (data) => {
      setCredentials({ token: data.token, user: data.user })
      navigate('/dashboard')
    },
  })
}

export default useRegister
