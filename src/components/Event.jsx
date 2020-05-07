import { IonList,IonItem,IonLabel, IonCard, IonGrid, IonRow, IonCol, IonChip, IonCardHeader, IonCardTitle, IonCardSubtitle, IonButton, IonPopover, IonIcon } from '@ionic/react'
import React from 'react'

import {ellipsisVertical, location, arrowForward} from 'ionicons/icons';

const EventDetail = ({event, index, segment}) => {  

  const [ showOptions, setShowOptions ] = React.useState(false); 
  console.log(event);

  return (
    <>
    {/* <IonPopover
        isOpen={showOptions}
        onDidDismiss={e => setShowOptions(false)}
    >
      <IonItem button> More </IonItem>
      <IonItem button>Alumni</IonItem>      
        
    </IonPopover> */}
    <IonCard class="light list" key={index} routerLink={ segment=="invitations"? `/events/${event.id}/rsvp`: '' } routerDirection="none">
      <IonCardHeader className="noPadding">
        <IonCardTitle>          
            <p>
              #{index+1}. {event.event_type} / {event.name}              
            </p>
        </IonCardTitle>
        {event.description ? (
          <IonCardSubtitle>{event.description}</IonCardSubtitle>
        ): null }                
      </IonCardHeader>
        <IonGrid>
            <IonRow>                                
                <IonCol size-md="6" size-xs="6">                    
                    <p>Event Date: <br/>{ event.starts_on } </p>                 
                </IonCol>
                <IonCol size-md="6" size-xs="6">                                       
                    <p><IonIcon icon={location}></IonIcon>{ event.place } </p>                    
                </IonCol>                
                {/* <IonCol size-md="6" size-xs="6">
                  <IonButton  size="small" fill="clear" slots="icon-only" color="light" className="userEditButton" onClick={() => setShowOptions(true)}><IonIcon icon={ellipsisVertical}></IonIcon></IonButton>
                </IonCol> */}
            </IonRow>
        </IonGrid>
    </IonCard>
    </>
  )
}

export default EventDetail;