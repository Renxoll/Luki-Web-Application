import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import apiClient from '../../../api/apiClient'
import { useAuthStore } from '../../../store/useAuthStore'

const SIGN_IN_ENDPOINT = '/iam/sign-in'
const PROFILE_ENDPOINT = '/profiles/me'

/**
 * @typedef {Object} LoginResponse
 * @property {string} token
 * @property {Object} user
 * @property {string} user.id
 * @property {string} user.email
 * @property {string} user.inboxAddress
 */

/**
 * @param {{ email: string, password: string }} credentials
 * @returns {Promise<LoginResponse>}
 */
async function login({ email, password }) {
  const { data: tokenPair } = await apiClient.post(SIGN_IN_ENDPOINT, { email, password })

  // Sign-in only returns tokens; user data lives in the profile module, so it
  // has to be fetched separately once we have an access token to authenticate with.
  const { data: profile } = await apiClient.get(PROFILE_ENDPOINT, {
    headers: { Authorization: `Bearer ${tokenPair.accessToken}` },
  })

  return {
    token: tokenPair.accessToken,
    user: { id: profile.userId, email, inboxAddress: profile.inboxAddress },
  }
}

export function useLogin() {
  const navigate = useNavigate()
  const setCredentials = useAuthStore((state) => state.setCredentials)

  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      setCredentials({ token: data.token, user: data.user })
      navigate('/dashboard')
    },
  })
}

export default useLogin
