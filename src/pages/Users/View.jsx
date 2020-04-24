import { IonPage,IonContent } from '@ionic/react';
import React from 'react';

import Title from "../../components/Title"
import { authContext } from "../../contexts/AuthContext";
import { appContext } from "../../contexts/AppContext";

const UserView = () => {
    const { setLoading } = React.useContext(appContext);
    const { user } = React.useContext(authContext)

    return (
        <IonPage>
            <Title name="User Info" />

            <IonContent>

            </IonContent>
        </IonPage>
    );
};

export default UserView;
