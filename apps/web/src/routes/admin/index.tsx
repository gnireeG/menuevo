import { useAppForm } from '#/hooks/use-form'
import { useQueryClient } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { getRestaurantsControllerFindAllQueryKey, useRestaurantsControllerCreate, useRestaurantsControllerFindAll } from 'shared-types'

export const Route = createFileRoute('/admin/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { data } = useRestaurantsControllerFindAll()
  const { mutateAsync } = useRestaurantsControllerCreate()
  const queryClient = useQueryClient()

  const createForm = useAppForm({
    defaultValues: {
      name: ''
    },
    onSubmit: async({value}) => {
      await mutateAsync({data: value})
      queryClient.invalidateQueries({queryKey: getRestaurantsControllerFindAllQueryKey()})
    }
  })

  return(
    <div>
      hallo welt.
      <p>restuarants: {JSON.stringify(data)}</p>
      <div>
        create:
        <form onSubmit={(e) =>{
          e.preventDefault();
          e.stopPropagation();
          createForm.handleSubmit();
        }}>
          <createForm.AppField name="name">
            {(field) => (
              <field.TextField label="Name" />
            )}
          </createForm.AppField>
          <createForm.AppForm>
            <createForm.SubmitButton>Create</createForm.SubmitButton>
          </createForm.AppForm>
        </form>
      </div>
    </div>
  )
}
