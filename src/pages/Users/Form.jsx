import React from 'react'
import { IonButton, IonInput, IonPage, IonContent,IonLabel, IonItem,IonList,IonCheckbox,IonRadioGroup,IonListHeader,IonRadio, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCol, IonGrid, IonRow, IonFab, IonFabButton, IonIcon, IonChip, IonAlert } from '@ionic/react'
import { pencil, close, trash, add } from 'ionicons/icons'
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
    const { callApi, deleteUser, updateUser } = React.useContext(dataContext)
    const { hasPermission } = React.useContext(authContext)
    const [ confirmDelete, setConfirmDelete ] = React.useState(false)
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
            if(userGroups.length){              
                userGroups.map((group,index) => {
                    if(group.id != e.target.value){                    
                        setUserGroups([...userGroups,role_detail[0]]);
                    }
                })
            }
            else{
                setUserGroups([role_detail[0]]);
            }
        }
        else{                        
            userGroups.map((group,index) => {
                console.log(e.target.value, group.id)
                if(group.id == e.target.value){                     
                    let del = userGroups.splice(index,1)
                    setUserGroups([...userGroups])                    
                }                
            })
        }            
    }

    const deleteUserHandler = async () => {
        let response = await deleteUser(user.id);
        if(response){
            setConfirmDelete(false);
            history.push(`/users`)
            console.log(response)
        }
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
    

    const saveUser = async (e) => {
        e.preventDefault();
        let updateElements = {
            name: user.name,
            email: user.email,
            // mad_email: user.mad_email,
            phone: user.phone,
            sex: user.sex,
            user_type: user.user_type
        }
        let update = await updateUser(user.id,updateElements);
        var to_delete_groups = [], to_add_groups = [];
        let existing_groups = user.groups
        var exists;

        userGroups.map((group,index) => {                  
            exists = existing_groups.filter(function(item) {      
                console.log(item, group);       
                if(item.id == group.id){                
                    return index
                }                      
            });
            console.log(exists)
        })
        
        if(!existing_groups.length){
            userGroups.map(async (group)=> {
                let updateRoles = await callApi({url: `/users/${user.id}/groups/${group.id}`, method: 'post'});
                console.log(updateRoles);
            })
        }
        
        console.log(to_delete_groups, to_add_groups);

        if(update){
            setDisable(true)
            //TODO: give success message        
        }
    }
    

    return (
        <IonPage>
            {user.name ? (
            <>
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
                                            <IonItem>
                                                <IonLabel position="stacked">Name</IonLabel>
                                                <IonInput type="text" name="name" placeholder="Volunteer Name" value={ user.name }  disabled={disable} onIonChange={updateField}/>
                                            </IonItem>
                                            <IonItem>
                                                <IonLabel position="stacked">Email</IonLabel>
                                                <IonInput type="email" name="email" placeholder="Personal Email" value={ user.email }  disabled={disable} onIonChange={updateField}/>
                                            </IonItem>
                                            {/* <IonItem>
                                                <IonLabel position="stacked">MAD Email</IonLabel>
                                                <IonInput type="email" name="mad_email" placeholder="Official Email" value={ user.mad_email }  disabled={disable} onIonChange={updateField}/>
                                            </IonItem> */}
                                            <IonItem>
                                                <IonLabel position="stacked">Phone</IonLabel>
                                                <IonInput type="text" name="phone" placeholder="Phone" value={ user.phone }  disabled={disable} onIonChange={updateField}/>
                                            </IonItem>
                                            {/* {!disable? (
                                                <>
                                                    <InputRow label="Password" id="password" type="password" value="" disable={disable} handler={updateField}/>
                                                    <InputRow label="Confirm Password" id="confirm-password" type="password" value="" />
                                                </>
                                            ): null}*/}

                                            {disable? (
                                                <IonItem>
                                                    <IonLabel position="stacked">Sex</IonLabel>
                                                    <IonInput type="text" placeholder="Sex" value={ sexArray[user.sex] } disabled={disable}/>
                                                </IonItem>                                                                                                                                        
                                            ): (
                                                <IonRadioGroup name="sex" value={ user.sex } onIonChange={updateField}>
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
                                                        <IonCheckbox name="groups" value={ grp.id }
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
                                            

                                            </IonList>
                                        </form>
                                    </IonCardContent>
                                </IonCard>
                            </IonCol>
                            <IonCol size-md="6" size-xs="12">
                                <IonCard className="light">
                                    <IonCardHeader>
                                        <IonCardTitle>
                                            Other Actions
                                        </IonCardTitle>
                                    </IonCardHeader>
                                    <IonCardContent>
                                        <IonList>                                        
                                            {disable? (
                                                <IonItem>
                                                    <IonLabel position="stacked">User Type</IonLabel>
                                                    <IonInput type="text" name="user_type" placeholder="User Type" value={ user.user_type }  disabled={disable}/>
                                                </IonItem>                                                
                                            ): (
                                                <IonRadioGroup name="user_type" value={user.user_type} onIonChange={updateField}>
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
                                                    <IonRadio mode="ios" name="user_typex" slot="start" value="let_go"/>
                                                    </IonItem>
                                                </IonRadioGroup>
                                            )}                                         
                                        </IonList>                                        
                                        <IonItem>
                                         {!disable? (
                                            <IonButton type="submit" size="default" onClick={saveUser}>Save</IonButton>
                                         ):null }
                                            <IonButton color="danger" size="default" expand="full" onClick={(e) => setConfirmDelete(true)}><IonIcon icon={trash}></IonIcon>Delete User</IonButton>
                                        </IonItem>
                                    </IonCardContent>
                                </IonCard>
                            </IonCol>
                        </IonRow>
                    </IonGrid>
                </IonContent>
            </>
            ): (
            <>
                <Title name="Oops!" />
                <IonContent className="dark">
                    <IonCard className="dark">
                        <IonCardHeader>
                            <IonCardTitle>User not found.</IonCardTitle>
                        </IonCardHeader>
                        <IonCardContent>
                            There is no user active user (volunteer, let_go or alumni) with the specified ID.
                        </IonCardContent>
                    </IonCard>
                </IonContent>
            </>
            )}
                        

            <IonAlert
                isOpen={ confirmDelete }
                onDidDismiss={ () => setConfirmDelete(false) }
                header={'Delete'}
                message={'Are you sure you wish to delete ' + user.name + '?'}
                buttons={[
                    {
                        text: 'Cancel',
                        role: 'cancel',
                        cssClass: 'secondary',
                        handler: e => { }
                    },
                    {
                        text: 'Delete',
                        handler: deleteUserHandler
                    }
            ]} />
        </IonPage>
    )
}

export default UserForm