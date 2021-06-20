import React from 'react'
import {
  IonButton,
  IonInput,
  IonPage,
  IonContent,
  IonLabel,
  IonFab,
  IonFabButton,
  IonItem,
  IonList,
  IonRadioGroup,
  IonListHeader,
  IonRadio,
  IonIcon,
  IonTextarea,
  IonCard,
  IonCardContent
} from '@ionic/react'
import { pencil, close } from 'ionicons/icons'
import { useParams } from 'react-router-dom'
import moment from 'moment'

import { authContext } from '../../contexts/AuthContext'
import { appContext } from '../../contexts/AppContext'
import { dataContext } from '../../contexts/DataContext'
import Title from '../../components/Title'

const StudentForm = () => {
  const [disable, setDisable] = React.useState(false)
  const { user } = React.useContext(authContext)
  const [cityId] = React.useState(user.city_id)
  const [shelters, setShelters] = React.useState([])
  const [student, setStudent] = React.useState({ name: '', comments: [] })
  const [newstudent, setNewStudent] = React.useState({
    name: '',
    sex: '',
    birthday: '2010-01-01',
    center_id: ''
  })
  const [errors, setErrors] = React.useState({
    name: '',
    birthday: '',
    description: ''
  })
  const { callApi, unsetLocalCache } = React.useContext(dataContext)
  const { hasPermission } = React.useContext(authContext)
  const { showMessage } = React.useContext(appContext)
  const { student_id } = useParams()

  React.useEffect(() => {
    async function fetchShelterList() {
      const shelters_data = await callApi({
        url: 'cities/' + cityId + '/centers'
      })
      setShelters(shelters_data)
    }
    fetchShelterList()
    const fetchStudent = async () => {
      const student_details = await callApi({
        graphql: `{ student(id: ${student_id}) {
                id name description birthday sex
                comments {
                    id 
                }
            }}`,
        cache_key: `/students/${student_id}`
      })

      if (student_details) {
        setStudent(student_details)
      }
    }
    fetchStudent()

    return () => {
      setStudent({ name: '', comments: [] })
    }
  }, [student_id, cityId])

  const setError = (id, error) => {
    setErrors({ ...errors, [id]: error })
  }

  const updateField = (e) => {
    const ele = e.target
    const { id, value } = ele

    // Using HTML validation.
    if (
      ele.firstChild &&
      typeof ele.firstChild.checkValidity === 'function' &&
      !ele.firstChild.checkValidity()
    ) {
      let message = ele.firstChild.validationMessage
      if (ele.firstChild.validity.patternMismatch) {
        message = 'Please enter a valid name'
      }
      setError(id, message)
    } else {
      // No errors.
      setError(id, '')
    }
    // Custom validation rules, if any, goes here.

    if (!disable) {
      // Without this, a race-condition was overwriting the initization values of student with this update.
      setStudent({ ...student, [id]: value })
      setNewStudent({ ...newstudent, [id]: value })
    }
  }

  const saveStudent = (e) => {
    e.preventDefault()
    if (!hasPermission('kids_edit')) {
      showMessage(
        "You don't have the necessary permissions to edit student details",
        'error'
      )
      return
    }
    if (student.id == undefined) {
      callApi({
        url: `/students/`,
        method: 'post',
        params: newstudent
      }).then((data) => {
        unsetLocalCache(`/students/${student_id}`)
        showMessage(`Added ${newstudent.name} details successfully`)
      })
    } else {
      callApi({
        url: `/students/${student_id}`,
        method: 'post',
        params: student
      }).then((data) => {
        unsetLocalCache(`/students/${student_id}`)
        showMessage('Saved student details successfully')
      })
    }
  }

  return (
    <IonPage>
      {student.id != undefined ? (
        <Title name={'View/Edit ' + student.name} />
      ) : (
        <Title name={'Add A New Student'} />
      )}
      <IonContent className="dark">
        <IonCard>
          <IonCardContent>
            <form onSubmit={(e) => saveStudent(e)}>
              <IonList>
                <IonItem>
                  <IonLabel position="stacked">Name</IonLabel>
                  {student.id != undefined ? (
                    <IonInput
                      id="name"
                      type="text"
                      value={student.name}
                      required={true}
                      minlength="2"
                      maxlength="70"
                      pattern="[A-Za-z\-' ]{1,60}"
                      autocapitalize={true}
                      disabled={disable}
                      onIonChange={updateField}
                    />
                  ) : (
                    <IonInput
                      id="name"
                      type="text"
                      value={newstudent.name}
                      required={true}
                      minlength="2"
                      maxlength="70"
                      pattern="[A-Za-z\-' ]{1,60}"
                      autocapitalize={true}
                      disabled={disable}
                      onIonChange={updateField}
                    />
                  )}

                  {errors.name ? (
                    <p className="error-message">{errors.name}</p>
                  ) : null}
                </IonItem>

                {student.id != undefined ? (
                  <IonItem>
                    <IonLabel position="stacked">Description</IonLabel>
                    <IonTextarea
                      id="description"
                      type="text"
                      value={student.description}
                      disabled={disable}
                      onIonChange={updateField}
                    />
                  </IonItem>
                ) : null}

                <IonItem>
                  <IonLabel position="stacked">Birthday</IonLabel>
                  <IonInput
                    id="birthday"
                    type="date"
                    value={student.birthday}
                    max={moment().year() - 5 + '-01-01'}
                    disabled={disable}
                    onIonChange={updateField}
                  />
                  {errors.birthday ? (
                    <p className="error-message">{errors.birthday}</p>
                  ) : null}
                </IonItem>

                <IonRadioGroup
                  id="sex"
                  value={student.sex}
                  onIonChange={updateField}
                >
                  <IonListHeader>
                    <IonLabel>Sex</IonLabel>
                  </IonListHeader>

                  <IonItem>
                    <IonLabel>Male</IonLabel>
                    <IonRadio
                      mode="ios"
                      name="sex"
                      slot="start"
                      value="m"
                      disabled={disable}
                    />
                  </IonItem>

                  <IonItem>
                    <IonLabel>Female</IonLabel>
                    <IonRadio
                      mode="ios"
                      name="sex"
                      slot="start"
                      value="f"
                      disabled={disable}
                    />
                  </IonItem>
                </IonRadioGroup>

                {/* Shows Center only if Adding New Student */}
                {student.id == undefined ? (
                  <span>
                    <IonRadioGroup
                      id="center_id"
                      value={newstudent.center_id}
                      onIonChange={updateField}
                    >
                      <IonListHeader>
                        <IonLabel>Center</IonLabel>
                      </IonListHeader>
                      {shelters.map((shelter, index) => {
                        return (
                          <IonItem key={index}>
                            <IonLabel>{shelter.name}</IonLabel>
                            <IonRadio
                              mode="ios"
                              name="center_id"
                              slot="start"
                              value={shelter.id}
                              disabled={disable}
                            />
                          </IonItem>
                        )
                      })}
                    </IonRadioGroup>
                  </span>
                ) : null}

                {disable ? null : (
                  <IonItem>
                    <IonButton size="default" type="submit">
                      Save
                    </IonButton>
                  </IonItem>
                )}

                {/* <IonItemDivider><IonLabel>Other Actions</IonLabel></IonItemDivider>

                                <IonItem>
                                    // :TODO:
                                    Mark Student as Alumni
                                </IonItem> */}

                {student.id != undefined ? (
                  <IonItem
                    routerLink={`/students/${student_id}/notes`}
                    routerDirection="none"
                  >
                    <IonLabel>
                      {student.comments.length} note(s) on {student.name}
                    </IonLabel>
                  </IonItem>
                ) : null}
              </IonList>
            </form>
          </IonCardContent>
        </IonCard>

        {hasPermission('kids_edit') ? (
          disable ? (
            <IonFab
              onClick={() => {
                console.log(student)
                setDisable(false)
              }}
              vertical="bottom"
              horizontal="start"
              slot="fixed"
            >
              <IonFabButton>
                <IonIcon icon={pencil} />
              </IonFabButton>
            </IonFab>
          ) : (
            <IonFab
              onClick={() => {
                setDisable(true)
              }}
              vertical="bottom"
              horizontal="start"
              slot="fixed"
            >
              <IonFabButton>
                <IonIcon icon={close} />
              </IonFabButton>
            </IonFab>
          )
        ) : null}
      </IonContent>
    </IonPage>
  )
}

export default StudentForm
