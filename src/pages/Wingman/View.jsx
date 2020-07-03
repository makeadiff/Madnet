import { IonPage,IonList,IonItem,IonLabel,IonContent, IonSelect, IonSelectOption, IonButton, IonPopover } from '@ionic/react'
import React from 'react'

import { authContext } from "../../contexts/AuthContext"
import { dataContext } from "../../contexts/DataContext"
import { appContext } from "../../contexts/AppContext"
import { useParams } from "react-router-dom"
import Title from "../../components/Title"

const WingmanView = () => {
    const { shelter_id, project_id } = useParams()
    const { callApi } = React.useContext(dataContext)
    const [ batches , setBatches ] = React.useState([])

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
              }`, cache: false});
            
            setBatches(data.batchSearch)
            
        } 
        fetchMapping();
    },[shelter_id, project_id])



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
                                        {(batch.allocations.map((alloc, ind) =>{
                                            return(
                                            <IonItem key = {ind}> 
                                              <IonLabel>  
                                                <p>Wingman: {alloc.user.name}</p>
                                                {(alloc.level.students.map((student, index)=> {
                                                    return(
                                                    
                                                        <IonLabel key={index}>
                                                            <p>Student:{student.name}</p>
                                                        </IonLabel>
                                                  );
                                                     }))}
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