import {
  IonPage,
  IonContent,
  IonIcon,
  IonFab,
  IonFabButton,
  IonCardContent,
  IonCard,
  IonGrid,
  IonRow,
  IonCol
} from '@ionic/react'
import { add } from 'ionicons/icons'
import React from 'react'
import moment from 'moment'

import { dataContext } from '../../contexts/DataContext'
import { authContext } from '../../contexts/AuthContext'
import Title from '../../components/Title'

const DonationIndex = () => {
  const { callApi } = React.useContext(dataContext)
  const { user } = React.useContext(authContext)
  const [donations, setDonations] = React.useState([])
  const [total, setTotal] = React.useState(0)

  React.useEffect(() => {
    function fetchDonationList() {
      callApi({
        url: `/users/${user.id}/donations`,
        cache_key: `users_${user.id}_donations`,
        method: `get`,
        setter: setDonations
      })
    }
    fetchDonationList()
  }, [])

  React.useEffect(() => {
    const doantion_total = donations.reduce(function (sum, don) {
      return sum + don.amount
    }, 0)
    setTotal(doantion_total)
  }, [donations])

  const formatText = (input) => {
    if (!input) return ''
    input = input
      .replace(/[_\-]/g, ' ') //Changes 'hello_cruel-world' to 'hello cruel world'
      .replace(/([a-zA-Z])(\d)/g, '$1 $2') //Changes 'no1' to 'no 1'
      .replace(/([a-z])([A-Z])/g, '$1 $2') //Changes 'helloWorld' to 'hello World'

    var text = input
      .toLowerCase()
      .split(' ')
      .map(function (word) {
        return word.replace(word[0], word[0].toUpperCase())
      })
      .join(' ')

    return text
  }

  return (
    <IonPage>
      <Title name={`Funds raised by you this year: ${total} Rs`} />

      <IonContent className="dark">
        {donations.map((donation) => {
          return (
            <IonCard key={donation.id} routerLink={`/donations/`+donation.id}>
              <IonCardContent>
                <IonGrid>
                  <IonRow>
                    <IonCol className="label">Donor</IonCol>
                    <IonCol pullMd="3">{donation.donor}</IonCol>
                  </IonRow>
                  <IonRow>
                    <IonCol className="label">Amount</IonCol>
                    <IonCol pullMd="3">{donation.amount}</IonCol>
                  </IonRow>
                  <IonRow>
                    <IonCol className="label">Date</IonCol>
                    <IonCol pullMd="3">
                      {moment(donation.added_on).format('Do MMM, YYYY')}
                    </IonCol>
                  </IonRow>
                </IonGrid>
              </IonCardContent>
            </IonCard>
          )
        })}

        <IonFab vertical="bottom" horizontal="start" slot="fixed">
          <IonFabButton routerLink={`/donations/0`}>
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  )
}

export default DonationIndex
