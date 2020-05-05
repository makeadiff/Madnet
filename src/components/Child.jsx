import { IonList,IonItem,IonLabel, IonCard, IonGrid, IonRow, IonCol, IonChip, IonCardHeader, IonCardTitle, IonButton, IonPopover, IonIcon } from '@ionic/react'
import React from 'react'

import {ellipsisVertical} from 'ionicons/icons';

const ChildDetail = ({child, index}) => {  

  const [ showOptions, setShowOptions ] = React.useState(false);   
  const sexArray = {
		"m": "Male",
		"f": "Female",
    "o": "Not Specified",
    null : "Not mentioned"
	}

  return (
    <>
    <IonPopover
        isOpen={showOptions}
        onDidDismiss={e => setShowOptions(false)}
    >
      <IonItem button routerLink={ `/children/${child.id}/view` } routerDirection="none"> More </IonItem>
      <IonItem button>Alumni</IonItem>      
        
    </IonPopover>
    <IonCard class="light list" key={index}>
      <IonCardHeader className="noPadding" routerLink={ `/children/${child.id}/view` } routerDirection="none">
        <IonCardTitle>
            <p>
              #{index+1}. {child.name}
            </p>                 
        </IonCardTitle>
      </IonCardHeader>
        <IonGrid>
            <IonRow>                
                <IonCol size-md="3" size-xs="6">                    
                    <p>DOB: { child.birthday }</p>
                    <p>Sex: { sexArray[child.sex] }</p>
                </IonCol>
                <IonCol size-md="3" size-xs="6">                    
                    <p>{ child.center_name }</p>                    
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

export default ChildDetail;