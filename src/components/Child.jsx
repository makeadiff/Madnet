/* eslint-disable indent */
import { IonItem, IonCard, IonGrid, IonRow, IonCol, IonCardTitle, IonPopover, IonIcon } from '@ionic/react'
import React from 'react'
import * as moment from 'moment'
import { Link } from 'react-router-dom'

import {ellipsisVertical, personRemove, trash} from 'ionicons/icons';

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
            <IonPopover isOpen={showOptions} onDidDismiss={() => setShowOptions(false)} >
                <IonItem button routerLink={ `/students/${child.id}`} onClick={() => setShowOptions(false)}> View { child.name }</IonItem>
                <IonItem button><IonIcon className="userOptions" icon={personRemove}></IonIcon> Mark Alumni</IonItem>
                <IonItem button><IonIcon className="userOptions" icon={trash}></IonIcon>Delete </IonItem>
            </IonPopover>
            <IonCard class="light list" key={index}>
                <IonGrid>
                    <IonRow>
                      <IonCol size="11">
                          <Link to={ `/students/${child.id}` }>
                              <IonCardTitle>#{index+1}. {child.name}</IonCardTitle>
                          </Link>
                      </IonCol>
                      <IonCol size="1">
                          <IonItem size="small" slots="end" className="userEditButton" onClick={() => setShowOptions(true)}>
                              <IonIcon icon={ellipsisVertical} color="light"></IonIcon>
                          </IonItem>
                      </IonCol>
                  </IonRow>
                  <IonRow>
                        <IonCol>
                            { (child.birthday && child.birthday !== "0000-00-00" ) ? <>DoB: { moment(child.birthday).format("MMMM Do, YYYY") }<br /></> : null }
                            { (child.sex) ? ( <>Sex: {sexArray[child.sex]}<br /></>) : null }
                            { child.center.name }
                        </IonCol>
                   </IonRow>
                </IonGrid>
            </IonCard>
        </>
    )
}

export default ChildDetail;