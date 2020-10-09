import { IonList,IonItem,IonLabel } from '@ionic/react'
import React from 'react'

import UserSearch from "./Search"
import UserDetail from "../../components/User"
import Paginator from "../../components/Paginator"
import { authContext } from "../../contexts/AuthContext"
import { appContext } from "../../contexts/AppContext"
import { dataContext } from "../../contexts/DataContext"

import "./Form.css"

const UserList = ({ segment }) => {
    const { user } = React.useContext(authContext)
    const { showMessage } = React.useContext(appContext)
    const { getUsers } = React.useContext(dataContext)
    const [ users, setUsers ] = React.useState([])

    React.useEffect(() => {        
        (async function fetchUserList() {
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
        })();        

    }, [segment])

    let moveToPage = async (toPage) => {        
        let users = await getUsers({city_id: user.city_id, page: toPage});
        setUsers(users);
    }

    return segment === "search" ? <UserSearch /> : <Listing users={users} moveToPage={moveToPage}/>
}

const Listing = ({ users, moveToPage }) => {
    return (
        <>
            <Paginator data={users} pageHandler={moveToPage}></Paginator>
            <IonList>
                {users.total && users.data.map((user, index) => {
                    return (
                        <UserDetail user={user} index={users.from + index - 1} key={index}/>
                    );
                })}
                { (users.length === 0) ? (<IonItem><IonLabel>No users found.</IonLabel></IonItem>) : null }
            </IonList>
            <Paginator data={users} pageHandler={moveToPage}></Paginator>
        </>
    )
}

export default UserList
