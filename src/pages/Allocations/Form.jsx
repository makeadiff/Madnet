import { IonPage,IonList,IonItem,IonLabel,IonContent, IonSelect, IonSelectOption, IonButton } from '@ionic/react'
import React from 'react'

import { dataContext } from "../../contexts/DataContext"
import { appContext } from "../../contexts/AppContext"
import { useParams } from "react-router-dom"
import Title from "../../components/Title"
import { PROJECT_IDS } from "../../utils/Constants"

// :TODO: Edit for this ?
const TeacherForm = () => {
    const { shelter_id , project_id, user_id, new_level_id } = useParams()
    const [ level_id ] = React.useState(new_level_id ? new_level_id : 0)
    const { callApi, unsetLocalCache } = React.useContext(dataContext)
    const [teacher, setTeacher] = React.useState([])
    const [batches, setBatches] = React.useState([])
    const [levels, setLevels] = React.useState([])
    const { showMessage } = React.useContext(appContext)
    const [combo, setCombo] = React.useState({batch_id:"", level_id:""})
    const [sub, setSub] = React.useState([])
    const [subjectField, setSubjectField] = React.useState({subject_id:"0"})

    React.useEffect(() => {
        async function fetchData(){
            const data = await callApi({graphql: `{
                batchSearch(center_id:${shelter_id}, project_id:${project_id}){
                    id batch_name
                }
                levels(center_id:${shelter_id}, project_id:${project_id}){
                    id level_name                               
                }
                user(id: ${user_id}) {
                    name
                }
                subjects {
                  id name
                }
            }`});

            setBatches(data.batchSearch)
            setLevels(data.levels)
            setTeacher(data.user)
            setSub(data.subjects)
        }
        if(level_id) {
            setCombo({ ...combo, ["level_id"]: level_id })
        }
        fetchData();

    }, [shelter_id, project_id, user_id])

    React.useEffect(() => {
        if(project_id === PROJECT_IDS.AFTERCARE && batches.length) {
            setCombo({ ...combo, ["batch_id"]: batches[0].id }) // If aftercare project, just set the first batch as the preselected batch. There should be only one batch in the shelter.
        }
    }, [batches])

    const updateField = (e) => {
        setCombo({ ...combo, [e.target.name]: e.target.value })
    }

    const updateSubField = (e) => {
        setSubjectField( {subject_id: e.target.value })
    }

    const saveAssign = (e) => {
        e.preventDefault()
        callApi({url: `/batches/${combo.batch_id}/levels/${combo.level_id}/teachers/${user_id}` , method: 'post', params: subjectField }).then(()=> {
            showMessage("Saved class assignment successfully")
            unsetLocalCache(`teacher_view_${shelter_id}_${project_id}`)
            unsetLocalCache(`level_${level_id}`)
        })
    }

    return (
        <IonPage>
            <Title name={`Assign ${teacher.name} to...`} back={ `/shelters/${shelter_id}/projects/${project_id}` } />
            <IonContent className="dark">
                <form onSubmit={ saveAssign }>
                    <IonList>
                        { project_id === PROJECT_IDS.AFTERCARE ? null : 
                            <IonItem>
                                <IonLabel>Batch:</IonLabel>
                                <IonSelect slot="end" name = "batch_id" value={combo.batch_id} onIonChange={updateField} required = "true"  >
                                    {batches.map((batch, index) => {
                                        return(
                                            <IonSelectOption key={index} value={batch.id.toString()}>
                                                {batch.batch_name}
                                            </IonSelectOption>
                                        )   
                                    })}
                                </IonSelect>
                            </IonItem>
                        }
                        <IonItem>
                            <IonLabel>{ project_id === PROJECT_IDS.AFTERCARE ? "SSG" : "Level" }:</IonLabel>
                            <IonSelect slot="end" name="level_id" value={combo.level_id} onIonChange={updateField} required="true" >
                                {levels.map((level, index) => {
                                    return(
                                        <IonSelectOption key={index} value={level.id.toString()}>
                                            {level.level_name}
                                        </IonSelectOption>
                                    )
                                })}
                            </IonSelect>
                        </IonItem>
                        { project_id === PROJECT_IDS.AFTERCARE ? null : 
                            <IonItem>
                                <IonLabel>Subject:</IonLabel>
                                <IonSelect slot ="end" name = "subject_id" value = {subjectField.subject_id} onIonChange={updateSubField} >
                                    <IonSelectOption key="0" value="0">None</IonSelectOption>
                                    {sub.map((subject, index) => {
                                        return(
                                            <IonSelectOption key={index} value={subject.id.toString()}>
                                                {subject.name}
                                            </IonSelectOption>
                                        )
                                    })}
                                </IonSelect>
                            </IonItem>
                        }
                    </IonList>
                    <IonItem><IonButton type="submit">Save Assignment</IonButton></IonItem>
                </form>
                <IonItem routerLink={ `/shelters/${shelter_id}/projects/${project_id}/view-teachers` } routerDirection="none">
                    <IonButton color="light">&lt; Back</IonButton>
                </IonItem> 
            </IonContent>
        </IonPage>
    );

};

export default TeacherForm
