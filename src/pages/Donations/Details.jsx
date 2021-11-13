import {
    IonPage,
    IonContent,
    IonCardContent,
    IonCard,
    IonGrid,
    IonRow,
    IonCol
  } from '@ionic/react'
import React from 'react'
import { useParams } from 'react-router-dom'
import moment from 'moment'
import { dataContext } from '../../contexts/DataContext'
import { authContext } from '../../contexts/AuthContext'
import Title from '../../components/Title'
  
const DonationDetails = () => {
  const { callApi } = React.useContext(dataContext)
  const { user } = React.useContext(authContext)
  const [donation, setDonation] = React.useState([])
  const { donation_id } = useParams()

  React.useEffect(() => {     
    function fetchDonation() {
      callApi({
        url: `donations/${donation_id}`,
        method: `get`,
        setter: setDonation
      })
    }
    fetchDonation()
  }, [donation_id])

  return (
    <IonPage>
      <Title name={`Donation Details`} back="/donations"/>
      <IonContent className="dark">
        <IonCard key={donation_id}>
          <IonCardContent>
            <IonGrid>
              <IonRow>
                <IonCol className="label">Donation Id</IonCol>
                <IonCol pullMd="3">{donation_id}</IonCol>
              </IonRow>
              <IonRow>
                <IonCol className="label">Donor Name</IonCol>
                <IonCol pullMd="3">{donation.donor}</IonCol>
              </IonRow>
              <IonRow>
                <IonCol className="label">Fundraiser Name</IonCol>
                <IonCol pullMd="3">{user.name}</IonCol>
              </IonRow>
              <IonRow>
                <IonCol className="label">Amount</IonCol>
                <IonCol pullMd="3">{donation.amount}</IonCol>
              </IonRow>
              <IonRow>
                <IonCol className="label">Donation Date</IonCol>
                <IonCol pullMd="3">
                  {moment(donation.added_on).format('Do MMM, YYYY')}
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol className="label">Donation Type</IonCol>
                <IonCol pullMd="3">{donation.type}</IonCol>
              </IonRow>
            </IonGrid>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  )
}
  
export default DonationDetails
  