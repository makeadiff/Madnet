import React from 'react'
import { IonButton, IonInput, IonPage, IonContent,IonLabel, IonItem,IonList,IonCheckbox,IonRadioGroup,IonListHeader,IonRadio, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCol, IonGrid, IonRow, IonFab, IonFabButton, IonIcon, IonChip } from '@ionic/react'
import { pencil, close, trash } from 'ionicons/icons'
import { useParams, useHistory } from "react-router-dom"

import { authContext } from '../../contexts/AuthContext'
import { dataContext } from '../../contexts/DataContext'
import Title from '../../components/Title'
import './Form.css'
import { userInfo } from 'os'

const UserForm = () => {
    const { user_id } = useParams()
    const [ user, setUser ] = React.useState({name: "", groups: []})
    const [ userGroups, setUserGroups ] = React.useState([])    
    const [ groups, setGroups ] = React.useState([])
    const [ disable, setDisable ] = React.useState(true)
    const { callApi } = React.useContext(dataContext)
    const { hasPermission } = React.useContext(authContext)
    const history = useHistory()

    const sexArray = {
		"m": "Male",
		"f": "Female",
		"o": "Not Specified"
    }    

    const updateField = e => {
		setUser({
			...user,
			[e.target.name]: e.target.value
        })        
    }
     
    const openEdit = () => {
		setDisable(false);	  
    }

    const closeEdit = () => {
        setDisable(true);
    }

    const updateUserGroup = (e) => {           
        
        let role_detail = groups.filter(function(item) {             
            if(item.id == e.target.value){                
                return item
            }                   
        })
        
        if(e.target.checked){                  
            userGroups.map((group,index) => {
                if(group.id != e.target.value){                    
                    setUserGroups([...userGroups,role_detail[0]]);                    
                }
            })
        }
        else{            
            // userGroups.map((group,index) => {
            //     if(group.id == e.target.value){
            //         console.log("here");
            //         delete(userGroups[index]);
            //     }                
            // })
        }
        console.log(userGroups);
    }

    const deleteUser = () => {

    }

    React.useEffect(() => {        
        if(!hasPermission('user_edit')) history.push(`/users/${user_id}/`)

        const fetchUser = async() => {
            const user_details = await callApi({url: `/users/${user_id}`})
            if(user_details) {
                setUser(user_details)                
                setUserGroups(user_details.groups)              
            }
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
        e.preventDefault();        
    }

    return (
        <IonPage>
            <Title name={(!disable? 'Edit ':'') + user.name } />            
            <IonContent className="dark">
                { hasPermission('user_edit') && disable ?  (
                    <IonFab vertical="bottom" horizontal="end" slot="fixed">
                        <IonFabButton onClick={openEdit}>
                            <IonIcon icon={ pencil } />
                        </IonFabButton>
                    </IonFab>
                ) : (
                    <IonFab vertical="bottom" horizontal="end" slot="fixed">
                        <IonFabButton onClick={closeEdit}>
                            <IonIcon icon={ close } />
                        </IonFabButton>
                    </IonFab>
                ) }

                <IonGrid>
                    <IonRow>
                        <IonCol size-xs="12" size-md="6">
                            <IonCard className="dark">
                                <IonCardHeader>
                                    <IonCardTitle>
                                        {!disable? ('Edit'): null} Volunteer Details
                                    </IonCardTitle>
                                </IonCardHeader>
                                <IonCardContent>
                                    <form onSubmit={e => saveUser(e)}>
                                    <IonList>
                                        <InputRow label="Name" name="name" type="text" value={ user.name }  disable={disable} handler={updateField}/>
                                        <InputRow label="Email" name="email" type="text" value={ user.email } disable={disable}/>
                                        <InputRow label="Phone" name="phone" type="text" value={ user.phone } disable={disable}/>
                                        {!disable? (
                                            <>
                                                <InputRow label="Password" id="password" type="password" value="" disable={disable}/>
                                                <InputRow label="Confirm Password" id="confirm-password" type="password" value="" />
                                            </>
                                        ): null}                     

                                        {disable? (
                                            <InputRow label="Sex" id="sex" type="text" value={ sexArray[user.sex] } disable={disable}/>
                                        ): (
                                            <IonRadioGroup name="sex" value={ user.sex }>
                                                <IonListHeader>
                                                    <IonLabel>Sex</IonLabel>
                                                </IonListHeader>

                                                <IonItem>
                                                <IonLabel>Male</IonLabel>
                                                <IonRadio mode="ios" name="sex" slot="start" value="m" />
                                                </IonItem>

                                                <IonItem>
                                                <IonLabel>Female</IonLabel>
                                                <IonRadio mode="ios" name="sex" slot="start" value="f" />
                                                </IonItem>

                                                <IonItem>
                                                <IonLabel>Other</IonLabel>
                                                <IonRadio mode="ios" name="sex" slot="start" value="o"/>
                                                </IonItem>
                                            </IonRadioGroup>
                                        )}    

                                        <IonItem>
                                            <IonLabel position="stacked">Roles</IonLabel>
                                        </IonItem>                                        
                                        { userGroups.map((grp, index) => {
                                            return (
                                                <IonChip key={index} className="roles">{grp.name}</IonChip>
                                            )                                                
                                        })}                                                                                    

                                        {disable? null : (
                                            <>                                            
                                            <div className="groups-area">
                                            { groups.map((grp, index) => {
                                                return (
                                                <IonItem key={ index } lines="none" className="group-selectors">
                                                    <IonCheckbox value={ grp.id }                                                        
                                                        onIonChange={updateUserGroup}
                                                        checked={ 
                                                            userGroups.reduce((found, ele) => { // We are reducing the groups array of the user to a true/false based on this group.
                                                            if(found) return found
                                                            else if(ele.id === grp.id) return true
                                                            else return false
                                                        }, false) } /><IonLabel> &nbsp; { grp.name }</IonLabel>
                                                </IonItem>)
                                            })}
                                            </div>
                                            </>
                                        )}                                        

                                        { !disable? (
                                            <IonItem>
                                                <IonButton type="submit" size="default">Save</IonButton>
                                            </IonItem>
                                        ): null}                                        

                                        {/* <IonItemDivider><IonLabel>Other Actions</IonLabel></IonItemDivider>

                                        <IonItem>
                                            // :TODO:
                                            Let Go of Volunteer
                                            Mark Volunteer as Alumni
                                        </IonItem> */}

                                        </IonList>
                                    </form>
                                </IonCardContent>
                            </IonCard>
                        </IonCol>
                        <IonCol size-md="6" size-xs="12">
                            <IonCard className="light">
                                <IonCardHeader>
                                    <IonCardTitle>
                                        Volunteer Update
                                    </IonCardTitle>
                                </IonCardHeader>
                                <IonCardContent>
                                    <IonItem>                                        
                                        {disable? (
                                            <InputRow label="User Type" type="text" value={ user.user_type } disable={disable}/>
                                        ): (
                                            <IonRadioGroup name="user_type" value={ user.user_type }>
                                                <IonListHeader>
                                                    <IonLabel>User Type</IonLabel>
                                                </IonListHeader>

                                                <IonItem>
                                                <IonLabel>Volunteer</IonLabel>
                                                <IonRadio mode="ios" name="user_type" slot="start" value="volunteer" />
                                                </IonItem>

                                                <IonItem>
                                                <IonLabel>Alumni</IonLabel>
                                                <IonRadio mode="ios" name="user_type" slot="start" value="alumni" />
                                                </IonItem>

                                                <IonItem>
                                                <IonLabel>Let Go</IonLabel>
                                                <IonRadio mode="ios" name="seuser_typex" slot="start" value="let_go"/>
                                                </IonItem>
                                            </IonRadioGroup>
                                        )}                                         
                                    </IonItem>
                                    <IonItem>
                                        <IonButton size="default" expand="full" onClick={deleteUser}><IonIcon icon={trash}></IonIcon>Delete User</IonButton>
                                    </IonItem>
                                </IonCardContent>
                            </IonCard>
                        </IonCol>
                    </IonRow>
                </IonGrid>
            </IonContent>
        </IonPage>
    )
}

const InputRow = ({ id, label, type, value, disable, handler }) => {    
    return (
        <IonItem>
            <IonLabel position="stacked">{ label }</IonLabel>
            <IonInput type={ type } id={ id } placeholder={ label } value={ value }  disabled={disable} onIonChange={e => handler(e)}/>
        </IonItem>
    )
}

export default UserForm