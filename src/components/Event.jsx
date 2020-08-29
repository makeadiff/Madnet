import { IonList,IonItem,IonLabel, IonCard, IonGrid, IonRow, IonCol, IonCardContent, IonCardHeader, IonCardTitle, IonCardSubtitle, IonButton, IonPopover, IonIcon } from '@ionic/react'
import React from 'react'
import { Link } from 'react-router-dom'
import * as moment from 'moment'

import {ellipsisVertical, location} from 'ionicons/icons';

const EventDetail = ({event, index, segment}) => {  

  const [ showOptions, setShowOptions ] = React.useState(false);  

  return (
    <>
    <IonPopover
        isOpen={showOptions}
        onDidDismiss={e => setShowOptions(false)}
    > 
      {segment === 'invitations'? (
        <Link to={`events/${event.id}/rsvp`} onClick={e => setShowOptions(false)}><IonItem> RSVP </IonItem></Link>
      ): null}        
      <IonItem button>Delete Event</IonItem>        
    </IonPopover>
    <IonCard class="light list" key={index}>
      <Link to={`/events/view/${event.id}`}>
        <IonCardHeader className="noPadding">
          <IonCardTitle>
            <IonGrid>
              <IonRow>
                <IonCol size='11'>
                  <p>
                    #{index+1}. {event.event_type} / {event.name}              
                  </p>
                </IonCol>
                <IonCol size='1'>
                  <IonButton  size="small" fill="clear" slots="icon-only" color="light" className="userEditButton" onClick={() => setShowOptions(true)}><IonIcon icon={ellipsisVertical}></IonIcon></IonButton>
                </IonCol> 
                <IonCol size='12'>
                  {event.description ? (
                    <IonCardSubtitle>{event.description}</IonCardSubtitle>
                  ): null }  
                </IonCol>
              </IonRow>
            </IonGrid>              
          </IonCardTitle>                        
        </IonCardHeader>
      </Link>
      <IonCardContent>
        <IonGrid>
            <IonRow>                                
                <IonCol size-md="6" size-xs="6">                    
                    <p>Event Date &amp; Time: <b>{ moment(event.starts_on).format('DD MMM YYYY hh:mm A') }</b> </p>
                    <p>Happening At: <b>{ event.place }</b> </p>
                </IonCol>                
            </IonRow>
        </IonGrid>
      </IonCardContent>
    </IonCard>
    </>
  )
}

export default EventDetail;