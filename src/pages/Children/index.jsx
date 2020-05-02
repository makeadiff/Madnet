import { IonPage,IonList,IonItem,IonLabel,IonContent } from '@ionic/react'
import React from 'react'
import { authContext } from "../../contexts/AuthContext"
import { dataContext } from "../../contexts/DataContext"
import Title from "../../components/Title"

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
      
            <IonContent>
                <IonList>
                    {children.map((child, index) => (<IonItem key={index} routerLink={"/children"} routerDirection="none">
                        <IonLabel><h4>{child.name}</h4>
                            <p>Child ID: { child.id }</p>
                            <p>Sex: { child.sex }</p>
                            <p>Birthday: { child.birthday } </p>
                        </IonLabel>
                    </IonItem>))}
                </IonList>
            </IonContent>
        </IonPage>
    );
};

export default ChildIndex
