import { IonPage,IonList,IonItem,IonLabel,IonContent } from '@ionic/react'
import React from 'react'
import { authContext } from "../../contexts/AuthContext"
import { dataContext } from "../../contexts/DataContext"
import Title from "../../components/Title"
import ChildDetail from "../../components/Child"

const ChildIndex = () => {
    const {user} = React.useContext(authContext)
    const {callApi} = React.useContext(dataContext)
    const [children, setChildren] = React.useState([])
    const [cityId] = React.useState(user.city_id)

    React.useEffect(() => {
        async function fetchChildList() {
            const child_data = await callApi({url: "cities/" + cityId + "/students"}) 
            setChildren(child_data)
        }
        fetchChildList()
    }, [cityId])

    return (
        <IonPage>
            <Title name="Children" />
      
            <IonContent className="dark">
                <IonList>
                    {children.map((child, index) => (                    
                        <ChildDetail child={child} index={index} key={index} />
                    ))}
                </IonList>
            </IonContent>
        </IonPage>
    );
};

export default ChildIndex
