import React from 'react'
import {
  IonInput,
  IonPage,
  IonContent,
  IonLabel,
  IonItem,
  IonList,
  IonCard,
  IonRadio,
  IonListHeader,
  IonRadioGroup,
  IonCardContent
} from '@ionic/react'
import { Redirect, useParams, useHistory } from "react-router-dom"
import { authContext } from '../../contexts/AuthContext'
import { dataContext } from '../../contexts/DataContext'
import { appContext } from '../../contexts/AppContext'
import Title from '../../components/Title'

const StudentAddNew = () => {
  const { shelter_id } = useParams()
  const { hasPermission } = React.useContext(authContext) // TOD0 : ADD CHECK FOR Permission

  const [ shelter, setSheler ] = React.useState('')
  const { callApi } = React.useContext(dataContext)
  const { showMessage } = React.useContext(appContext)

  const [ student , setStudent ] = React.useState({
    name: '',
    sex: '',
    center_id: shelter_id,
  })

  const [errors, setErrors] = React.useState({
    name: '',
  })

  const setError = (id, error) => {
    setErrors({ ...errors, [id]: error })
  }

  const updateField = (e) => {
    const ele = e.target
    const { id, value } = ele

    setError(id, '')
    if (id === 'name' && value) {
      if (!value.match(/^[A-Za-z\-' ]{1,60}$/)) {
        setError(id, 'Please enter a valid name')
      }
    }
    setStudent({ ...student, [id]: value })
  }

  React.useEffect(() => {

    const fetchShelter = () => {
      callApi({ url: `/centers/${shelter_id}` }).then((data) => {
        setSheler(data.name)
      })
    }
    fetchShelter()
  }, [shelter_id])

  const saveStudent = (e) => {
    e.preventDefault()
    console.log(student)

    callApi({
      url: '/students',
      method: 'post',
      params: student
    }).then((data) => {
      if (data.id) {
        showMessage('New Student Added with ID: ' + data.id)
        setStudent({
          name: '',
          sex: '',
          center_id: shelter_id,
        })
        setError('name', '')
      }
    })
  }

  return(
    <IonPage>
      <Title name={"Add Student for " + shelter}/>
      <IonContent className="dark">
        <IonCard>
          <IonCardContent>
            <form onSubmit={(e) => saveStudent(e)}>
              <IonList>

                <IonItem>
                  <IonLabel position="stacked">Student Name</IonLabel>
                  <IonInput
                    id="name"
                    type="text"
                    value={student.name}
                    required={true}
                    minlength="2"
                    maxlength="70"
                    autocapitalize={true}
                    onIonChange={updateField}
                  />
                  {errors.name ? (
                    <p className="error-message">{errors.name}</p>
                  ) : null}
                </IonItem>

                <IonRadioGroup id="sex" value={student.sex} onIonChange={updateField}>
                  
                  <IonListHeader>
                    <IonLabel>Sex</IonLabel>
                  </IonListHeader>

                  <IonItem>
                    <IonLabel>Male</IonLabel>
                    <IonRadio mode="ios" id="sex" slot="start" value="m" />
                  </IonItem>

                  <IonItem>
                    <IonLabel>Female</IonLabel>
                    <IonRadio mode="ios" id="sex" slot="start" value="f" />
                  </IonItem>

                </IonRadioGroup>
              </IonList>
            </form>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  )
}

export default StudentAddNew
