import { IonPage,IonList,IonItem,IonLabel,IonContent } from '@ionic/react'
import React from 'react'
import { useParams } from "react-router-dom"

import { dataContext } from "../../contexts/DataContext"
import Title from "../../components/Title"

const BatchIndex = () => {
    const { callApi } = React.useContext(dataContext)
    const [shelter, setShelter] = React.useState({name: ""})
    const [batches, setBatches] = React.useState([])
    const { shelter_id } = useParams()

    React.useEffect(() => {
        async function fetchBatchList() {
            // const batches_data = await callApi({url: "/center/" + shelter_id + "/batches" })
            const batches_data = await callApi({graphql: `{center(id: ${shelter_id}) { id name batches { id batch_name }}}`})
            console.log(batches_data)
            setShelter({name: batches_data.name, id: batches_data.id})
            setBatches(batches_data.batches)
        }
        fetchBatchList()
    }, [shelter_id])

    return (
        <IonPage>
            <Title name={"Batches in " + shelter.name } />
      
            <IonContent>
                <IonList>
                    {batches.map((batch, index) => {
                        return (
                            <IonItem key={index} routerLink={ `/shelters/${shelter.id}/batches/${batch.id}` } routerDirection="none" >
                                <IonLabel>{batch.batch_name}</IonLabel>
                            </IonItem>
                        );
                    })}
                </IonList>
            </IonContent>
        </IonPage>
    );
};

export default BatchIndex
