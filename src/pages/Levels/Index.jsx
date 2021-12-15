import {
  IonPage,
  IonList,
  IonItem,
  IonLabel,
  IonContent,
  IonIcon,
  IonFab,
  IonFabButton,
  IonChip
} from '@ionic/react'
import { add } from 'ionicons/icons'
import React from 'react'
import { useParams } from 'react-router-dom'

import { PROJECT_IDS } from '../../utils/Constants'
import { dataContext } from '../../contexts/DataContext'
import Title from '../../components/Title'

const LevelIndex = () => {
  const { callApi, cache, unsetLocalCache } = React.useContext(dataContext)
  const [shelter, setShelter] = React.useState({ name: '' })
  const [levels, setLevels] = React.useState([])
  const [project, setProject] = React.useState({ id: 0, name: '' })
  const { shelter_id, project_id } = useParams()
  const [labels, setLabels] = React.useState({
    level: 'Class Section',
    students: 'Students',
    teachers: 'Teachers'
  })
  const cache_key = `shelter_${shelter_id}_project_${project_id}_level_index`

  React.useEffect(() => {
    async function fetchLevelList() {
      const data = await callApi({
        graphql: `{
                levels(center_id: ${shelter_id}, project_id: ${project_id}, sort_order: [
                      {field: "grade", order: ASC}, 
                      {field: "name", order: ASC}
                  ]) { 
                    id name level_name 
                    students {
                        id
                    }
                    teachers {
                        id
                    }
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
      if (data.project) {
        setProject(data.project)
      } else {
        setProject({ id: -99, name: 'No Classes' })
      }
      setLevels(data.levels)
    }

    if (project_id === PROJECT_IDS.AFTERCARE) {
      setLabels({ level: 'SSG', students: 'Youth', teachers: 'Volunteers' })
    } else {
      setLabels({
        level: 'Class Section',
        students: 'Students',
        teachers: 'Teachers'
      })
    }

    if (cache[cache_key] === undefined || !cache[cache_key]) {
      fetchLevelList()
    }
  }, [
    shelter_id,
    project_id,
    cache[cache_key]
  ])

  return (
    <IonPage>
      <Title
        name={project_id == PROJECT_IDS.AFTERCARE ? 'SSGs' : `Class Sections in ${shelter.name}(${project.name})`}
        back={`/shelters/${shelter_id}/projects/${project_id}`}
        refresh={() => {
          unsetLocalCache(cache_key)
          window.location.reload()
        }}
      />

      <IonContent className="dark">
        <IonList>
          {
          (levels.length > 0) ? (
            levels.map((level, index) => {
              return (
                <IonItem
                  key={index}
                  routerLink={`/shelters/${shelter_id}/projects/${project_id}/levels/${level.id}`}
                >
                  <IonLabel>{level.level_name}</IonLabel>
                  <IonChip className="roles">
                    {level.students ? level.students.length : 0} {labels.students}
                    (s)
                  </IonChip>
                  <IonChip className="roles">
                    {level.teachers ? level.teachers.length : 0} {labels.teachers}
                    (s)
                  </IonChip>
                </IonItem>
              )
            })
          ) : (
            <IonItem>
              <IonLabel>No {labels.level}s Found</IonLabel>
            </IonItem>
          )
        }
        </IonList>

        <IonFab vertical="bottom" horizontal="start" slot="fixed">
          <IonFabButton
            routerLink={`/shelters/${shelter_id}/projects/${project_id}/levels/0`}
          >
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  )
}

export default LevelIndex
