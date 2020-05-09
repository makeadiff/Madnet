import { IonPage,IonList,IonItem,IonLabel,IonContent,IonIcon,IonFab,IonFabButton } from '@ionic/react'
import { add } from 'ionicons/icons'
import React from 'react'
import { useParams } from "react-router-dom"

import { dataContext } from "../../contexts/DataContext"
import Title from "../../components/Title"

const LevelIndex = () => {
    const { callApi } = React.useContext(dataContext)
    const [shelter, setShelter] = React.useState({name: ""})
    const [levels, setLevels] = React.useState([])
    const [project, setProject] = React.useState({id:0, name:""})
    const { shelter_id, project_id } = useParams()

    React.useEffect(() => {
        async function fetchLevelList() {
            const data = await callApi({graphql: `{
                levels(center_id: ${shelter_id}, project_id: ${project_id}) { id name level_name }
                project(id: ${project_id}) { id name }
                center(id: ${shelter_id}) { id name }
            }`})
            setShelter(data.center)
            setProject(data.project)
            setLevels(data.levels)
        }
        fetchLevelList()
    }, [shelter_id, project_id])

    return (
        <IonPage>
            <Title name={`Levels in ${shelter.name}(${project.name})`} />
      
            <IonContent>
                <IonList>
                    {levels.map((level, index) => {
                        return (
                            <IonItem key={index} routerLink={ `/shelters/${shelter.id}/projects/${project_id}/levels/${level.id}` } routerDirection="none" >
                                <IonLabel>{level.level_name}</IonLabel>
                            </IonItem>
                        )
                    })}
                </IonList>

                <IonFab vertical="bottom" horizontal="end" slot="fixed">
                    <IonFabButton routerLink={ `/shelters/${shelter.id}/projects/${project_id}/levels/0` }><IonIcon icon={ add }/></IonFabButton>
                </IonFab>
            </IonContent>
        </IonPage>
    )
}

export default LevelIndex