import { useAuth } from "#/auth/query"
import { useRestaurantsControllerByOrganization } from "shared-types"

export const useRestaurant = () => {
    const { data: session } = useAuth()
    const activeOrgId = session?.session.activeOrganizationId

    return useRestaurantsControllerByOrganization(activeOrgId ?? "", {
        query: { enabled: !!activeOrgId },
    })
}
