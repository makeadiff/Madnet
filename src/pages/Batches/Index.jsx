import { IonPage,IonList,IonItem,IonLabel,IonContent,IonIcon,IonFab,IonFabButton } from '@ionic/react'
import { add } from 'ionicons/icons'
import React from 'react'
import { useParams } from "react-router-dom"

import { dataContext } from "../../contexts/DataContext"
import Title from "../../components/Title"

const BatchIndex = () => {
    const { callApi , cache } = React.useContext(dataContext)
    const [shelter, setShelter] = React.useState({name: ""})
    const [batches, setBatches] = React.useState([])
    const [project, setProject] = React.useState({id:0, name:""})
    const { shelter_id, project_id } = useParams()

    React.useEffect(() => {
        async function fetchBatchList() {
            const data = await callApi({graphql: `{
                batchSearch(center_id:${shelter_id}, project_id: ${project_id}) {
                    id batch_name
                }
                project(id: ${project_id}) { id name }
                center(id: ${shelter_id}) { id name }
            }`, cache: true, cache_key:`batch_view_${shelter_id}`})
            setShelter(data.center)
            setBatches(data.batchSearch)
            setProject(data.project)
        }
        if(cache[`batch_view_${shelter_id}`] === undefined || !cache[`batch_view_${shelter_id}`]){
        fetchBatchList()}
    }, [shelter_id, project_id, cache[`batch_view_${shelter_id}`]])

    return (
        <IonPage>
            <Title name={`Batches in ${shelter.name}(${project.name})`} />
      
            <IonContent className="dark">
                <IonList>
                    {batches.map((batch, index) => {
                        return (
                            <IonItem key={index} routerLink={ `/shelters/${shelter.id}/projects/${project_id}/batches/${batch.id}` } routerDirection="none" >
                                <IonLabel>{batch.batch_name}</IonLabel>
                            </IonItem>
                        );
                    })}
                </IonList>

                <IonFab vertical="bottom" horizontal="end" slot="fixed">
                    <IonFabButton routerLink={ `/shelters/${shelter.id}/projects/${project_id}/batches/0` }><IonIcon icon={ add }/></IonFabButton>
                </IonFab>
            </IonContent>
        </IonPage>
    );
};

export default BatchIndex
