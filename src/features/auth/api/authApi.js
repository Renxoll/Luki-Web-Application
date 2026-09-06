import apiClient from '../../../api/apiClient'

const SIGN_UP_ENDPOINT = '/iam/sign-up'
const SIGN_IN_ENDPOINT = '/iam/sign-in'
const PROFILE_ENDPOINT = '/profiles/me'
const PASSWORD_RESET_REQUEST_ENDPOINT = '/iam/password-reset/request'
const PASSWORD_RESET_CONFIRM_ENDPOINT = '/iam/password-reset/confirm'

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

/**
 * Pide el enlace de restablecimiento. El backend responde 202 exista o no la cuenta
 * (anti-enumeración), así que un éxito acá no confirma que el email esté registrado.
 * @param {{ email: string }} data
 */
export async function requestPasswordReset({ email }) {
  await apiClient.post(PASSWORD_RESET_REQUEST_ENDPOINT, { email })
}

/**
 * Confirma el restablecimiento con el token del enlace del correo y la contraseña nueva.
 * 400 si el token no es válido / expiró / ya se usó.
 * @param {{ token: string, password: string }} data
 */
export async function confirmPasswordReset({ token, password }) {
  await apiClient.post(PASSWORD_RESET_CONFIRM_ENDPOINT, { token, password })
}
