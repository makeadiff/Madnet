import {
    IonPage,
    IonContent,
    IonCardContent,
    IonCard,
    IonGrid,
    IonRow,
    IonCol,
  } from '@ionic/react'
import React from 'react'
import { dataContext } from '../../contexts/DataContext'
import Title from '../../components/Title'
import { useParams } from 'react-router-dom'
  
const UserHistory = () => {
  const { callApi } = React.useContext(dataContext)
  const { user_id } = useParams()
  const [roles, setRoles] = React.useState([{
      id:0,
      name:'No Data Available',
      year:'-'
  }])
  

  React.useEffect(() => {
     const fetchRoles = async () => {
        const role_details = await callApi({
        graphql: `{ user(id: ${user_id}) {
                past_groups { id name year }  
            }}`,
        })
        if(role_details){
            setRoles(role_details.past_groups)
        }
     }
     fetchRoles()
  }, [user_id])

  return (
    <IonPage>
      <Title name={`History`} back="/profile"/>
        <IonContent className="dark">
          {roles.sort((role1, role2) => (role1.year < role2.year) ? 1 : -1).map((role,index) => {
            return (
              <IonCard key={index}>
                <IonCardContent>
                  <IonGrid>
                    <IonRow>
                      <IonCol className="label">Name</IonCol>
                      <IonCol pullMd="3">{role.name}</IonCol>
                    </IonRow>
                    <IonRow>
                      <IonCol className="label">Year</IonCol>
                      <IonCol pullMd="3">{role.year}</IonCol>
                    </IonRow>
                  </IonGrid>
                </IonCardContent>
              </IonCard>
            )
          })}
        </IonContent>
    </IonPage>
  )
}
  
export default UserHistory
  