import { useMutation } from '@tanstack/react-query'
import apiClient from '../../../api/apiClient'

const AUTHORIZE_ENDPOINT = '/gmail/oauth/authorize'

/**
 * @returns {Promise<string>} la URL de consentimiento de Google.
 */
async function fetchAuthorizationUrl() {
  const { data } = await apiClient.get(AUTHORIZE_ENDPOINT)
  return data.authorizationUrl
}

export function useConnectGmail() {
  return useMutation({
    mutationFn: fetchAuthorizationUrl,
    onSuccess: (authorizationUrl) => {
      // Navegación real del browser, no un fetch más: acá es donde el usuario ve y
      // aprueba el consentimiento de Google.
      window.location.href = authorizationUrl
    },
  })
}

export default useConnectGmail
