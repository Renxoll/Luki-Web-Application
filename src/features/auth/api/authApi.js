import apiClient from '../../../api/apiClient'

const SIGN_UP_ENDPOINT = '/iam/sign-up'
const SIGN_IN_ENDPOINT = '/iam/sign-in'
const PROFILE_ENDPOINT = '/profiles/me'

/**
 * @typedef {Object} AuthResult
 * @property {string} token
 * @property {Object} user
 * @property {string} user.id
 * @property {string} user.email
 * @property {string} user.displayName
 * @property {string} user.inboxAddress
 */

/**
 * @param {{ email: string, password: string, displayName: string }} data
 * @returns {Promise<{ userId: string }>}
 */
export async function signUp({ email, password, displayName }) {
  const { data } = await apiClient.post(SIGN_UP_ENDPOINT, { email, password, displayName })
  return data
}

/**
 * @param {{ email: string, password: string }} credentials
 * @returns {Promise<AuthResult>}
 */
export async function signInAndFetchProfile({ email, password }) {
  const { data: tokenPair } = await apiClient.post(SIGN_IN_ENDPOINT, { email, password })

  // Sign-in only returns tokens; user data lives in the profile module, so it
  // has to be fetched separately once we have an access token to authenticate with.
  const { data: profile } = await apiClient.get(PROFILE_ENDPOINT, {
    headers: { Authorization: `Bearer ${tokenPair.accessToken}` },
  })

  return {
    token: tokenPair.accessToken,
    user: {
      id: profile.userId,
      email,
      displayName: profile.displayName ?? profile.name ?? null,
      inboxAddress: profile.inboxAddress,
    },
  }
}
