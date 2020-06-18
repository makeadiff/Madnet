import { IonPage,IonList,IonItem,IonLabel,IonContent, IonButton } from '@ionic/react'
import React from 'react'

import { authContext } from "../../contexts/AuthContext"
import { dataContext } from "../../contexts/DataContext"
import { appContext } from "../../contexts/AppContext"
import { useParams } from "react-router-dom"
import Title from "../../components/Title"

const TeacherView = () => {
    const {user} = React.useContext(authContext)
    const {shelter_id, project_id} = useParams()
    const {callApi} = React.useContext(dataContext)
    const [ cityId ] = React.useState(user.city_id)
    const [batches , setBatches] = React.useState([])
    // const [project, setProject] = React.useState("")
    const [ location, setLocation ] = React.useState("")

    React.useEffect(() => {
        async function fetchMapping() {
             const data=  await callApi({graphql: `{
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
              }`});
            
                const city_name = await callApi({url: "cities/" + cityId });
                // const project_name = await callApi({graphql:`project(id:${project_id}){name}`});

                
                setBatches(data)
                setLocation(city_name.name)
                
        } fetchMapping()}
     ,[cityId, shelter_id, project_id])
       


    return(
        <IonPage>
            <Title name={`Assigned Teachers for ${location}`} />
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
                                                <p>Class:{alloc.level.level_name}</p>
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