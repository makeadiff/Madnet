import { IonPage,IonList,IonItem,IonLabel,IonContent,IonIcon,IonFab,IonFabButton } from '@ionic/react'
import { add } from 'ionicons/icons'
import React from 'react'
import { useParams } from "react-router-dom"

import { dataContext } from "../../contexts/DataContext"
import Title from "../../components/Title"

const LevelIndex = () => {
    const { callApi } = React.useContext(dataContext)
    const [shelter, setShelter] = React.useState({name: ""})
    const [levels, setLevels] = React.useState([])
    const { shelter_id } = useParams()

    React.useEffect(() => {
        async function fetchLevelList() {
            // const levels_data = await callApi({url: "/center/" + shelter_id + "/levels" })
            const levels_data = await callApi({graphql: `{center(id: ${shelter_id}) { id name levels { id level_name }}}`})
            console.log(levels_data)
            setShelter({name: levels_data.name, id: levels_data.id})
            setLevels(levels_data.levels)
        }
        fetchLevelList()
    }, [shelter_id])

    return (
        <IonPage>
            <Title name={"Levels in " + shelter.name } />
      
            <IonContent>
                <IonList>
                    {levels.map((level, index) => {
                        return (
                            <IonItem key={index} routerLink={ `/shelters/${shelter.id}/levels/${level.id}` } routerDirection="none" >
                                <IonLabel>{level.level_name}</IonLabel>
                            </IonItem>
                        );
                    })}
                </IonList>

                <IonFab vertical="bottom" horizontal="end" slot="fixed">
                    <IonFabButton routerLink={ `/shelters/${shelter.id}/levels/0` }><IonIcon icon={ add }/></IonFabButton>
                </IonFab>
            </IonContent>
        </IonPage>
    );
};

export default LevelIndex
