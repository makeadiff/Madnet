import {
  IonPage,
  IonList,
  IonItem,
  IonLabel,
  IonContent,
  IonSegment,
  IonSegmentButton,
  IonChip,
  IonIcon,
  IonFab,
  IonFabButton,
} from '@ionic/react'
import React from 'react'
import { pencil } from 'ionicons/icons'
import { useParams } from 'react-router-dom'

import { PROJECT_IDS, PROJECT_KEYS } from '../../utils/Constants'
import Title from '../../components/Title'
import { dataContext } from '../../contexts/DataContext'
import './Shelters.css'

const ShelterView = () => {
  const { shelter_id, param_project_id } = useParams()
  const [shelter, setShelter] = React.useState({
    name: '',
    projects: [],
    students: []
  })
  const [project_id, setProjectId] = React.useState(
    param_project_id ? param_project_id : "1"
  )
  const [project, setProject] = React.useState({
    id: 0,
    name: '',
    batches: [],
    levels: []
  })
  const { callApi, cache } = React.useContext(dataContext)
  // Custom text labels for specific projects.
  const [labels, setLabels] = React.useState({
    student: 'Students',
    level: 'Class Section(s)'
  })

  React.useEffect(() => {
    async function fetchShelter() {
      const shelter_data = await callApi({
        graphql: `{ 
                center(id: ${shelter_id}) { 
                    id name class_starts_on
                    projects {
                        id name
                        batches { id batch_name 
                          teachers { id } 
                        }
                        levels { id level_name }
                    }
                    students { id }
                }}`,
        cache: true,
        cache_key: `shelter_view_${shelter_id}`
      })

      setShelter(shelter_data)

      // First project is set as the default project. :TODO: This should default to current user's vertical.
      if (
        shelter_data.projects &&
        shelter_data.projects.length &&
        project_id === 0
      ) {
        setProjectId(shelter_data.projects[0].id)
        setProject(shelter_data.projects[0])
      }
    }

    if (project_id == PROJECT_IDS.AFTERCARE) {
      setLabels({ student: 'Youth', level: 'SSG(s)' })
    } else {
      setLabels({ student: 'Students', level: 'Class Section(s)' })
    }

    // Some unknown cache related issue was messing with back button functonality - hence the lot of OR cases.
    if (
      cache[`shelter_view_${shelter_id}`] === undefined ||
      !cache[`shelter_view_${shelter_id}`] ||
      !shelter.name ||
      shelter_id != shelter.id
    ) {
      fetchShelter()
    }
  }, [shelter_id, project_id, cache[`shelter_view_${shelter_id}`]])

  React.useEffect(() => {
    shelter.projects.forEach((proj) => {
      if (proj.id == project_id) {
        setProject(proj)
        return
      }
    })
  }, [project_id])

  return (
    <IonPage>
      <Title name={`Manage ${shelter.name}`} back={`/shelters`} />

      <IonContent className="dark">
        {shelter.projects.length > 1 ? (
          <IonSegment
            value={project_id}
            onIonChange={(e) => setProjectId(e.detail.value)}
          >
            {shelter.projects.map((proj, index) => {
              return (
                <IonSegmentButton value={proj.id} key={index}>
                  <IonLabel>{PROJECT_KEYS[proj.id]}</IonLabel>
                </IonSegmentButton>
              )
            })}
          </IonSegment>
        ) : null}

        <IonList>
          {project_id != PROJECT_IDS.TR_WINGMAN &&
          project_id != PROJECT_IDS.AFTERCARE ? ( // Don't show Batch list for Aftercare and TR - they have a default single batch per shelter.
            <IonItem
              className="shelterItems"
              routerLink={`/shelters/${shelter.id}/projects/${project_id}/batches`}
              routerDirection="none"
              key="batches"
            >
              <IonChip className="roles">
                {project.batches.length ?? 'See '}
              </IonChip>
              <IonLabel className="shelterList"> Batch(es)</IonLabel>
            </IonItem>
          ) : null}

          {project_id != PROJECT_IDS.TR_WINGMAN ? (
            <IonItem
              className="shelterItems"
              routerLink={`/shelters/${shelter.id}/projects/${project_id}/levels`}
              routerDirection="none"
              key="levels"
            >
              <IonChip className="roles">
                {project.levels.length ?? 'See '}
              </IonChip>
              <IonLabel className="shelterList"> {labels.level}</IonLabel>
            </IonItem>
          ) : null}

          <IonItem
            className="shelterItems"
            routerLink={`/shelters/${shelter.id}/students`}
            routerDirection="none"
            key="students"
          >
            <IonChip className="roles">
              {shelter.students ? shelter.students.length : 0}
            </IonChip>
            <IonLabel className="shelterList"> {labels.student}</IonLabel>
          </IonItem>

          {/* <IonItem className="shelterItems" routerLink={ `/shelters/${shelter.id}/notes` } routerDirection="none"  key="notes">
            <IonChip className="roles">3</IonChip>
            <IonLabel className="shelterList">Note(s) about { shelter.name }</IonLabel>
          </IonItem> */}

          {project_id == PROJECT_IDS.ED ||
          project_id == PROJECT_IDS.FP ||
          project_id == PROJECT_IDS.TR_ASV ? (
            <IonItem
              className="shelterItems"
              routerLink={`/shelters/${shelter.id}/projects/${project_id}/batch/0/level/0/view-teachers`}
              routerDirection="none"
              key="assign"
            >
              <IonChip className="roles">
                { project.batches.reduce((val, ele) => { return ele.teachers.length + val}, 0) }
              </IonChip>
              <IonLabel className="shelterList">Teacher Assignments</IonLabel>
            </IonItem>
          ) : null}
          {project_id == PROJECT_IDS.TR_WINGMAN ? (
            <IonItem
              className="shelterItems"
              routerLink={`/shelters/${shelter.id}/projects/${project_id}/view-wingmen`}
              routerDirection="none"
              key="assign"
            >
              <IonChip className="roles">
                { project.batches.reduce((val, ele) => { return ele.teachers.length + val}, 0) }
              </IonChip>
              <IonLabel className="shelterList">Wingmen Assignments</IonLabel>
            </IonItem>
          ) : null}

          <IonItem routerLink={ `/shelters/${shelter.id}/edit` } routerDirection="none" >
                        <IonLabel>Edit Class Started On Date:    {shelter.class_starts_on}</IonLabel>
                    </IonItem>

        </IonList>

        {/* <IonFab vertical="bottom" horizontal="start" slot="fixed">
          <IonFabButton
            routerLink={`/shelters/${shelter.id}/edit`}
          >
            <IonIcon icon={pencil} />
          </IonFabButton>
        </IonFab> */}
      </IonContent>
    </IonPage>
  )
}

export default ShelterView
