import { IonList,IonItem,IonLabel } from '@ionic/react'
import React from 'react'

import UserSearch from "./Search"
import { authContext } from "../../contexts/AuthContext"
import { appContext } from "../../contexts/AppContext"
import { dataContext } from "../../contexts/DataContext"
import "./Form.css"

const UserList = ({ segment }) => {
    const { user } = React.useContext(authContext)
    const { showMessage } = React.useContext(appContext)
    const { getUsers } = React.useContext(dataContext)
    const [users, setUsers] = React.useState([])

    React.useEffect(() => {
        async function fetchUserList() {
            let user_data = []

            if(segment === "needs-attention") {
                user_data = await getUsers({city_id: user.city_id, credit_lesser_than: 0})
            } else if(segment === "all") {
                 user_data = await getUsers({city_id: user.city_id });
            }
            if(user_data) {
                setUsers(user_data)
            } else {
                showMessage("User List fetch call failed.", "error")
            }
        }
        fetchUserList();
    }, [segment])

    return segment === "search" ? <UserSearch /> : <Listing users={users} />
}

const Listing = ({ users }) => {
    return (
        <IonList>
            {users.map((user, index) => {
                return (
                    <IonItem key={index} routerLink={ `/users/${user.id}/view` } routerDirection="none" >
                        <IonLabel>
                            <h4>{user.name}</h4>
                            <p>Phone: { user.phone }</p>
                            <p>Email: { user.email }</p>
                            <p>Credit: { user.credit } </p>
                        </IonLabel>
                    </IonItem>
                );
            })}
            { (users.length === 0) ? (<IonItem><IonLabel>No users found.</IonLabel></IonItem>) : null }
        </IonList>
    )
}

export default UserList

