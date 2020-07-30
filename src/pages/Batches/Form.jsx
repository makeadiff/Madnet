import { IonPage, IonList,IonItem,IonLabel,IonContent,IonIcon,IonFab,IonFabButton,
    IonSelect,IonSelectOption, IonButton } from '@ionic/react'
import { pencil, close } from 'ionicons/icons'
import React from 'react'
import { useParams } from "react-router-dom"

import * as moment from 'moment'

import Title from "../../components/Title"
import { dataContext } from "../../contexts/DataContext"
import { appContext } from "../../contexts/AppContext"

const BatchForm = () => {
    const { shelter_id, project_id, batch_id } = useParams()
    const [batch, setBatch] = React.useState({batch_name: "", class_time: "16:00:00", day: 0, project_id: project_id, center_id: shelter_id})
    const [ disable, setDisable ] = React.useState( true )
    const { callApi, unsetLocalCache} = React.useContext(dataContext)
    const { showMessage } = React.useContext(appContext)

    React.useEffect(() => {
        async function fetchBatch() {
            const batch_data = await callApi({graphql: `{ batch(id: ${batch_id}) { 
                id batch_name day class_time project_id
            }}`, cache: false})

            setBatch(batch_data)
        }
        if(batch_id !== "0") fetchBatch()
        else {
            setDisable(false)
            setBatch({ ...batch, batch_name: "New Batch"})
        }
    }, [batch_id])

    const updateField = (e) => {
        setBatch({ ...batch, [e.target.name]: e.target.value })
    }
    const updateTimeField = (e) => {
        let time_parts = batch.class_time.split(":")
        if(e.target.name === "class_time_hour") time_parts[0] = e.target.value
        else if(e.target.name === "class_time_min") time_parts[1] = e.target.value

        setBatch({ ...batch, class_time: time_parts.join(":")})
    }

    const saveBatch = (e) => {
        e.preventDefault()

        if(batch_id !== "0") { // Edit
            callApi({url: `/batches/${batch_id}`, method: "post", params: batch}).then((data) => {
                if(data) {
                    setDisable( true )
                    showMessage("Batch Updated Successfully", "success")
                    unsetLocalCache( `shelter_${shelter_id}_batch_index`)
                    unsetLocalCache( `shelter_view_${shelter_id}`)
                }
            })
        } else { // Create new batch
            callApi({url: `/batches`, method: "post", params: batch}).then((data) => {
                if(data) {
                    setDisable( true )
                    showMessage("Batch Created Successfully", "success")
                    unsetLocalCache( `shelter_${shelter_id}_batch_index`)
                    unsetLocalCache( `shelter_view_${shelter_id}`)
                }
            })
        }
    }

    const class_time_options = [8,9,10,11,12,13,14,15,16,17,18]
    const day_options = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

    return (
        <IonPage>
            <Title name={ `Batch: ${batch.batch_name}` } back={`/shelters/${shelter_id}/projects/${project_id}/batches`} />

            <IonContent class="dark">
                <IonList>
                    <form onSubmit={ saveBatch }>
                        <IonItem>
                            <IonLabel>Class Time</IonLabel>
                            <IonSelect slot="end" name="class_time_hour" value={ batch.class_time.split(":")[0] } onIonChange={ updateTimeField } disabled={disable}>
                                { class_time_options.map((hour, index) => {
                                    return (
                                        <IonSelectOption key={index} value={ (hour < 10) ? "0" + hour.toString() : hour.toString() }>{ 
                                            moment("2020-04-29 " + ((hour < 10) ? "0" + hour.toString() : hour.toString()) + ":00:00").format("hh A") // Date can be anything. 
                                        }</IonSelectOption>
                                    )
                                })}
                            </IonSelect>
                            <IonSelect slot="end" name="class_time_min" value={ batch.class_time.split(":")[1] } onIonChange={ updateTimeField } disabled={disable}>
                                { ["00", "15", "30", "45"].map((min, index) => {
                                    return (
                                        <IonSelectOption key={index} value={ min }>: { min }</IonSelectOption>
                                    )
                                })}
                            </IonSelect>
                        </IonItem>
                        <IonItem>
                            <IonLabel>Day</IonLabel>
                            <IonSelect name="day" value={ batch.day } onIonChange={ updateField } disabled={disable}>
                                { day_options.map((name, day) => {
                                    return (
                                        <IonSelectOption key={day} value={ day.toString() }>{ name }</IonSelectOption>
                                    )
                                })}
                            </IonSelect>
                        </IonItem>
                        { disable ? null : <IonItem><IonButton type="submit">Save</IonButton></IonItem> }
                    </form>
                </IonList>

                { disable ?
                    (<IonFab onClick={() => { setDisable(false) }} vertical="bottom" horizontal="end" slot="fixed">
                        <IonFabButton><IonIcon icon={pencil}/></IonFabButton>
                    </IonFab>) : 
                    (<IonFab onClick={() => { setDisable(true) }} vertical="bottom" horizontal="end" slot="fixed">
                        <IonFabButton><IonIcon icon={close}/></IonFabButton>
                    </IonFab>) }
            </IonContent>
        </IonPage>
    );
};

export default BatchForm
