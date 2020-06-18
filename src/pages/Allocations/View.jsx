import { IonPage,IonList,IonItem,IonLabel,IonContent, IonButton } from '@ionic/react'
import React from 'react'

import { dataContext } from "../../contexts/DataContext"
import { useParams } from "react-router-dom"
import Title from "../../components/Title"

const TeacherView = () => {
    const { shelter_id, project_id } = useParams()
    const { callApi } = React.useContext(dataContext)
    const [ batches , setBatches ] = React.useState([])
    const [ shelter, setShelter ] = React.useState("")

    React.useEffect(() => {
        async function fetchMapping() {
            const data =  await callApi({graphql: `{
                center(id: ${shelter_id}) { name }
                batchSearch(center_id:${shelter_id}, project_id: ${project_id}) {
                    id batch_name 
                    allocations {
                      role
                      user {
                        id name
                      }
                      level {
                        id level_name
                      }
                      subject {
                        id name
                      }
                    }
                }
              }`, cache: false});
            
            setShelter(data.center.name)
            setBatches(data.batchSearch)
            
        } 
        fetchMapping();
    },[shelter_id, project_id])


    const project_key = {1: "Ed Support", 2: "FP", 4: "TR ASV", 5: "TR Wingman", 6: "Aftercare"}

    return(
        <IonPage>
            <Title name={`Assigned Teachers at ${shelter} (${project_key[project_id]})`} />
            <IonItem routerLink = {`/shelters/${shelter_id}/projects/${project_id}/assign-teachers`} routerDirection = "none" >
                <IonButton> Add New Teacher</IonButton>
            </IonItem>
            <IonContent>
                <IonList>
                    {(batches.map((batch, index) => {
                        return( 
                            <IonItem key = {index}>
                                <IonLabel><h1>{batch.batch_name}</h1>
                                    <IonList>
                                        {(batch.allocations.map((alloc, ind) =>{
                                            return(
                                            <IonItem key = {ind}> 
                                              <IonLabel>  
                                                <p>Teacher: {alloc.user.name}</p>
                                                <p>Class Section: {alloc.level.level_name}</p>
                                                {(alloc.subject != null) ? <p>Subject: {alloc.subject.name}</p> : [<p>Subject: None </p>]} 
                                              </IonLabel>
                                            </IonItem>  
                                            );
                                        }))
                                        }
                                        </IonList>
                                </IonLabel> 
                            </IonItem>
                        );
                    }))}
                </IonList>
            </IonContent> 
        </IonPage>
    );
};

export default TeacherView