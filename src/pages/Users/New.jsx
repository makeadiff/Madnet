import {
    IonPage,
    IonList,
    IonItem,
    IonLabel,
    IonContent,
    IonInput,
    IonDatetime,
    IonIcon,
    IonFab,
    IonFabButton,
    IonSelect,
    IonSelectOption,
    IonButton,
    IonAlert
  } from '@ionic/react'
  import { pencil, close, trash } from 'ionicons/icons'
  import React from 'react'
  import { useParams, useHistory } from 'react-router-dom'
  
  import * as moment from 'moment'
  
  import Title from '../../components/Title'
  import { dataContext } from '../../contexts/DataContext'
  import { appContext } from '../../contexts/AppContext'
  import { authContext } from '../../contexts/AuthContext'

  const UserNew = () => {
    const { user } = React.useContext(authContext)
    const { callApi } = React.useContext(dataContext)
    const { showMessage } = React.useContext(appContext)
    const [ city, setCity ] = React.useState()
    const [newUser, setNewUser ] = React.useState({
            name:"",
            phone:"",
            email: "",
            city_id:user.city_id,
            mad_email:"",
            password: "pass",
            joined_on: "",
            center_id:'',
            user_type:""
        })

    React.useEffect(() => {
        async function fetchData() {
            const city_name = await callApi({
                graphql: `{city(id: ${user.city_id}){
                    name
                }}`
            })

            setCity(city_name.name)
        }
        fetchData()

    }, [user.city_id]
    )

    const updateField = (e) => {
        setNewUser({ ...newUser, [e.target.name]: e.target.value })
      }

    const saveUser = (e) => {
    e.preventDefault()
        callApi({
            url: `/users`,
            method: 'post',
            params: newUser
        }).then(() => {
            showMessage('User added successfully', 'success')
        })
    }

    return(
        <IonPage>
            <Title 
                name = {`Add new volunteer to ${city}`}></Title>
            <IonContent class = "dark">
                <IonList>
                    <form onSubmit = {saveUser}>
                        <IonItem>
                            <IonLabel>Name:</IonLabel>
                            <IonInput name="name" 
                            value = {newUser.name} 
                            onIonChange = {updateField}
                            color = "dark"
                            required = "true">
                            </IonInput>
                        </IonItem>
                        <IonItem>
                            <IonLabel>Phone:</IonLabel>
                            <IonInput name="phone" 
                            value = {newUser.phone} 
                            onIonChange = {updateField}
                            color = "dark"
                            required ="true">
                            </IonInput>
                        </IonItem>
                        <IonItem>
                            <IonLabel>Email:</IonLabel>
                            <IonInput name="email" 
                            value = {newUser.email} 
                            onIonChange = {updateField}
                            color= "dark"
                            required = "true"
                            type = "email">
                            </IonInput>
                        </IonItem>
                        <IonItem>
                            <IonLabel>MAD Email:</IonLabel>
                            <IonInput name="mad_email" 
                            value = {newUser.mad_email} 
                            onIonChange = {updateField}
                            color= "dark"
                            type = "email">
                            </IonInput>
                        </IonItem>
                        <IonItem>
                            <IonLabel>Password:</IonLabel>
                            <IonInput name="password" 
                            value = {newUser.password} 
                            onIonChange = {updateField}
                            color= "dark"
                            type = "password">
                            </IonInput>
                        </IonItem>
                        <IonItem>
                            <IonLabel>Joined on:</IonLabel>
                            <IonInput name="joined_on" 
                            value = {newUser.joined_on} 
                            onIonChange = {updateField}
                            color= "dark"
                            type = "date">
                            </IonInput>
                        </IonItem>
                        {/* <IonItem>    
                            <IonDatetime
                                displayFormat="D MMM YYYY h:mm A"
                                mode="md"
                                min="2020"
                                value={newUser.joined_on}
                                name="joined_on"
                                onIonChange={updateField}>
                            </IonDatetime>
                        </IonItem> */}
                        <IonItem>
                            <IonLabel>User Type:</IonLabel>
                            <IonSelect name="user_type" 
                            value = {newUser.user_type} 
                            onIonChange = {updateField}
                            color= "dark">
                            <IonSelectOption value = "volunteer">Volunteer</IonSelectOption>
                            <IonSelectOption value = "applicant">Applicant</IonSelectOption>
                            <IonSelectOption value = "let_go">Let Go</IonSelectOption>
                            <IonSelectOption value = "alumnai">Alumni</IonSelectOption>
                            <IonSelectOption value = "well_wisher">Well Wisher</IonSelectOption>
                            </IonSelect>
                        </IonItem>
                        <IonItem>
                            <IonButton type="submit">Save</IonButton>
                        </IonItem>
                    </form>
                </IonList>
            </IonContent>
        </IonPage>
    )
}

export default UserNew