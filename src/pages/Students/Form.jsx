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
  IonCardContent,
  IonCol,
  IonRow,
  IonGrid,
  IonCardTitle,
  IonCardHeader
} from '@ionic/react'
import { pencil, close } from 'ionicons/icons'
import { useParams } from 'react-router-dom'
import moment from 'moment'
import './Form.css'

import { authContext } from '../../contexts/AuthContext'
import { appContext } from '../../contexts/AppContext'
import { dataContext } from '../../contexts/DataContext'
import Title from '../../components/Title'

const StudentForm = () => {
  const { user, hasPermission } = React.useContext(authContext)
  const { callApi, unsetLocalCache } = React.useContext(dataContext)
  const { showMessage } = React.useContext(appContext)

  const [disable, setDisable] = React.useState(false)
  const [city_id] = React.useState(user.city_id)
  const [action, setAction] = React.useState('view')
  const [shelters, setShelters] = React.useState([])
  const [student, setStudent] = React.useState({
    id: 0,
    name: '',
    comments: [],
    sex: 'u',
    birthday: null,
    center_id: 0,
    student_type: 'active',
    reason_for_leaving: '',
    added_on : null,
    levels : [],
    past_classes: [],
    grade : "",
  })
  const [errors, setErrors] = React.useState({
    name: '',
    birthday: '',
    description: '',
    center_id: ''
  })
  const { student_id } = useParams()

  React.useEffect(() => {
    async function fetchShelterList() {
      const shelters_data = await callApi({
        url: 'cities/' + city_id + '/centers'
      })
      setShelters(shelters_data)
    }
    fetchShelterList()
  }, [city_id])

  React.useEffect(() => {
    const fetchStudent = async () => {
      const student_details = await callApi({
        graphql: `{
          student(id: ${student_id}) {
            id
            name
            description
            birthday
            sex
            center_id
            student_type
            added_on
            reason_for_leaving
            center {
              id name
            }
            comments {
              id
            }
            levels {
              id grade project_id year name
              teachers {
                 id name
              }
            }
            past_levels {
              id grade project_id year
              teachers {
                id name 
              }
            }
            past_classes {
              id class_on class_type status 
              pivot {
                present
                participation
              }
            }
          }
        }`,
        cache_key: `student_${student_id}`
      })

      if (student_details) {
        setStudent(student_details)
      }
    }
    if (student_id) {
      fetchStudent()
    }
  }, [student_id])

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
    }
  }

  const saveStudent = (e) => {
    e.preventDefault()
    if (!hasPermission('kids_edit')) {
      showMessage(
        `You don't have the necessary permissions to edit student details`,
        'error'
      )
      return
    }

    // Validation
    if (!student.center_id) {
      setError('center_id', 'Please select the shelter this student belongs to')
      return
    }

    if (!student.id) {
      // Add new student
      callApi({
        url: `/students/`,
        method: 'post',
        params: student
      }).then(() => {
        showMessage(`Added student '${student.name}' successfully`)
        unsetLocalCache(`city_${city_id}_students`)
        unsetLocalCache(`shelter_${student.center_id}_students`)
      })
    } else {
      // Edit existing sudent
      callApi({
        url: `/students/${student_id}`,
        method: 'post',
        params: student
      }).then(() => {
        setAction('view')
        unsetLocalCache(`student_${student_id}`)
        unsetLocalCache(`city_${city_id}_students`)
        unsetLocalCache(`shelter_${student.center_id}_students`)
        showMessage(`Saved details of ${student.name} successfully`)
      })
    }
  }

  const markAlumni = () => {
    // if (!hasPermission('kids_edit')) { // Not working for fellows. :TEMP: Fix
    //   showMessage(
    //     `You don't have the necessary permissions to edit student details`,
    //     'error'
    //   )
    //   return
    // }

    // This will save all entered data of the student - not just the alumnai data
    callApi({
      url: `/students/${student_id}`,
      method: 'post',
      params: student
    }).then(() => {
      unsetLocalCache(`student_${student_id}`)
      unsetLocalCache(`city_${city_id}_students`)
      unsetLocalCache(`shelter_${student.center_id}_students`)
      showMessage(`Saved details of ${student.name} successfully`)
    })
  }

  const all_types = {
    active: 'Active',
    active_away: 'Active, but away from Shelter',
    alumni: 'Alumni',
    alumni_no_contact: 'Alumni, Lost contact',
    alumni_dead: 'Alumni, Passed Away',
    other: 'Other'
  };

  const findMetrics = (year) => {
    let past_class = student.past_classes.filter(item => item.class_on.slice(0,4) == year )
    const present = past_class.filter(item => item.pivot.present === '1' ).length
    const absent = past_class.filter(item => item.pivot.present === '0' ).length
    const participation = Math.round(((past_class.reduce((a,v) =>  a = a + v.pivot.participation , 0 )) / past_class.length) * 100) / 100

    return {
      'present': present,
      'absent': absent,
      'total': present+absent,
      'participation': participation
    }
  }
  // const present = student.past_classes.filter(item => item.pivot.present === '1' ).length;
  // const participation = (student.past_classes.reduce((a,v) =>  a = a + v.pivot.participation , 0 ))/student.past_classes.length;

  // let classes_data = student.past_classes.reduce((r, { class_on }) => {
  //   var key = class_on.slice(0, 4);
  //   r[key] = (r[key] || 0) + 1;
  //   return r;
  // }, {});

  return (
    <IonPage>
      {student.id ? (
        <Title name={'View/Edit ' + student.name} back="/students" />
      ) : (
        <Title name={'Add Student in ' + user.city} back="/students" />
      )}
      <IonContent className="dark">
        <IonGrid>
          <IonRow>
            <IonCol size-xs="12" size-md="6">
            <IonCard>
              <IonCardContent>
                <form onSubmit={(e) => saveStudent(e)}>
                  <IonList>
                    <IonItem>
                      <IonLabel position="stacked">Name</IonLabel>
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

                      {errors.name ? (
                        <p className="error-message">{errors.name}</p>
                      ) : null}
                    </IonItem>

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

                      <IonItem>
                        <IonLabel>Not Specified</IonLabel>
                        <IonRadio
                          mode="ios"
                          name="sex"
                          slot="start"
                          value="u"
                          disabled={disable}
                        />
                      </IonItem>
                    </IonRadioGroup>

                    <span>
                      <IonRadioGroup
                        id="center_id"
                        value={student.center_id}
                        onIonChange={updateField}
                      >
                        <IonListHeader>
                          <IonLabel>Shelter/Community</IonLabel>
                        </IonListHeader>
                        {shelters.map((shelter) => {
                          return (
                            <IonItem key={shelter.id}>
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
                      {errors.center_id ? (
                        <p className="error-message">{errors.center_id}</p>
                      ) : null}
                    </span>

                    <IonItem>
                      <IonLabel position="stacked">Added On</IonLabel>
                      <IonInput
                        id="added_on"
                        type="date"
                        value={moment(student.added_on).format("YYYY-MM-DD")}
                        disabled={disable}
                        onIonChange={updateField}
                      />
                    </IonItem>

                    {disable ? null : (
                      <IonItem>
                        <IonButton routerLink={`/students`} size="default" type="submit">
                          Save
                        </IonButton>
                      </IonItem>
                    )}
                  </IonList>
                </form>
              </IonCardContent>
            </IonCard>
          </IonCol>

          {student.id ? (
          <IonCol size-md="6" size-xs="12">
            <IonCard className="light">
              <IonCardHeader>
                <IonRow>
                  <IonCol size="11">
                    <IonCardTitle>
                      Other Actions
                    </IonCardTitle>
                  </IonCol>
                  <IonCol size="1">
                    {action === 'mark_alumni' ? (
                        <IonButton size="default" type="submit" onClick={() => setAction('view')}>
                        <ion-icon name="close"></ion-icon>
                        </IonButton> ) :
                    null}
                  </IonCol>
                </IonRow>
              </IonCardHeader>
              <IonCardContent>
                <IonList>
                  { action === 'view' ? (
                    <>
                    <IonItem>
                      <IonButton size="default" type="submit" onClick={() => setAction('mark_alumni')}>
                        { student.student_type !== 'active' ? `Set ${student.name} as Active` : `Mark ${student.name} as Alumni` }
                      </IonButton>
                    </IonItem>
                    <IonItem>
                      <IonLabel>{ student.student_type === 'active' ? 
                        `This will hide ${student.name} in student listing.`
                        : `Currently ${student.name} is ${all_types[student.student_type]}` 
                      }</IonLabel>
                    </IonItem>
                    </>
                   ) : (
                    <>
                    <IonItem>
                      <IonRadioGroup
                        id="student_type"
                        value={student.student_type}
                        onIonChange={updateField}
                      >
                        <IonListHeader>
                          <IonLabel>Update {student.name}&apos;s Status</IonLabel>
                        </IonListHeader>

                        <IonItem>
                          <IonLabel>Active</IonLabel>
                          <IonRadio
                            mode="ios"
                            name="student_type"
                            slot="start"
                            value="active"
                          />
                        </IonItem>

                        <IonItem>
                          <IonLabel>Active, but away from shelter</IonLabel>
                          <IonRadio
                            mode="ios"
                            name="student_type"
                            slot="start"
                            value="active_away"
                          />
                        </IonItem>

                        <IonItem>
                          <IonLabel>Alumni</IonLabel>
                          <IonRadio
                            mode="ios"
                            name="student_type"
                            slot="start"
                            value="alumni"
                          />
                        </IonItem>

                        <IonItem>
                          <IonLabel>Alumni, Lost Contact</IonLabel>
                          <IonRadio
                            mode="ios"
                            name="student_type"
                            slot="start"
                            value="alumni_no_contact"
                          />
                        </IonItem>

                        <IonItem>
                          <IonLabel>Alumni, Passed Away</IonLabel>
                          <IonRadio
                            mode="ios"
                            name="student_type"
                            slot="start"
                            value="alumni_dead"
                          />
                        </IonItem>

                        <IonItem>
                          <IonLabel>Other</IonLabel>
                          <IonRadio
                            mode="ios"
                            name="student_type"
                            slot="start"
                            value="other"
                          />
                        </IonItem>
                      </IonRadioGroup>
                      </IonItem>

                      <IonItem>
                        <IonLabel position="stacked">Reason for Leaving</IonLabel>
                        <IonTextarea
                          id="reason_for_leaving"
                          type="text"
                          placeholder="Enter details about the transition"
                          value={student.reason_for_leaving}
                          onIonChange={updateField}
                        />
                      </IonItem>

                      <IonItem>
                        <IonButton size="default" onClick={() => markAlumni()}>
                          Save Status
                        </IonButton>
                      </IonItem>
                    </>
                  )}
                  
                  <IonItem
                    routerLink={`/students/${student_id}/notes`}
                    routerDirection="none"
                  >
                    <IonLabel>
                      {student.comments.length} note(s) on {student.name}
                    </IonLabel>
                  </IonItem>
                </IonList>
              </IonCardContent>
            </IonCard>

            <IonCard className="light">
              <IonCardHeader>
                <IonCardTitle>Historical Information</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <IonList>
                  <IonItem className="data-header">Current Class</IonItem>
                  {
                    (Array.isArray(student.levels) && student.levels.length) ? 
                    student.levels.map((level, id) => {
                      return(
                        <React.Fragment key={id}>
                          <IonItem>Class in {level.year}</IonItem>
                          <IonItem className="data-sub">Class: {level.grade} {level.name}</IonItem>
                          
                          {level.teachers.length ? (
                            <>
                              <IonItem className="data-header data-sub">Teachers</IonItem>
                              {level.teachers.map((teacher, id) => {
                                return(
                                  <IonItem className="data-sub-2" key={id}>{teacher.name}</IonItem>
                                );
                              })}
                            </>
                          ) : null}
                        </React.Fragment> 
                      )
                    })
                  : "No information available"
                  }

                  <IonItem className="data-header">Past Data</IonItem>
                  {
                    (Array.isArray(student.levels) && Array.isArray(student.past_levels) && student.levels.length) ? 
                    student.past_levels.map((level, id) => {
                      if(level.year === student.levels[0].year) return null; // don't show current year - already shown above

                      let yearData = findMetrics(level.year)

                      return (
                        <React.Fragment key={id}>
                          <IonItem className="data-header">Class in {level.year}</IonItem>
                          <IonItem className="data-sub">Grade: {level.grade} {level.name}</IonItem>
                          
                          {level.teachers.length ? (
                            <>
                            <IonItem className="data-header data-sub">Teachers</IonItem>
                            {level.teachers.map((teacher, id) => {
                              return(
                                <IonItem className="data-sub-2" key={id}>{teacher.name}</IonItem>
                              );
                            })}
                            </>
                          ) : null}

                          {yearData.total ? (
                            <>
                            <IonItem className="data-sub">
                              <span className="data-name"> Classes Attended</span>
                              <span className="data-value"> {yearData.present} / {yearData.total}</span>
                            </IonItem>
                            <IonItem className="data-sub">
                              <span className="data-name">Participation Average</span>
                              <span className="data-value"> {yearData.participation} / 5</span>
                            </IonItem>
                            </>
                          ) : null}
                        </React.Fragment> 
                      )
                    })
                  : "No information available"
                  }

                </IonList>
              </IonCardContent>
            </IonCard>
          </IonCol>
          ) : null}
          </IonRow>
        </IonGrid>

        {hasPermission('kids_edit') ? (
          <IonFab
            onClick={() => setDisable(!disable)}
            vertical="bottom"
            horizontal="start"
            slot="fixed"
          >
            <IonFabButton>
              <IonIcon icon={disable ? pencil : close} />
            </IonFabButton>
          </IonFab>
        ) : null}
        <br /><br /><br />
      </IonContent>
    </IonPage>
  )
}

export default StudentForm
