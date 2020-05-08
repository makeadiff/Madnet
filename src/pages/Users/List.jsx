import { IonList,IonItem,IonLabel, IonCard, IonGrid, IonRow, IonCol, IonText } from '@ionic/react'
import React from 'react'

import UserSearch from "./Search"
import UserDetail from "../../components/User"
import { authContext } from "../../contexts/AuthContext"
import { appContext } from "../../contexts/AppContext"
import { dataContext } from "../../contexts/DataContext"

import "./Form.css"

import './Users.css'

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
                    <UserDetail user={user} index={index} key={index}/>
                );
            })}
            { (users.length === 0) ? (<IonItem><IonLabel>No users found.</IonLabel></IonItem>) : null }
        </IonList>
    )
}

export default UserList

