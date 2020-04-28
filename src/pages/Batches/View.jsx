import { IonPage, IonList,IonItem,IonLabel,IonContent,IonIcon,IonFab,IonFabButton,IonInput } from '@ionic/react';
import { pencil, close } from 'ionicons/icons';
import React from 'react'
import { useParams } from "react-router-dom"

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
                id batch_name day
            }}`});

            setBatch(batch_data)
        }
        fetchBatch();
    }, [batch_id])

    const updateField = (e) => {
        setBatch({ ...batch, [e.target.name]: e.target.value })
    }

    return (
        <IonPage>
            <Title name={ `Batch: ${batch.batch_name}` } />

            <IonContent>
                <IonList>
                    <IonItem>
                        <IonLabel position="stacked">Name</IonLabel>
                        <IonInput required type="text" name="batch_name" value={batch.batch_name} onIonChange={updateField} disabled={disable}></IonInput>
                    </IonItem>
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
