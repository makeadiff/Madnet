import {
  IonPage,
  IonList,
  IonItem,
  IonLabel,
  IonContent,
  IonButton,
  IonCheckbox
} from '@ionic/react'
import React from 'react'
import { useParams } from 'react-router-dom'
import { PROJECT_IDS } from '../../utils/Constants'

import Title from '../../components/Title'
import { dataContext } from '../../contexts/DataContext'
import { appContext } from '../../contexts/AppContext'

const LevelAddStudent = () => {
  const { shelter_id, level_id, project_id } = useParams()
  const [level, setLevel] = React.useState({
    level_name: '',
    grade: '5',
    name: 'A'
  })
  const [students, setStudents] = React.useState([])
  const { callApi, unsetLocalCache } = React.useContext(dataContext)
  const { showMessage } = React.useContext(appContext)
  const [labels, setLabels] = React.useState({
    level: 'Class Section',
    student: 'Student'
  })
  const [selected, setSelected] = React.useState({})

  React.useEffect(() => {
    async function fetchLevel() {
      const data = await callApi({
        graphql: `{ 
                level(id: ${level_id}) { 
                    id name grade level_name project_id
                    students {
                        id name
                    }
                }
                studentSearch(center_id: ${shelter_id}) {
                    id name
                }
            }`,
        cache: true,
        cache_key: `shelter_${shelter_id}_level_${level_id}_students`
      })

      if (data.level) {
        // If new level, this will be null.
        setLevel(data.level)
        // Students in the level should be preselected
        if (data.level.students.length > 0) {
          let sel = {}
          for (var i in data.level.students) {
            let stu = data.level.students[i]
            sel[stu.id] = true
          }
          setSelected(sel)
        }
      }
      if (data.studentSearch) setStudents(data.studentSearch)
    }
    fetchLevel()

    if (project_id == PROJECT_IDS.AFTERCARE) {
      setLabels({ level: 'SSG', student: 'Youth' })
    }
  }, [level_id])

  const addStudents = (e) => {
    e.preventDefault()

    let students = Object.keys(selected)

    callApi({
      url: `/levels/${level_id}/students`,
      method: 'post',
      params: { student_ids: students.join(',') }
    }).then((data) => {
      if (data) {
        showMessage(
          `${students.length} ${labels.student}(s) added to this ${labels.level} Successfully`,
          'success'
        )
        unsetLocalCache(
          `shelter_${shelter_id}_project_${project_id}_level_index`
        )
        unsetLocalCache(`shelter_${shelter_id}_level_${level_id}_students`)
        unsetLocalCache(`level_${level_id}`)
      }
    })
  }

  const setStudentSelectedValue = (student_id, is_selected) => {
    setSelected({ ...selected, [student_id]: is_selected })
  }

  const selectStudent = (e) => {
    setStudentSelectedValue(e.target.value, e.target.checked)
  }

  return (
    <IonPage>
      <Title
        name={`Add ${labels.student} to ${level.level_name} ${labels.level}`}
        back={`/shelters/${shelter_id}/projects/${project_id}/levels/${level_id}`}
      />

      <IonContent class="dark">
        <IonList>
          <form onSubmit={addStudents}>
            {students.map((student, index) => {
              return (
                <IonItem key={index} className="striped">
                  <IonCheckbox
                    value={student.id}
                    checked={selected[student.id]}
                    onIonChange={selectStudent}
                    slot="start"
                  ></IonCheckbox>
                  <IonLabel>{student.name}</IonLabel>
                </IonItem>
              )
            })}

            <IonItem>
              <IonButton onClick={addStudents}>
                Add Selected {labels.student} to {level.level_name}{' '}
                {labels.level}
              </IonButton>
            </IonItem>
          </form>
        </IonList>
      </IonContent>
    </IonPage>
  )
}

export default LevelAddStudent
