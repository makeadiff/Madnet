import React from 'react'
import { IonButton, IonInput, IonPage, IonContent,IonLabel, IonItem,IonList, IonCard, IonCardContent } from '@ionic/react'
import moment from 'moment'

import { authContext } from '../../contexts/AuthContext'
import { dataContext } from '../../contexts/DataContext'
import { appContext } from '../../contexts/AppContext'
import Title from '../../components/Title'

const DonationForm = () => {
    const { user } = React.useContext(authContext)
    const [ donation, setDonation ] = React.useState({donor_name: "", amount: "", donor_phone: "", donor_email: "", 
        added_on: moment().format("YYYY-MM-DD"), fundraiser_user_id: user.id, type: "crowdfunding_patforms"})
    const [ errors, setErrors] = React.useState({donor_name: "", amount: "", donor_phone: "", donor_email: "", added_on: ""})
    const { callApi } = React.useContext(dataContext)
    const { showMessage } = React.useContext(appContext)
    
    const setError = (id, error) => {
        setErrors({ ...errors, [id]: error})
    }

    const updateField = e => {
        const ele = e.target
        const { id, value } = ele

        let title = "name"
        if(id === "donor_email") title = "email address"
        else if(id === "donor_phone") title = "phone number"
        else if(id === "amount") title = "amount"

        // Using HTML validation.
        if(ele.firstChild && typeof ele.firstChild.checkValidity === "function" && !ele.firstChild.checkValidity()) {
            let message = ele.firstChild.validationMessage 
            if(ele.firstChild.validity.patternMismatch) {
                message = "Please enter a valid " + title
            }
            console.log("error " + message)
            setError(id, message)
        } else { // No errors.
            setError(id, "")
        }
        // Custom validation rules, if any, goes here.

        setDonation({...donation, [id]: value})
    }

    const saveDonation = e => {
        e.preventDefault()

        callApi({
            url: "/donations",
            method: "post",
            params: donation
        }).then((data) => {
            if(data.status === "success") {
                showMessage("Donation details saved")
            }
        })
    }  

    return (
        <IonPage>
            <Title name="Add Ketto Donation Details" />
            <IonContent className="dark">
                <IonCard>
                    <IonCardContent>
                        <form onSubmit={e => saveDonation(e)}>
                            <IonList>
                                <IonItem>
                                    <IonLabel position="stacked">Donor Name</IonLabel>
                                    <IonInput id="name" type="text" value={ donation.name } 
                                        required={true} minlength="2" maxlength="70" pattern="[A-Za-z\-' ]{1,60}"
                                        autocapitalize={true} onChange={ updateField } />
                                    { errors.donor_name ? <p className="error-message">{ errors.donor_name }</p> : null }
                                </IonItem>

                                <IonItem>
                                    <IonLabel position="stacked">Donor Email</IonLabel>
                                    <IonInput id="donor_email" type="email" value={ donation.donor_email } required={true} onIonChange={ updateField } />{/* pattern="/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/" */}
                                    { errors.donor_email ? <p className="error-message">{ errors.donor_email }</p> : null }
                                </IonItem>

                                <IonItem>
                                    <IonLabel position="stacked">Donor Phone</IonLabel>
                                    <IonInput id="donor_phone" type="tel" value={ donation.donor_phone } required={true} onIonChange={ updateField } />
                                    { errors.donor_phone ? <p className="error-message">{ errors.donor_phone }</p> : null }
                                </IonItem>

                                <IonItem>
                                    <IonLabel position="stacked">Amount</IonLabel>
                                    <IonInput id="amount" type="number" value={ donation.amount } required={true} onIonChange={ updateField }  />
                                    { errors.amount ? <p className="error-message">{ errors.amount }</p> : null }
                                </IonItem>


                                <IonItem>
                                    <IonLabel position="stacked">Donated On</IonLabel>
                                    <IonInput id="added_on" type="date" value={ donation.added_on } max={ moment().format("YYYY-MM-DD") } onIonChange={ updateField  } />
                                    { errors.added_on ? <p className="error-message">{ errors.added_on }</p> : null }
                                </IonItem>

                                <IonItem><IonButton size="default" type="submit">Save</IonButton></IonItem>

                            </IonList>
                        </form>
                    </IonCardContent>
                </IonCard>
            </IonContent>
        </IonPage>
    )
}

export default DonationForm