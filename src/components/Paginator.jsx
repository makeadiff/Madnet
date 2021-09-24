import React from 'react';
import { IonItem, IonButton, IonIcon, IonBadge } from '@ionic/react';
import { chevronBackOutline, chevronForwardOutline, caretBackOutline, caretForwardOutline} from 'ionicons/icons'

import "./Paginator.css"

const Paginator = React.memo(({data, pageHandler}) => {
    
  let callPage = (e) => {    
    let url = e.target.value;
    if(url !== null){      
      let pageNumber = url.split('page=')[1];
      pageHandler(pageNumber);
    }    
  }
  const fromTo = (typeof data.from != undefined && data.to != undefined) ? <h3 className="ion-text-center pageInfo" position="stacked">{data.from} - {data.to} of {data.total}</h3> : null 
  
  return (
    <>
    { fromTo }
    <div className="paginateContainer">
      <IonItem text-center className="ion-text-center pageinateItem">      
        <IonButton shape="round" title="First" color="dark" onClick={callPage} value={data.first_page_url} disabled={(data.current_page !== 1) ? false: true } >
          <IonIcon icon={caretBackOutline}></IonIcon>
        </IonButton>
        <IonButton shape="round" title="Previous" color="dark" onClick={callPage} value={data.prev_page_url} disabled={data.prev_page_url !== null ? false : true }>
          <IonIcon icon={chevronBackOutline}></IonIcon>
        </IonButton>
        <IonBadge mode="ios" color="light">{data.current_page} of {data.last_page}</IonBadge>      
        <IonButton shape="round" title="Next" color="dark" onClick={callPage} value={data.next_page_url} disabled={data.next_page_url !== null ? false: true }>
          <IonIcon icon={chevronForwardOutline}></IonIcon>
        </IonButton>
        <IonButton shape="round" title="Last" color="dark" onClick={callPage} value={data.last_page_url} disabled={(data.current_page !== data.last_page)? false: true }>
          <IonIcon icon={caretForwardOutline}></IonIcon>
        </IonButton>
      </IonItem>    
    </div>
    </>
  )
});

export default Paginator;