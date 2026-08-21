import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { signInAndFetchProfile } from './authApi'
import { useAuthStore } from '../../../store/useAuthStore'

export function useLogin() {
  const navigate = useNavigate()
  const setCredentials = useAuthStore((state) => state.setCredentials)

  return useMutation({
    mutationFn: signInAndFetchProfile,
    onSuccess: (data) => {
      setCredentials({ token: data.token, user: data.user })
      navigate('/dashboard')
    },
  })
}

export default useLogin
