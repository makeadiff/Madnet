import { IonPage, IonList,IonItem,IonLabel,IonContent,IonSegment,IonSegmentButton, IonChip} from '@ionic/react';
import React from 'react'
import { useParams } from "react-router-dom"

import Title from "../../components/Title"
import { dataContext } from "../../contexts/DataContext"
import './Shelters.css';
import { connect } from 'tls';

const ShelterView = () => {
    const { shelter_id } = useParams()
    const [shelter, setShelter] = React.useState({name: "", projects:[], students: []})
    const [projectId, setProjectId] = React.useState(0)
    const [project, setProject] = React.useState({id:0, name:"", batches:[], levels: []})
    const { callApi, cache } = React.useContext(dataContext)

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
                }}`, cache:  true, cache_key: `shelter_view_${shelter_id}`});                

            setShelter(shelter_data)

            // First project is set as the default project. :TODO: This should default to current user's vertical.
            if(shelter_data.projects && shelter_data.projects.length) {
                setProjectId(shelter_data.projects[0].id)
                setProject(shelter_data.projects[0])
            }
        }
        if(cache[`shelter_view_${shelter_id}`] === undefined || !cache[`shelter_view_${shelter_id}`]){
        fetchShelter();}
    }, [shelter_id, cache[`shelter_view_${shelter_id}`]] )

    React.useEffect(() => {
        shelter.projects.forEach(proj => {
            if(proj.id == projectId) {
                setProject(proj)
                return
            }
        });
    }, [projectId])
    

    const project_key = {1: "Ed", 2: "FP", 4: "TR ASV", 5: "TR Wingman", 6: "Aftercare"}

    const TR_Wingman_project_id = 5

    return (
        <IonPage>
            <Title name={ `Manage ${shelter.name}` } />

            <IonContent className="dark">
                {shelter.projects ? (
                    <IonSegment value={ projectId } onIonChange={e => setProjectId(e.detail.value)}>
                        { shelter.projects.map(( proj, index) => {
                            return (<IonSegmentButton value={ proj.id } key={index}>
                                <IonLabel>{ project_key[proj.id] }</IonLabel>
                            </IonSegmentButton>)
                        })}
                    </IonSegment>
                ): null}                

                <IonList>
                    {(projectId != TR_Wingman_project_id) ?
                        [<IonItem className="shelterItems" routerLink={ `/shelters/${shelter.id}/projects/${projectId}/batches` } routerDirection="none" key="batches">
                            <IonChip className="roles"> { project.batches.length ?? "" } </IonChip>
                         <IonLabel className="shelterList"> Batch(es)</IonLabel>
                        </IonItem>] :[]
                    }
                    
                    {(projectId != TR_Wingman_project_id) ?
                        [<IonItem className="shelterItems" routerLink={ `/shelters/${shelter.id}/projects/${projectId}/levels` } routerDirection="none" key="levels">
                            <IonChip className="roles"> { project.levels.length ?? "" } </IonChip>
                            <IonLabel className="shelterList"> Level(s)</IonLabel>
                        </IonItem> ] :[]
                    }
                
                    <IonItem className="shelterItems" routerLink={ `/shelters/${shelter.id}/students` } routerDirection="none"  key="students">
                        <IonChip className="roles">{ shelter.students ? shelter.students.length: 0 }</IonChip>
                        <IonLabel className="shelterList"> Students</IonLabel>
                    </IonItem>

                    <IonItem className="shelterItems" routerLink={ `/shelters/${shelter.id}/notes` } routerDirection="none"  key="notes">
                        <IonChip className="roles">3</IonChip>
                        <IonLabel className="shelterList">Note(s) about { shelter.name }</IonLabel>
                    </IonItem>
                    { (projectId != TR_Wingman_project_id) ?
                        <IonItem className="shelterItems" routerLink={ `/shelters/${shelter.id}/projects/${projectId}/view-teachers` } routerDirection="none" key="assign">
                            <IonLabel className="shelterList">Assign Teachers</IonLabel>
                        </IonItem>
                        : 
                        <IonItem className="shelterItems" routerLink={ `/shelters/${shelter.id}/projects/${projectId}/view-wingmen` } routerDirection="none" key="assign">
                            <IonLabel className="shelterList">Assign Wingmen</IonLabel>
                        </IonItem>
                    } 
                    {/*<IonItem routerLink={ `/shelters/${shelter.id}/edit` } routerDirection="none" >
                        <IonLabel>Edit { shelter.name } Details</IonLabel>
                    </IonItem> */}
                
                    </IonList>
            </IonContent>
        </IonPage>
    );
};

export default ShelterView;