import { IonPage, IonList,IonItem,IonLabel,IonContent,IonIcon,IonFab,IonFabButton,
            IonSelect,IonSelectOption, IonButton } from '@ionic/react'
import { pencil, close } from 'ionicons/icons'
import React from 'react'
import { useParams } from "react-router-dom"
import { PROJECT_IDS } from "../../utils/Constants"

import Title from "../../components/Title"
import { dataContext } from "../../contexts/DataContext"
import { appContext } from "../../contexts/AppContext"

const LevelForm = () => {
    const { shelter_id, level_id, project_id } = useParams()
    const [level, setLevel] = React.useState({level_name: "", grade: "5", name:"A", project_id: project_id, center_id: shelter_id})
	const [ disable, setDisable ] = React.useState( true )
    const { callApi, unsetLocalCache} = React.useContext(dataContext)
    const { showMessage } = React.useContext(appContext)

    let level_label = "Class Section"

    React.useEffect(() => {
        async function fetchlevel() {
            const level_data = await callApi({graphql: `{ level(id: ${level_id}) { 
                id name grade level_name project_id
            }}`, cache: false})

            setLevel(level_data)
        }
        if(level_id !== "0") fetchlevel()
        else {
            setDisable(false)
            if(project_id == PROJECT_IDS.AFTERCARE) {
                level_label = "SSG"
                setLevel({ ...level, level_name: "New SSG", grade: 13})
            } else {
                setLevel({ ...level, level_name: "New Class Section"})
            }
        }
    }, [level_id])

    const updateField = (e) => {
        setLevel({ ...level, [e.target.name]: e.target.value })
    }

    const savelevel = (e) => {
        e.preventDefault()

        if(level_id !== "0") { // Edit
            callApi({url: `/levels/${level_id}`, method: "post", params: level}).then((data) => {
                if(data) {
                    setDisable( true )
                    showMessage("Level Updated Successfully", "success")
                    unsetLocalCache( `shelter_${shelter_id}_project_${project_id}_level_index`)
                    unsetLocalCache( `shelter_view_${shelter_id}`)
                }
            })
        } else { // Create new batcch
            callApi({url: `/levels`, method: "post", params: level}).then((data) => {
                if(data) {
                    setDisable( true )
                    showMessage("Level Created Successfully", "success")
                    unsetLocalCache( `shelter_${shelter_id}_project_${project_id}_level_index`)
                    unsetLocalCache( `shelter_view_${shelter_id}`)
                }
            })
        }
    }

    const all_grades = ["5","6","7","8","9","10","11","12","13"]
    const grade_names = ["A", "B", "C", "D", "E", "F"]

    return (
        <IonPage>
            <Title name={ `${level_label}: ${level.level_name}` } />

            <IonContent class="dark">
                <IonList>
                    <form onSubmit={ savelevel }>

                    {(project_id === PROJECT_IDS.AFTERCARE) ? 
                    <IonItem>
                        <IonLabel>Class</IonLabel>
                        <IonSelect name="grade" value={ level.grade } onIonChange={ updateField } disabled={disable}>
                            { all_grades.map((grade, index) => {
                                return (
                                    <IonSelectOption key={ index } value={ grade }>{ (grade === "13" ? "Aftercare" : grade) }</IonSelectOption>
                                )
                            })}
                        </IonSelect>
                    </IonItem> : null }
                    
                    <IonItem>
                        <IonLabel>Section</IonLabel>
                        <IonSelect name="name" value={ level.name } onIonChange={ updateField } disabled={disable}>
                            { grade_names.map((name, index) => {
                                return (
                                    <IonSelectOption key={ index } value={ name }>{ name }</IonSelectOption>
                                )
                            })}
                        </IonSelect>
                    </IonItem>
                    { disable ? null : <IonItem><IonButton type="submit">Save</IonButton></IonItem> }
                    </form>
                </IonList>

                { disable ?
                    (<IonFab onClick={() => { setDisable(false) }} vertical="bottom" horizontal="end" slot="fixed">
                        <IonFabButton><IonIcon icon={pencil}/></IonFabButton>
                    </IonFab>) : 
                    (<IonFab onClick={() => { setDisable(true) }} vertical="bottom" horizontal="end" slot="fixed">
                        <IonFabButton><IonIcon icon={close}/></IonFabButton>
                    </IonFab>) }
            </IonContent>
        </IonPage>
    );
};

export default LevelForm
