import { IonPage, IonList,IonItem,IonLabel,IonContent,IonSegment,IonSegmentButton } from '@ionic/react';
import React from 'react'
import { useParams } from "react-router-dom"

import Title from "../../components/Title"
import { dataContext } from "../../contexts/DataContext"

const ShelterView = () => {
    const { shelter_id } = useParams()
    const [shelter, setShelter] = React.useState({name: "", projects:[], students: []})
    const [projectId, setProjectId] = React.useState(0)
    const [project, setProject] = React.useState({id:0, name:"", batches:[], levels: []})
    const { callApi } = React.useContext(dataContext)

    React.useEffect(() => {
        async function fetchShelter() {
            const shelter_data = await callApi({graphql: `{ 
                center(id: ${shelter_id}) { 
                    id name
                    projects {
                        id name
                        batches { id batch_name }
                        levels { id level_name }
                    }
                    students { id }
                }}`});

            setShelter(shelter_data)

            // First project is set as the default project. :TODO: This should default to current user's vertical.
            if(shelter_data.projects.length) {
                setProjectId(shelter_data.projects[0].id)
                setProject(shelter_data.projects[0])
            }
        }
        fetchShelter();
    }, [shelter_id])

    React.useEffect(() => {
        shelter.projects.forEach(proj => {
            if(proj.id == projectId) {
                setProject(proj)
                return
            }
        });
    }, [projectId])

    const project_key = {1: "Ed", 2: "FP", 4: "TR ASV", 5: "TR Wingman", 6: "Aftecare"}

    return (
        <IonPage>
            <Title name={ `Manage ${shelter.name} Shelter` } />

            <IonContent>
                <IonSegment value={ projectId } onIonChange={e => setProjectId(e.detail.value)}>
                    { shelter.projects.map(( proj, index) => {
                        return (<IonSegmentButton value={ proj.id } key={index}>
                            <IonLabel>{ project_key[proj.id] }</IonLabel>
                        </IonSegmentButton>)
                    })}
                </IonSegment>

                <IonList>
               
                    <IonItem routerLink={ `/shelters/${shelter.id}/projects/${projectId}/batches` } routerDirection="none" >
                        <IonLabel>{ project.batches.length ?? "" } Batch(es)</IonLabel>
                    </IonItem>
                
                    <IonItem routerLink={ `/shelters/${shelter.id}/projects/${projectId}/levels` } routerDirection="none" >
                        <IonLabel>{ project.levels.length ?? "" } Level(s)</IonLabel>
                    </IonItem>
                
                    <IonItem routerLink={ `/shelters/${shelter.id}/students` } routerDirection="none" >
                        <IonLabel>{ shelter.students.length } Students</IonLabel>
                    </IonItem>

                    <IonItem routerLink={ `/shelters/${shelter.id}/notes` } routerDirection="none" >
                        <IonLabel>3 Note(s) about { shelter.name }</IonLabel>
                    </IonItem>

                    <IonItem routerLink={ `/shelters/${shelter.id}/projects/${projectId}/view-teachers` } routerDirection="none" >
                        <IonLabel>Assign Teachers</IonLabel>
                    </IonItem>

                    {/*<IonItem routerLink={ `/shelters/${shelter.id}/edit` } routerDirection="none" >
                        <IonLabel>Edit { shelter.name } Details</IonLabel>
                    </IonItem> */}
                
                </IonList>
            </IonContent>
        </IonPage>
    );
};

export default ShelterView;
