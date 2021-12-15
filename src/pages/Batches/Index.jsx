import {
  IonPage,
  IonList,
  IonItem,
  IonLabel,
  IonContent,
  IonIcon,
  IonFab,
  IonFabButton
} from '@ionic/react'
import { add } from 'ionicons/icons'
import React from 'react'
import { useParams } from 'react-router-dom'

import { dataContext } from '../../contexts/DataContext'
import Title from '../../components/Title'

const BatchIndex = () => {
  const { callApi, cache, unsetLocalCache } = React.useContext(dataContext)
  const [shelter, setShelter] = React.useState({ name: '' })
  const [batches, setBatches] = React.useState([])
  const [project, setProject] = React.useState({ id: 0, name: '' })
  const { shelter_id, project_id } = useParams()
  const cache_key = `shelter_${shelter_id}_project_${project_id}_batch_index`

  React.useEffect(() => {
    async function fetchBatchList() {
      const data = await callApi({
        graphql: `{
                batchSearch(center_id:${shelter_id}, project_id: ${project_id}) {
                    id batch_name
                }
                project(id: ${project_id}) { id name }
                center(id: ${shelter_id}) { id name }
            }`,
        cache: true,
        cache_key: cache_key
      })
      if (data.center) {
        setShelter(data.center)
      } else {
        setShelter({ name: 'No Shelter' })
      }
      if (data.batchSearch) {
        setBatches(data.batchSearch)
      } else {
        setBatches([])
      }
      if (data.project) {
        setProject(data.project)
      } else {
        setProject({ id: -99, name: 'No Batches' })
      }
    }

    if (
      cache[cache_key] ===
        undefined ||
      !cache[cache_key]
    ) {
      fetchBatchList()
    }
  }, [
    shelter_id,
    project_id,
    cache[cache_key]
  ])

  return (
    <IonPage>
      <Title
        name={`Batches in ${shelter.name}(${project.name})`}
        back={`/shelters/${shelter_id}/projects/${project_id}`}
        refresh={() => {
          unsetLocalCache(cache_key)
          window.location.reload()
        }}
      />

      <IonContent className="dark">
        <IonList>
          {
          (batches.length > 0) ? (
            batches.map((batch, index) => {
            return (
              <IonItem
                key={index}
                routerLink={`/shelters/${shelter.id}/projects/${project_id}/batches/${batch.id}`}
                routerDirection="none"
              >
                <IonLabel>{batch.batch_name}</IonLabel>
              </IonItem>
            )
          })
          ) : (
            <IonItem>
              <IonLabel>No Batches Found</IonLabel>
            </IonItem>
          )
        }
        </IonList>

        <IonFab vertical="bottom" horizontal="start" slot="fixed">
          <IonFabButton
            routerLink={`/shelters/${shelter.id}/projects/${project_id}/batches/0`}
          >
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  )
}

export default BatchIndex
