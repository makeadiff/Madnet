import { IonPage,IonList,IonItem,IonLabel,IonContent } from '@ionic/react'
import React from 'react'
import { useParams } from "react-router-dom"

import { authContext } from "../../contexts/AuthContext"
import { dataContext } from "../../contexts/DataContext"
import Title from "../../components/Title"

const StudentIndex = () => {
    const { shelter_id } = useParams()
    const { user } = React.useContext(authContext)
    const {callApi} = React.useContext(dataContext)
    const [students, setStudents] = React.useState([])
    const [ city_id ] = React.useState(user.city_id)
    const [ location, setLocation ] = React.useState("")

    React.useEffect(() => {
        async function fetchChildList() {
            let child_data = []
            if(shelter_id) {
                child_data = await callApi({graphql: `{ 
                    studentSearch(center_id: ${shelter_id}) { id name center { name }}
                    center(id: ${shelter_id}) { name }
                }`})
                setLocation(` in ${child_data.center.name}`)
            } else {
                child_data = await callApi({graphql: `{ 
                    studentSearch(city_id: ${city_id}) { id name center { name }}
                    city(id: ${city_id}) { name }
                }`})
                setLocation(` in ${child_data.city.name}`)
            }
            setStudents(child_data.studentSearch)
        }
        fetchChildList()
    }, [city_id, shelter_id])

    return (
        <IonPage>
            <Title name={`Students ${location}`} />
      
            <IonContent>
                <IonList>
                    {students.map((child, index) => (<IonItem key={index} routerLink={`/students/${child.id}`} routerDirection="none">
                        <IonLabel><h4>{child.name}</h4>
                            <p>Student ID: { child.id }</p>
                            <p>Shelter: { child.center.name }</p>
                        </IonLabel>
                    </IonItem>))}
                </IonList>
            </IonContent>
        </IonPage>
    );
};

export default StudentIndex
