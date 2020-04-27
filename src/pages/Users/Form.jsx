import React from 'react'
import { IonButton, IonInput, IonPage, IonContent,IonLabel,
        IonItem,IonList,IonSelect,IonSelectOption,IonCheckbox } from '@ionic/react'
import { useParams, useHistory } from "react-router-dom"

import { authContext } from '../../contexts/AuthContext'
import { dataContext } from '../../contexts/DataContext'
import Title from '../../components/Title'
import './Form.css'

const UserForm = () => {
    const { user_id } = useParams()
    const [user, setUser] = React.useState({name: "", groups: []})
    const [groups, setGroups] = React.useState([])
    const { callApi } = React.useContext(dataContext)
    const { hasPermission } = React.useContext(authContext)
    const history = useHistory()

    React.useEffect(() => {
        if(!hasPermission('user_edit')) history.push(`/users/${user_id}/view`)

        const fetchUser = async() => {
            const user_details = await callApi({url: `/users/${user_id}`})
            if(user_details) setUser(user_details)
            // console.log(user_details, user_id)
        }
        fetchUser()

        const fetchGroups = () => {
            callApi({ url: "/groups?type_in=fellow,volunteer"}).then((data) => {
                setGroups(data)
            })
        }
        fetchGroups()
    }, [user_id])

    const saveUser = (e) => {
        // :TODO: Implement this.
    }

    return (
        <IonPage>
            <Title name={"Edit " + user.name } />
            <IonContent>
                <form onSubmit={e => saveUser(e)}>
                <IonList>
                    <InputRow label="Name" id="name" type="text" value={ user.name } />
                    <InputRow label="Email" id="email" type="text" value={ user.email } />
                    <InputRow label="Phone" id="phone" type="text" value={ user.phone } />
                    <InputRow label="Password" id="password" type="password" value="" />
                    <InputRow label="Confirm Password" id="confirm-password" type="password" value="" />

                    <IonItem>
                        <IonLabel>Sex</IonLabel>
                        <IonSelect value={ user.sex } placeholder="Select One">
                            <IonSelectOption value="f" selected={ user.sex === "f" }>Female</IonSelectOption>
                            <IonSelectOption value="m" selected={ user.sex === "m" }>Male</IonSelectOption>
                        </IonSelect>
                    </IonItem>

                    <IonItem><IonLabel>Groups</IonLabel></IonItem>
                    <div className="groups-area">
                    { groups.map((grp, index) => {
                        return (<IonItem key={ index } lines="none" className="group-selectors">
                            <IonCheckbox value={ grp.id } checked={ 
                                user.groups.reduce((found, ele) => { // We are reducing the groups array of the user to a true/false based on this group.
                                    if(found) return found
                                    else if(ele.id === grp.id) return true
                                    else return false
                                }, false) } /><IonLabel> &nbsp; { grp.name }</IonLabel>
                        </IonItem>)
                    })}
                    </div>

                    <IonItem><IonButton type="submit">Save</IonButton></IonItem>
                    </IonList>
                </form>
            </IonContent>
        </IonPage>
    )
}

const InputRow = ({ id, label, type, value }) => {
    return (
        <IonItem>
            <IonLabel>{ label }</IonLabel>
            <IonInput type={ type } id={ id } placeholder={ label } value={ value } />
        </IonItem>
    )
}

export default UserForm