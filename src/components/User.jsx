import { IonItem, IonCard, IonGrid, IonRow, IonCol, IonChip, IonCardHeader, IonCardTitle, IonButton, IonPopover, IonIcon, IonItemDivider, IonLabel} from '@ionic/react'
import React from 'react'
import { Link } from 'react-router-dom'

import {ellipsisVertical, trash, personRemove} from 'ionicons/icons';
import { authContext } from "../contexts/AuthContext"

const UserDetail = ({user, index}) => {  

  const [ showOptions, setShowOptions ] = React.useState(false); 
  const { hasPermission } = React.useContext(authContext)
  
  let markAlumni = (user_id) => {
    console.log(user_id);
    setShowOptions(false);
    //TODO: Update functionality
  }

  let deleteUser = (user_id) => {
    console.log(user_id);
    setShowOptions(false);
    //TODO: Update functionality
  }

  return (
    <>
    <IonPopover
        isOpen={showOptions}
        onDidDismiss={e => setShowOptions(false)}
    > 
      
      <IonItem button routerLink={ `/users/${user.id}/` } routerDirection="none" onClick={() => setShowOptions(false)}> View {user.name} </IonItem>
      { hasPermission('user_edit') ? (
        <>
          <IonItemDivider>
            <IonLabel> Edit {user.name} </IonLabel>                          
          </IonItemDivider>
          <IonItem button onClick={(e)=>markAlumni(user.id)}><IonIcon className="userOptions" icon={personRemove}></IonIcon> Mark Alumni</IonItem>
          <IonItem button onClick={(e)=>deleteUser(user.id)}><IonIcon className="userOptions" icon={trash}></IonIcon>Delete </IonItem>
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
        <IonGrid>
            <IonRow>                
                <IonCol size-md="3" size-xs="6">                    
                    <p>{ user.email }</p>
                    <p>{ user.phone }</p>                    
                </IonCol>
                <IonCol size-md="2" size-xs="6">                    
                    <p>Credit<br/>{ user.credit } </p>                    
                </IonCol>
                <IonCol size-md="5" size-xs="6">
                    {
                      user.groups.map((role,count) => {
                        return (
                          <IonChip className="roles" key={count}>{role.name}</IonChip>
                        )
                      })
                    }
                </IonCol>
                <IonCol size-md="2" size-xs="6">
                  <IonButton  size="small" fill="clear" slots="icon-only" color="light" className="userEditButton" onClick={() => setShowOptions(true)}><IonIcon icon={ellipsisVertical}></IonIcon></IonButton>
                </IonCol>
            </IonRow>
        </IonGrid>
    </IonCard>
    </>
  )
}

export default UserDetail;