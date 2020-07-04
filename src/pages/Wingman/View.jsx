import { IonPage,IonList,IonItem,IonLabel,IonContent, IonButton } from '@ionic/react'
import React from 'react'

import { dataContext } from "../../contexts/DataContext"
import { useParams } from "react-router-dom"
import Title from "../../components/Title"

// :TODO: Have a delete assignment option.

const WingmanView = () => {
    const { shelter_id, project_id } = useParams()
    const { callApi, cache } = React.useContext(dataContext)
    const [ batches, setBatches ] = React.useState([])

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
                            students {
                                id name
                            }
                        }
                        subject {
                            id name
                        }
                    }
                }
              }`, cache: true, cache_key: `wingman_view_${shelter_id}_${project_id}`});

            setBatches(data.batchSearch)
        }
        
        // If Cache is empty, reload the data.
        if(cache[`wingman_view_${shelter_id}_${project_id}`] === undefined || !cache[`wingman_view_${shelter_id}_${project_id}`]) {
            fetchMapping()
        }
    },[shelter_id, project_id, cache[`wingman_view_${shelter_id}_${project_id}`] ])

    return(
        <IonPage>
            <Title name={`Assigned Wingmen `} />
            <IonItem routerLink = {`/shelters/${shelter_id}/projects/${project_id}/assign-wingmen`} routerDirection = "none" >
                <IonButton> Add New Wingman</IonButton>
            </IonItem>
            <IonContent>
                <IonList>
                    {(batches.map((batch, index) => {
                        return( 
                            <IonItem key = {index}>
                                <IonLabel>
                                    <IonList>
                                        {(batch.allocations.map((alloc, index_2) =>{
                                            return(
                                            <IonItem key = {index_2}> 
                                              <IonLabel>  
                                                <p>Wingman: {alloc.user.name}</p>
                                                {(alloc.level.students.map((student, index_3)=> {
                                                    return(
<<<<<<< HEAD
                                                        <IonLabel key={index}>
                                                            <p>Student:{student.name}</p>
                                                        </IonLabel>
                                                        );
                                                    }))}
=======
                                                        <IonLabel key={index_3}>
                                                            <p>Student:{student.name}</p>
                                                        </IonLabel>
                                                        );
                                                     }))}
>>>>>>> upstream/develop
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

export default WingmanView