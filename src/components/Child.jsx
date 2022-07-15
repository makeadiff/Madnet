/* eslint-disable indent */
import {
  IonCard,
  IonCardContent,
  IonCardTitle
} from '@ionic/react'
import React from 'react'
import * as moment from 'moment'
import { Link } from 'react-router-dom'

const ChildDetail = ({ child, index }) => {
  const sexArray = {
    m: 'Male',
    f: 'Female',
    o: 'Not Specified',
    null: 'Not mentioned'
  }

  return (
    <>
      <IonCard class="light list" key={index}>
        <Link to={`/students/${child.id}`}>
          <IonCardTitle>
            #{index + 1}. {child.name}
          </IonCardTitle>
        </Link>
        <IonCardContent>
          {child.birthday && child.birthday !== '0000-00-00' ? (
            <>
              DoB: {moment(child.birthday).format('MMMM Do, YYYY')}
              <br />
            </>
          ) : null}
          {child.sex ? (
            <>
              Sex: {sexArray[child.sex]}
              <br />
            </>
          ) : null}
          {child.center.name}
        </IonCardContent>
      </IonCard>
    </>
  )
}

export default ChildDetail
