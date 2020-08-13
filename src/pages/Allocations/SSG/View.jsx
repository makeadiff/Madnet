import { IonPage,IonList,IonItem,IonLabel,IonContent, IonButton } from '@ionic/react'
import React from 'react'

import { dataContext } from "../../../contexts/DataContext"
import { useParams } from "react-router-dom"
import Title from "../../../components/Title"
import { appContext } from '../../../contexts/AppContext'

// :TODO: Have a delete assignment option.

const SSGView = () => {
    const { shelter_id, project_id } = useParams()
    const { callApi, cache, unsetLocalCache } = React.useContext(dataContext)
    // const { showMessage } = React.useContext(appContext)
    const [ allocation, setAllocation ] = React.useState([])
    // const [ batch_id ]  = React.useState([])
    // const [ level_id ] = React.useState([])
    // const [ users ] = React.useState([])

    React.useEffect(() => {
        async function fetchMapping() {
            const data =  await callApi({graphql: `{
                levels(center_id: ${shelter_id}, project_id: ${project_id}) {
                  id level_name name
                  teachers {
                    id name
                  }
                  students {
                    id name
                  }
                }
              }`, cache: true, cache_key: `ssg_assignment_view_${shelter_id}_${project_id}`});

            // There is supposed to be just 1 batch. Default batch for SSG
            if(data.length) {
                setAllocation(data)
            }
        }
        
        // If Cache is empty, reload the data.
        if(cache[`ssg_assignment_view_${shelter_id}_${project_id}`] === undefined || !cache[`ssg_assignment_view_${shelter_id}_${project_id}`]) {
            fetchMapping()
        } else {
            console.log(cache[`ssg_assignment_view_${shelter_id}_${project_id}`])
        }
    }, [shelter_id, project_id, cache[`ssg_assignment_view_${shelter_id}_${project_id}`] ])

    // const deleteMapping = (x) => {
    //     callApi({url:`/allocation/${batch_id[x]}/levels/${level_id[x]}/teachers/${users[x]}`, method: 'delete'}).then(()=>{
    //         showMessage("Deleted")
    //         unsetLocalCache(`ssg_assignment_view_${shelter_id}_${project_id}`)
    //     })
    // }

    return (
        <IonPage>
            <Title name={`SSG Allocations`} />
            <IonContent className="dark"> 
                <IonList>
                    {allocation.map((level, index) => {
                        return (
                            <>
                                <IonItem key={index}>
                                    <IonLabel>SSG { level.name }</IonLabel>
                                </IonItem>

                                <IonItem class="title"><IonLabel>Youth</IonLabel></IonItem>
                                {level.students.map((stu, student_index) => {
                                    return (
                                        <IonItem key={student_index}>
                                            <IonLabel>{stu.name}</IonLabel>
                                        </IonItem>
                                    )
                                })}
                                <IonItem class="title"><IonLabel>Volunteers</IonLabel></IonItem>
                                {level.teachers.map((user, user_index) => {
                                    return (
                                        <IonItem key={user_index}>
                                            <IonLabel>{user.name}</IonLabel>
                                        </IonItem>
                                    )
                                })}
                            </>
                        )
                    })}
                    
                </IonList>
            </IonContent>
        </IonPage>
    );
};

export default SSGView