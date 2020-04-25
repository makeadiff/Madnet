import { IonPage,IonContent, IonGrid, IonRow, IonCol,IonSegment,IonSegmentButton,
            IonLabel,IonList, IonItem,IonFab,IonFabButton,IonIcon } from '@ionic/react'
import { createOutline } from 'ionicons/icons'
import React from 'react'
import { useParams } from "react-router-dom"
import * as moment from 'moment'

import Title from "../../components/Title"
import { authContext } from "../../contexts/AuthContext"
import { dataContext } from "../../contexts/DataContext"

const UserView = () => {
    const { user_id } = useParams()
    const [segment, setSegment] = React.useState('details')
    const [user, setUser] = React.useState({name: "", groups: []})
    const [issues, setIssues] = React.useState([])
    const { callApi, getAlerts } = React.useContext(dataContext)
    const { hasPermission } = React.useContext(authContext)

    React.useEffect(() => {
        const fetchUser = async() => {
            const user_details = await callApi({url: `/users/${user_id}`})
            if(user_details) setUser(user_details)
            // console.log(user_details, user_id)
        }
        fetchUser()
    }, [user_id])

    React.useEffect(() => {
        async function fetchAlerts() {
            if(segment === "issues") {
                const issues = await getAlerts(user.id)
                if(issues) setIssues(issues)
            }
        }
        fetchAlerts();
    }, [segment])

    return (
        <IonPage>
            <Title name={ user.name } />

            <IonContent>
                { hasPermission('user_edit') ? 
                    (<IonFab vertical="bottom" horizontal="end" slot="fixed">
                        <IonFabButton>
                            <IonIcon icon={ createOutline } />
                        </IonFabButton>
                    </IonFab>) : null }


                <IonSegment value={segment} onIonChange={e => setSegment(e.detail.value)}>
                    <IonSegmentButton value="details">
                        <IonLabel>Details</IonLabel>
                    </IonSegmentButton>
                    <IonSegmentButton value="issues">
                        <IonLabel>Issues</IonLabel>
                    </IonSegmentButton>
                    {/* :TODO: History - class, event, donations, etc. <IonSegmentButton value="history">
                        <IonLabel>History</IonLabel>
                    </IonSegmentButton> */}
                </IonSegment>

                { segment === "details" ? 
                    (<IonGrid>
                        <LabeledRow label="Phone" value={ user.phone } />
                        <LabeledRow label="Email" value={ user.email } />
                        { user.mad_email ? (<LabeledRow label="MAD EMail" value={ user.mad_email } />) : null }
                        <LabeledRow label="Groups" value={ user.groups.map((grp) => { return grp.name }).join(", ") } />
                        <LabeledRow label="Credit" value={ user.credit } />
                        <LabeledRow label="Sex" value={ {m: "Male", f: "Female", o: "Other"}[user.sex] } />
                        <LabeledRow label="Volunteer Since" value={ moment(user.joined_on).format("YYYY, MMMM Do") } />
                    </IonGrid>) : null }

                { segment === "issues" ? 
                    (<IonList>
                        { issues.map((alert, index) => {
                            return (<IonItem key={index}>
                                <IonLabel>{alert.name}</IonLabel>
                            </IonItem>)
                        })}
                    </IonList>) : null }

            </IonContent>
        </IonPage>
    )
}

const LabeledRow = ({ label, value}) => {
    return (
        <IonRow>
            <IonCol className="label" size-xs="4" size-md="2" size-lg="1">{ label }</IonCol>
            <IonCol>{ value }</IonCol>
        </IonRow>
    )
}

export default UserView;
