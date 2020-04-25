import { IonList,IonItem,IonLabel } from '@ionic/react'
import React, { useState, useEffect } from 'react'

import { authContext } from "../../contexts/AuthContext"
import { appContext } from "../../contexts/AppContext"
import { dataContext } from "../../contexts/DataContext"

const UserList = ({ segment }) => {
    const { user } = React.useContext(authContext)
    const { setLoading, showMessage } = React.useContext(appContext)
    const { getUsers } = React.useContext(dataContext)
    const [users, setUsers] = useState([])

    useEffect(() => {
        async function fetchUserList() {
            setLoading(true)
            let user_data = []

            if(segment === "needs-attention") {
                user_data = await getUsers({city_id: user.city_id, credit_lesser_than: 0})
            } else if(segment === "all") {
                 user_data = await getUsers({city_id: user.city_id });
            }
            if(user_data) {
                setUsers(user_data)
            } else {
                showMessage("UserList fetch call failed.", "error")
            }
            setLoading(false)
        }
        fetchUserList();
    }, [segment])

    return (
        <IonList>
            {users.map((user, index) => {
                return (
                    <IonItem key={index} routerLink={ `/users/${user.id}/view` } routerDirection="none" >
                        <IonLabel>
                            <h4>{user.name}</h4>
                            <p>Phone: { user.phone }</p>
                            <p>Email: { user.email }</p>
                            <p>Credit : { user.credit } </p>
                        </IonLabel>
                    </IonItem>
                );
            })}
            { (users.length === 0) ? (<IonItem><IonLabel>No users found.</IonLabel></IonItem>) : null }
        </IonList>
    );
};

export default UserList;
