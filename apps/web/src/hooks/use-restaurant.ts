import { authClient } from "#/auth/auth-client"
import { useRestaurantsControllerByOrganization } from "shared-types"

export const useRestaurant = () => {
    const { data: activeOrg } = authClient.useActiveOrganization()

    return useRestaurantsControllerByOrganization(activeOrg?.id ?? "", {
        query: { enabled: !!activeOrg?.id },
    })
}