import { IonItem, IonCard, IonGrid, IonRow, IonCol, IonChip, IonCardHeader, IonCardTitle, IonButton, IonPopover, IonIcon, IonItemDivider, IonLabel, IonCardContent, IonAlert } from '@ionic/react'
import React from 'react'
import { Link, useHistory } from 'react-router-dom'

import {ellipsisVertical, trash, personRemove} from 'ionicons/icons';
import { authContext } from "../contexts/AuthContext"
import { dataContext } from "../contexts/DataContext"

const UserDetail = ({user, index}) => {  

    const [ showOptions, setShowOptions ] = React.useState(false)
    const { hasPermission } = React.useContext(authContext)
    const { deleteUser, updateUser } = React.useContext(dataContext)
    const [ confirmDelete, setConfirmDelete ] = React.useState(false)
    const [ confirmAlumni, setConfirmAlumni ] = React.useState(false)
    const history = useHistory()
  
    let markAlumni = async () => {    
        setShowOptions(false);
        let response = await updateUser(user.id, {user_type: 'alumni'});
        if(response){
            setConfirmDelete(false);
            history.push(`/users`)
        // console.log(response)
        }
    //TODO: Remove Caching of Data upon update.
    }

    let deleteVolunteer = async () => {    
        setShowOptions(false);
        let response = await deleteUser(user.id);
        if(response){
            setConfirmDelete(false);
            history.push(`/users`)
        // console.log(response)
        }
    //TODO: Remove Caching of Data upon update.
    }

    return (
        <>
            <IonPopover
                isOpen={showOptions}
                onDidDismiss={e => setShowOptions(false)} > 
      
                <IonItem button routerLink={ `/users/${user.id}/` } routerDirection="none" onClick={() => setShowOptions(false)}> View {user.name} </IonItem>
                { hasPermission('user_edit') ? (
                    <>
                        <IonItemDivider>
                            <IonLabel> Edit {user.name} </IonLabel>                          
                        </IonItemDivider>
                        <IonItem button onClick={(e)=>setConfirmAlumni(true)}><IonIcon className="userOptions" icon={personRemove}></IonIcon> Mark Alumni</IonItem>
                        <IonItem button onClick={(e)=>setConfirmDelete(true)}><IonIcon className="userOptions" icon={trash}></IonIcon>Delete </IonItem>
                    </>
                ): null }      
        
            </IonPopover>
            <IonCard class="light list" key={index}>
                <Link to={ `/users/${user.id}/` }>
                    <IonCardHeader className="noPadding">
                        <IonCardTitle>          
                            <p>
                #{index+1}. {user.name}
                            </p>                 
                        </IonCardTitle>
                    </IonCardHeader>
                </Link>
                <IonCardContent>
                    <IonGrid>
                        <IonRow>
                            <IonCol size="11">
                                <IonRow>
                                    <IonCol size-md="5" size-xs="6">                    
                                        <p>Email: <strong>{ user.email }</strong></p>
                                        {user.mad_email ? (
                                            <p>MAD Email: { user.mad_email }</p>
                                        ): null}
                                        <p>{ user.phone }</p>                    
                                    </IonCol>
                                    <IonCol size-md="2" size-xs="6">                    
                                        <p>Credit<br/><strong>{ user.credit }</strong></p>                    
                                    </IonCol>
                                    <IonCol size-md="5" size-xs="12">
                                        {
                                            user.groups.map((role,count) => {
                                                return (
                                                    <IonChip className="roles" key={count}>{role.name}</IonChip>
                                                )
                                            })
                                        }
                                    </IonCol>
                                </IonRow>
                            </IonCol>
                            <IonCol size="1">
                                <IonButton  size="small" fill="clear" slots="icon-only" color="light" className="userEditButton" onClick={() => setShowOptions(true)}><IonIcon icon={ellipsisVertical}></IonIcon></IonButton>
                            </IonCol>
                        </IonRow>
                    </IonGrid>
                </IonCardContent>
            </IonCard>
            <IonAlert
                isOpen={ confirmDelete }
                onDidDismiss={ () => { setConfirmDelete(false); setShowOptions(false); } }
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
                        handler: e => deleteVolunteer(user.id)
                    }
                ]} />

            <IonAlert
                isOpen={ confirmAlumni }
                onDidDismiss={ () => { setConfirmAlumni(false); setShowOptions(false); } }
                header={'Mark as Alumni'}
                message={'Are you sure you wish to mark ' + user.name + ' as an alumni?'}
                buttons={[
                    {
                        text: 'Cancel',
                        role: 'cancel',
                        cssClass: 'secondary',
                        handler: e => { }
                    },
                    {
                        text: 'Mark as Alumni',
                        handler: e => markAlumni(user.id)
                    }
                ]} />
        </>
    )
}

export default UserDetail;