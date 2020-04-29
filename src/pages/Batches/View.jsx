import { IonPage, IonList,IonItem,IonLabel,IonContent,IonIcon,IonFab,IonFabButton,
            IonInput,IonListHeader,IonRadioGroup,IonRadio } from '@ionic/react';
import { pencil, close } from 'ionicons/icons';
import React from 'react'
import { useParams } from "react-router-dom"

import * as moment from 'moment'

import Title from "../../components/Title"
import { dataContext } from "../../contexts/DataContext"

const BatchView = () => {
    const { shelter_id, batch_id } = useParams()
    const [batch, setBatch] = React.useState({batch_name: ""})
	const [ disable, setDisable ] = React.useState( true )
    const { callApi } = React.useContext(dataContext);

    React.useEffect(() => {
        async function fetchBatch() {
            const batch_data = await callApi({graphql: `{ batch(id: ${batch_id}) { 
                id batch_name day class_time
            }}`});

            setBatch(batch_data)
        }
        fetchBatch();
    }, [batch_id])

    const updateField = (e) => {
        setBatch({ ...batch, [e.target.name]: e.target.value })
    }

    const convertToTime = (hour) => {
        let time_str = (hour < 10) ? "0" + hour.toString() : hour.toString() // 0 Padding.
        time_str += ":00:00"
        return time_str
    }

    const class_time_options = [8,9,10,11,12,13,14,15,16,17,18]

    return (
        <IonPage>
            <Title name={ `Batch: ${batch.batch_name}` } />

            <IonContent>
                <IonList>
                    <IonRadioGroup name="class_time" value={ batch.class_time }>
                        <IonListHeader>
                            <IonLabel>Class Time</IonLabel>
                        </IonListHeader>

                        { class_time_options.map((hour, index) => {
                            return (
                                <IonItem key={index}>
                                    <IonLabel>{ moment("2020-04-29 " + convertToTime(hour)).format("hh:mm A") }</IonLabel>
                                    <IonRadio mode="ios" name="class_time" slot="start" value={ convertToTime(hour) } />
                                </IonItem>
                            )
                        })}
                    </IonRadioGroup>

                    <IonItem>
                        <IonLabel position="stacked">Day</IonLabel>
                        <IonInput required type="text" name="day" value={batch.day} onIonChange={updateField} disabled={disable}></IonInput>
                    </IonItem>
                </IonList>

                <IonFab onClick={() => { setDisable(false)}} vertical="bottom" horizontal="end" slot="fixed" className={ disable ? "hidden" : null }>
                    <IonFabButton><IonIcon icon={pencil}/></IonFabButton>
                </IonFab>
                <IonFab onClick={() => { setDisable(true)}} vertical="bottom" horizontal="end" slot="fixed" className={ !disable ? "hidden": null }>
                    <IonFabButton><IonIcon icon={close}/></IonFabButton>
                </IonFab>
            </IonContent>
        </IonPage>
    );
};

export default BatchView;
