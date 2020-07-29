import { IonList,IonItem,IonLabel, IonCard, IonGrid, IonRow, IonCol, IonCardContent, IonCardHeader, IonCardTitle, IonCardSubtitle, IonButton, IonPopover, IonIcon } from '@ionic/react'
import React from 'react'
import { Link } from 'react-router-dom'

import {ellipsisVertical, location, arrowForward} from 'ionicons/icons';

const EventDetail = ({event, index, segment}) => {  

  const [ showOptions, setShowOptions ] = React.useState(false);  

  return (
    <>
    {/* <IonPopover
        isOpen={showOptions}
        onDidDismiss={e => setShowOptions(false)}
    >
      <IonItem button> More </IonItem>
      <IonItem button>Alumni</IonItem>      
        
    </IonPopover> */}
    <IonCard class="light list" key={index}>
      <Link to={`/events/view/${event.id}`}>
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
      </Link>
      <IonCardContent>
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
      </IonCardContent>
    </IonCard>
    </>
  )
}

export default EventDetail;