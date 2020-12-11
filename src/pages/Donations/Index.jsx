import { IonPage,IonContent,IonIcon,IonFab,IonFabButton, IonCardContent, IonCard,IonGrid,IonRow,IonCol } from '@ionic/react'
import { add } from 'ionicons/icons'
import React from 'react'
import moment from 'moment'

import { dataContext } from "../../contexts/DataContext"
import { authContext } from "../../contexts/AuthContext"
import Title from "../../components/Title"

const DonationIndex = () => {
    const { callApi } = React.useContext(dataContext)
    const { user } = React.useContext(authContext)
    const [donations, setDonations] = React.useState([])
    const [total, setTotal] = React.useState(0)

    React.useEffect(() => {
        function fetchDonationList() {
            callApi({
                url: `/users/${user.id}/donations`,
                method: `get`,
                setter: setDonations // :TODO: There will be a cacheing issue on adding new donations - the new one won't show up
            });
        }
        fetchDonationList()
    }, [])

    React.useEffect(() => {
        const doantion_total = donations.reduce(function (sum, don) { return sum + don.amount }, 0)
        setTotal(doantion_total)

    }, [donations])

    return (
        <IonPage>
            <Title name={`Funds raised by you this year: ${total} Rs`} />
      
            <IonContent className="dark">
                {donations.map((donation, index) => {
                    return (
                        <IonCard key={index}>
                            <IonCardContent>
                                <IonGrid>
                                    <IonRow>
                                        <IonCol className="label">ID</IonCol>
                                        <IonCol pullMd="3">{donation.id}</IonCol>
                                    </IonRow>
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
                                        <IonCol pullMd="3">{moment(donation.added_on).format("Do MMM, YYYY")}</IonCol>
                                    </IonRow>
                                </IonGrid>
                            </IonCardContent>
                        </IonCard>
                    );
                })}

                <IonFab vertical="bottom" horizontal="start" slot="fixed">
                    <IonFabButton routerLink={ `/donations/0` }><IonIcon icon={ add }/></IonFabButton>
                </IonFab>
            </IonContent>
        </IonPage>
    );
};

export default DonationIndex
