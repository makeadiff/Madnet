import { IonList,IonItem,IonLabel,IonInput,IonCheckbox,IonSelect,IonSelectOption,IonButton, IonCard, IonCardHeader, IonCardTitle, IonCardContent} from '@ionic/react'
import React from 'react'

import { authContext } from "../../contexts/AuthContext"
import { dataContext } from "../../contexts/DataContext"
import UserDetail from "../../components/User"
import "./Form.css"

const UserSearch = ({ segment }) => {
    const { user } = React.useContext(authContext)
    const [ groups, setGroups ] = React.useState([])
    const [ showMore, setShowMore ] = React.useState(false)
    const { getUsers, callApi } = React.useContext(dataContext)
    const [users, setUsers] = React.useState( null )
    const [search, setSearch] = React.useState({
        city_id: user.city_id,
        id: "",
        phone: "",
        any_email: "",
        groups_in: "",
        user_type: "volunteer"
    })

    React.useEffect(() => {
        const fetchGroups = () => {
            callApi({ url: "/groups?type_in=fellow,volunteer"}).then((data) => {
                setGroups(data)
            })
        }
        fetchGroups()
    }, [segment])

    const setSearchValue = (key, value) => {
        const new_search = {...search, [key]: value}
        setSearch(new_search)
    }

    // This converts the selected checkboxes into a coma seperated list of ids.
    const setGroupSearch = (e) => {
        let groups = []
        if(search.group_in) groups = search.group_in.split(",")
        const value = e.target.value
        if(e.target.checked) {
            groups.push(value)
        } else {
            groups = groups.filter((ele) => { return ele !== value })
        }
        setSearch({...search, group_in: groups.join(",")})
    }

    const searchUser = async (e) => {
        e.preventDefault()
        let user_search = {}
        for(let key in search) {
            if(search[key]) {
                user_search[key] = search[key]
            }
        }
        const user_data = await getUsers(user_search)
        // console.log(user_data)
        setUsers(user_data)
    }

    return (<>
        <form onSubmit={e => searchUser(e)}>
        
        <IonCard className="dark">
            <IonCardHeader>
                <IonCardTitle>Search Volunteer(s)</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
                <InputRow label="Volunteer ID" id="id" type="text" value={search.id} onIonInput={e => setSearchValue("id", e.target.value)} />
                <InputRow label="Volunteer Name" id="name" type="text" value={search.name} onIonInput={e => setSearchValue("name", e.target.value)} />
                <InputRow label="Volunteer Email" id="any_email" type="text" value={search.any_email} onIonInput={e => setSearchValue("any_email", e.target.value)} />
                <InputRow label="Volunteer Phone" id="phone" type="text" value={search.phone} onIonInput={e => setSearchValue("phone", e.target.value)} />

                { showMore ?
                    (<div className="more-options">
                        <IonItem><IonLabel>Groups</IonLabel></IonItem>
                        <div className="groups-area">
                        { groups.map((grp, index) => {
                            return (<IonItem key={ index } lines="none" className="group-selectors">
                                <IonCheckbox value={ grp.id } onIonChange={ setGroupSearch } />
                                <IonLabel> &nbsp; { grp.name }</IonLabel>
                            </IonItem>)
                        })}
                        </div>

                        <IonItem>
                            <IonLabel>User Type</IonLabel>
                            <IonSelect value={ search.user_type } placeholder="Select One" interface="popover" onIonChange={ e => setSearchValue("user_type", e.target.value)}>
                                <IonSelectOption value="volunteer" selected={true}>Volunteer</IonSelectOption>
                                <IonSelectOption value="applicant">Applicant</IonSelectOption>
                                <IonSelectOption value="alumni">Alumni</IonSelectOption>
                                <IonSelectOption value="let_go">Let Go</IonSelectOption>
                                <IonSelectOption value="any">Any</IonSelectOption>
                            </IonSelect>
                        </IonItem>
                    </div>)
                    : <IonItem onClick={() => setShowMore(true) }><a>Show More Options...</a></IonItem> }

                <IonItem><IonButton type="submit" size="default">Search</IonButton></IonItem>
            </IonCardContent>
        </IonCard>
        </form>
        { users !== null ? <Listing users={users} /> : null }
        </>
    )
}

const InputRow = ({ id, label, type, value, onIonInput }) => {
    return (
        <IonItem>
            <IonLabel position="stacked">{ label }</IonLabel>
            <IonInput type={ type } id={ id } placeholder={ label } value={ value } onIonInput={ onIonInput } />
        </IonItem>
    )
}

const Listing = ({ users }) => {
    return (        
        <IonList>
            {users.length && users.map((user, index) => {
                return (
                    <UserDetail user={user} index={index} key={index}/>
                );
            })}
            { (users.length === 0) ? (<IonItem><IonLabel>No users found.</IonLabel></IonItem>) : null }
        </IonList>
    )
}

export default UserSearch
