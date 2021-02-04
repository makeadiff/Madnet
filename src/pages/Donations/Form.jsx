import React from 'react'
import {
  IonButton,
  IonInput,
  IonPage,
  IonContent,
  IonLabel,
  IonItem,
  IonSelect,
  IonSelectOption,
  IonList,
  IonCard,
  IonCardContent
} from '@ionic/react'
import moment from 'moment'

import { authContext } from '../../contexts/AuthContext'
import { dataContext } from '../../contexts/DataContext'
import { appContext } from '../../contexts/AppContext'
import Title from '../../components/Title'

// TODO - validations don't work.

const DonationForm = () => {
  const { user } = React.useContext(authContext)
  const [donation, setDonation] = React.useState({
    donor_name: '',
    amount: '',
    donor_phone: '',
    donor_email: '',
    added_on: moment().format('YYYY-MM-DD'),
    fundraiser_user_id: user.id,
    type: 'crowdfunding_patforms',
    source: 'give_india'
  })

  const [errors, setErrors] = React.useState({
    donor_name: '',
    amount: '',
    donor_phone: '',
    donor_email: '',
    source: '',
    added_on: ''
  })
  const { callApi } = React.useContext(dataContext)
  const { showMessage } = React.useContext(appContext)

  const setError = (id, error) => {
    setErrors({ ...errors, [id]: error })
  }

  const updateField = (e) => {
    const ele = e.target
    const { id, value } = ele

    setError(id, '')
    if (id === 'donor_email' && value) {
      if (
        !value.match(/^[a-zA-Z0-9\-\_\.]+@[a-zA-Z0-9\-\_\.]+\.[a-zA-Z\.]{2,6}$/)
      ) {
        setError(id, 'Please enter a valid email address')
      }
    } else if (id === 'donor_phone' && value) {
      if (!value.match(/^(\+?\d{1,3}[\- ]?)?\d{10}$/)) {
        setError(id, 'Please enter a phone number')
      }
    } else if (id === 'donor_name' && value) {
      if (!value.match(/^[A-Za-z\-' ]{1,60}$/)) {
        setError(id, 'Please enter a valid name')
      }
    }

    setDonation({ ...donation, [id]: value })
  }

  const saveDonation = (e) => {
    e.preventDefault()

    donation.comment = JSON.stringify({source: donation.source})

    // :TODO: Use comment parameter to add which platform - ketto or global giving.
    callApi({
      url: '/donations',
      method: 'post',
      params: donation
    }).then((data) => {
      if (data.id) {
        showMessage('Donation details saved. Donation ID: ' + data.id)
        setDonation({
          donor_name: '',
          amount: '',
          donor_phone: '',
          donor_email: '',
          added_on: moment().format('YYYY-MM-DD'),
          fundraiser_user_id: user.id,
          type: 'crowdfunding_patforms'
        })
        setError('donor_email', '')
        setError('donor_name', '')
        setError('donor_phone', '')
        setError('amount', '')
      }
    })
  }

  return (
    <IonPage>
      <Title name="Add Crowd Funding Donations" />
      <IonContent className="dark">
        <IonCard>
          <IonCardContent>
            <form onSubmit={(e) => saveDonation(e)}>
              <IonList>
                <IonItem>
                  <IonLabel position="stacked">Donor Name</IonLabel>
                  <IonInput
                    id="donor_name"
                    type="text"
                    value={donation.donor_name}
                    required={true}
                    minlength="2"
                    maxlength="70"
                    autocapitalize={true}
                    onIonChange={updateField}
                  />
                  {errors.donor_name ? (
                    <p className="error-message">{errors.donor_name}</p>
                  ) : null}
                </IonItem>

                <IonItem>
                  <IonLabel position="stacked">Donor Email</IonLabel>
                  <IonInput
                    id="donor_email"
                    type="email"
                    value={donation.donor_email}
                    required={true}
                    onIonChange={updateField}
                  />
                  {errors.donor_email ? (
                    <p className="error-message">{errors.donor_email}</p>
                  ) : null}
                </IonItem>

                <IonItem>
                  <IonLabel position="stacked">Donor Phone</IonLabel>
                  <IonInput
                    id="donor_phone"
                    type="tel"
                    value={donation.donor_phone}
                    required={true}
                    onIonChange={updateField}
                  />
                  {errors.donor_phone ? (
                    <p className="error-message">{errors.donor_phone}</p>
                  ) : null}
                </IonItem>

                <IonItem>
                  <IonLabel position="stacked">Amount</IonLabel>
                  <IonInput
                    id="amount"
                    type="number"
                    value={donation.amount}
                    required={true}
                    onIonChange={updateField}
                  />
                  {errors.amount ? (
                    <p className="error-message">{errors.amount}</p>
                  ) : null}
                </IonItem>

                <IonItem>
                  <IonLabel position="stacked">Source</IonLabel>
                  <IonSelect
                    name="source"
                    id="source"
                    value={donation.source}
                    onIonChange={updateField}
                  >
                    <IonSelectOption value="give_india">Give India</IonSelectOption>
                    <IonSelectOption value="global_giving">Global Giving</IonSelectOption>
                    <IonSelectOption value="ketto">Ketto</IonSelectOption>
                  </IonSelect>
                  {errors.source ? (
                    <p className="error-message">{errors.source}</p>
                  ) : null}
                </IonItem>

                <IonItem>
                  <IonLabel position="stacked">Donated On</IonLabel>
                  <IonInput
                    id="added_on"
                    type="date"
                    value={donation.added_on}
                    max={moment().format('YYYY-MM-DD')}
                    onIonChange={updateField}
                  />
                  {errors.added_on ? (
                    <p className="error-message">{errors.added_on}</p>
                  ) : null}
                </IonItem>

                <IonItem>
                  <IonButton size="default" type="submit">
                    Save
                  </IonButton>
                </IonItem>
              </IonList>
            </form>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  )
}

export default DonationForm
