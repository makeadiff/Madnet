import {
    IonPage,
    IonList,
    IonItem,
    IonLabel,
    IonContent,
    IonInput,
    IonSelect,
    IonSelectOption,
    IonButton,
    IonCard,
    IonCardContent
    //IonAlert
  } from '@ionic/react'
  import React from 'react'
 
  
  import Title from '../../components/Title'
  import { dataContext } from '../../contexts/DataContext'
  import { appContext } from '../../contexts/AppContext'
  import { authContext } from '../../contexts/AuthContext'
  import { useHistory } from 'react-router-dom'


  const UserNew = () => {
    const { user } = React.useContext(authContext)
    const { callApi } = React.useContext(dataContext)
    const { showMessage } = React.useContext(appContext)
    const history = useHistory()
    const [ city, setCity ] = React.useState()
    const [ passField, setPassField ]= React.useState({pass:"", confpass:""})
    const [newUser, setNewUser ] = React.useState({
            name:"",
            phone:"",
            email: "",
            city_id:user.city_id,
            mad_email:"",
            password: "",
            joined_on: "",
            center_id:'',
            user_type:"volunteer"
        })

    const useComponentDidMount = () => {
            const ref = React.useRef();
            React.useEffect(() => {
              ref.current = true;
            }, []);
            return ref.current;
          };
    
    const isComponentMounted = useComponentDidMount();

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

    const updatePass = (e) => {
        setPassField({ ...passField, [e.target.name]: e.target.value})
        //checkPass()
    }

    const checkPass = () => {
        //setPassField({ ...passField, [e.target.name]: e.target.value})
        if(!passField.pass) {
            showMessage('Password should be present', 'retry')
            return false;
        }

        if(passField.pass == passField.confpass && passField.pass!= "") {
            setNewUser({...newUser, ['password'] : passField.pass})
            console.log("set")
            return true
        }
        else
        {
            showMessage('Passwords should match', 'retry')
            return false
        }
    }

    const checkPhone = () => {
        if(!newUser.phone.match(/^(\+?\d{1,3}[\- ]?)?\d{10}$/))
        {
            showMessage('Enter a valid phone number', 'retry')
            return false
        }
        else
        {
            return true
        }
    }

    const saveFunc = () => {

        callApi({
            url: `/users`,
            method: 'post',
            params: newUser
        }).then((data) => {
            if(data) {
                showMessage('User added successfully', 'success')
                history.push(`/users`)
            }
        })

    } 

    React.useEffect(() => {
       if(isComponentMounted) {
        const onValid = () => {
            if(checkPhone() && checkPass()) {
                setNewUser({...newUser, ['password']: passField.pass })
            } onValid()
        }
        saveFunc()
    }    
    }, [newUser.password])

    const saveUser = (e) => {   
        e.preventDefault()
        checkPhone()
        checkPass()
    }

    return(
        <IonPage>
            <Title 
                name = {`Add new volunteer to ${city}`}></Title>
            <IonContent className = "dark">
            <IonCard>
            <IonCardContent>
                
                    <form onSubmit = {saveUser}>
                        <IonList>
                        <IonItem>
                            <IonLabel position = "stacked">Name:</IonLabel>
                            <IonInput name="name" 
                            value = {newUser.name} 
                            onIonChange = {updateField}
                            color = "dark"
                            required = "true"
                            placeholder='Enter name of the volunteer'>
                            </IonInput>
                        </IonItem>
                        <IonItem>
                            <IonLabel position = "stacked">Phone:</IonLabel>
                            <IonInput name="phone" 
                            value = {newUser.phone} 
                            onIonChange = {updateField}
                            color = "dark"
                            type = "tel"
                            required ="true"
                            placeholder='Enter a valid phone number'>
                            </IonInput>
                        </IonItem>
                        <IonItem>
                            <IonLabel position = "stacked">Email:</IonLabel>
                            <IonInput name="email" 
                            value = {newUser.email} 
                            onIonChange = {updateField}
                            color= "dark"
                            required = "true"
                            type = "email"
                            placeholder='Enter a valid email ID'>
                            </IonInput>
                        </IonItem>
                        <IonItem>
                            <IonLabel position = "stacked">MAD Email:</IonLabel>
                            <IonInput name="mad_email" 
                            value = {newUser.mad_email} 
                            onIonChange = {updateField}
                            color= "dark"
                            type = "email"
                            placeholder='Enter makeadiff email ID'>
                            </IonInput>
                        </IonItem>
                        <IonItem>
                            <IonLabel position = "stacked">Password:</IonLabel>
                            <IonInput name="pass" 
                            value = {passField.pass} 
                            onIonChange = {updatePass}
                            color= "dark"
                            type = "password"
                            placeholder = "Enter password">
                            </IonInput>
                        </IonItem>
                        <IonItem>
                            <IonLabel position = "stacked">Confirm Password:</IonLabel>
                            <IonInput name="confpass" 
                            value = {passField.confpass} 
                            onIonChange = {updatePass}
                            color= "dark"
                            defaultValue={"pass"}
                            type = "password"
                            placeholder = "Confirm password">
                            </IonInput>
                        </IonItem>
                        {/* <IonItem>
                            <IonLabel>Joined on:</IonLabel>
                            <IonInput name="joined_on" 
                            value = {newUser.joined_on} 
                            onIonChange = {updateField}
                            color= "dark"
                            type = "date">
                            </IonInput>
                        </IonItem> */}
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
                            <IonLabel position = "stacked">User Type:</IonLabel>
                            <IonSelect name="user_type" 
                            value = {newUser.user_type} 
                            onIonChange = {updateField}
                            color= "dark">
                            <IonSelectOption value = "volunteer">Volunteer</IonSelectOption>
                            <IonSelectOption value = "applicant">Applicant</IonSelectOption>
                            <IonSelectOption value = "let_go">Let Go</IonSelectOption>
                            <IonSelectOption value = "alumni">Alumni</IonSelectOption>
                            <IonSelectOption value = "well_wisher">Well Wisher</IonSelectOption>
                            </IonSelect>
                        </IonItem>
                        <IonItem>
                            <IonButton type="submit">Save</IonButton>
                        </IonItem>
                        </IonList> 
                    </form>
                    </IonCardContent>
                 </IonCard>   
            </IonContent>
        </IonPage>
    )
}

export default UserNew