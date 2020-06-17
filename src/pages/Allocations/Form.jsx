import { IonPage,IonList,IonItem,IonLabel,IonContent, IonSelect, IonSelectOption, IonButton, IonPopover } from '@ionic/react'
import React from 'react'

import { authContext } from "../../contexts/AuthContext"
import { dataContext } from "../../contexts/DataContext"
import { appContext } from "../../contexts/AppContext"
import { useParams } from "react-router-dom"
import Title from "../../components/Title"

const TeacherForm = () => {
    const { shelter_id , project_id, user_id } = useParams()
    const {callApi} = React.useContext(dataContext)
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
                }`}); 
            
            const levels_info = await callApi({graphql:`{
                levels(center_id:${shelter_id}, project_id:${project_id}){
                    id level_name                               
                }    
                }`}); //1                                                

            // const levelsinfo = await callApi({url: "/centers/" + shelter_id + "/levels"});  // 2 (Diff results for 1 and 2. Why?)

            const teacher_name = await callApi({url: "/users/" + user_id});
            const subject_data = await callApi({graphql:`{
                subjects {
                  id name
                }
              }`});

            setBatches(data)
            setLevels(levels_info)
            setTeacher(teacher_name)
            setSub(subject_data)

        }
        fetchData()

    }, [shelter_id, project_id, user_id])

    const updateField = (e) => {
        setCombo({ ...combo, [e.target.name]: e.target.value })
    }

    const updateSubField = (e) => {
        setSubjectField({ id: e.target.value })
    }


    const saveAssign = (e) => {
        e.preventDefault()
        callApi({url: `/batches/${combo.batch_id}/levels/${combo.level_id}/teachers/${user_id}` , method: 'post', param: subjectField }).then((data)=> {
            showMessage("Saved class assignment successfully")
        })
    }

    return (
        <IonPage>
            <Title name={`Edit details for ${teacher.name}`} />
            <IonContent>
                <form onSubmit = {saveAssign} >
                <IonList>
                    <IonItem>
                    <IonLabel>Batch:</IonLabel>
                    <IonSelect slot ="end" name = "batch_id" value = {combo.batch_id} onIonChange={updateField} required = "true"  >
                    {batches.map((batch, index) => {
                        return(
                            <IonSelectOption key={index} value = {batch.id.toString()}>
                            {batch.batch_name}
                            </IonSelectOption>
                        )   
                    })}
                    </IonSelect>
                </IonItem>
                <IonItem>
                    <IonLabel>Level:</IonLabel>
                    <IonSelect slot ="end" name = "level_id" value = {combo.level_id} onIonChange={updateField} required = "true" >
                    {levels.map((level, index) => {
                        return(
                            <IonSelectOption key={index} value ={level.id.toString()}>
                            {level.level_name}
                            </IonSelectOption>
                        )
                    })}
                    </IonSelect>
                    </IonItem>
                    <IonItem>
                    <IonLabel>Subject:</IonLabel>
                    <IonSelect slot ="end" name = "subject_id" value = {subjectField.id} onIonChange={updateSubField} >
                    <IonSelectOption key="0" value="0" > None </IonSelectOption>
                    {sub.map((subject, index) => {
                        return(
                            <IonSelectOption key={index} value ={subject.id.toString()}>
                            {subject.name}
                            </IonSelectOption>
                        )
                    })}
                    </IonSelect>
                    </IonItem>
                </IonList>
                <IonItem><IonButton type="submit">Save</IonButton></IonItem>
                </form>
            </IonContent>
        </IonPage>
    );

};

export default TeacherForm
