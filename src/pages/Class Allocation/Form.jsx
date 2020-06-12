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
    const [combo, setCombo] = React.useState({bat:"", lev:""})

    React.useEffect(() => {
        async function fetchData(){
            const data = await callApi({graphql: `{
                batchSearch(center_id:${shelter_id}, project_id:${project_id}){
                    id batch_name
                }
                }`}); 
            
            const levelsinfo = await callApi({graphql:`{
                levels(center_id:${shelter_id}, project_id:${project_id}){
                    id level_name                               
                }    
                }`});               //1                                                

            // const levelsinfo = await callApi({url: "/centers/" + shelter_id + "/levels"});  // 2 (Diff results for 1 and 2. Why?)
            
            const teachername = await callApi({url: "/users/" + user_id});


            setBatches(data)
            setLevels(levelsinfo)
            setTeacher(teachername)

        }
        fetchData()

    }, [shelter_id, project_id, user_id])

    const updateField = (e) => {
        setCombo({ ...combo, [e.target.name]: e.target.value })
    }


    const saveAssign = (e) => {
        e.preventDefault()
        callApi({url: `/batches/${combo.bat}/levels/${combo.lev}/teachers/${user_id}` , method: 'post' }).then((data)=> {
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
                    <IonSelect slot ="end" name = "bat" value = {combo.bat} onIonChange={updateField} required = "true"  >
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
                    <IonSelect slot ="end" name = "lev" value = {combo.lev} onIonChange={updateField} required = "true" >
                    {levels.map((level, index) => {
                        return(
                            <IonSelectOption key={index} value ={level.id.toString()}>
                            {level.level_name}
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
