import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { approveGroupDeletion, cancelGroupDeletion, fetchGroupDetail, requestGroupDeletion } from './groupsApi'

/**
 * Las tres mutaciones del borrado por consenso. `approve` puede terminar borrando el grupo
 * (cuando ya aprobaron todos): en ese caso navegamos de vuelta a /groups; si todavía falta
 * gente, el refetch del detalle muestra el banner actualizado.
 */
export function useGroupDeletion(groupId) {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['groups', groupId] })
    queryClient.invalidateQueries({ queryKey: ['groups'], exact: true })
  }

  const request = useMutation({
    mutationFn: () => requestGroupDeletion(groupId),
    onSuccess: invalidate,
  })

  const approve = useMutation({
    mutationFn: () => approveGroupDeletion(groupId),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ['groups'], exact: true })
      let groupStillExists = true
      try {
        await fetchGroupDetail(groupId)
      } catch (error) {
        if (error?.response?.status === 404) groupStillExists = false
      }
      if (groupStillExists) {
        queryClient.invalidateQueries({ queryKey: ['groups', groupId] })
      } else {
        queryClient.removeQueries({ queryKey: ['groups', groupId] })
        navigate('/groups', { replace: true })
      }
    },
  })

  const cancel = useMutation({
    mutationFn: () => cancelGroupDeletion(groupId),
    onSuccess: invalidate,
  })

  return { request, approve, cancel }
}

export default useGroupDeletion
