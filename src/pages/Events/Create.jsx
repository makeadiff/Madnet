import { IonPage, IonLabel,IonContent, IonInput,IonAvatar,IonFab, IonFabButton,IonIcon, IonGrid, IonRow, IonCol, IonCard, IonCardContent, 
    IonItem, IonTextarea, IonCardHeader, IonCardTitle, IonSelect, IonSelectOption, IonButton, IonList, IonCheckbox, IonHeader, IonDatetime, 
    IonModal, IonText, IonNote, IonChip, IonToolbar, IonSearchbar} from '@ionic/react';
import { calendar, pencil, close, checkmarkCircle, closeCircle, ellipse } from 'ionicons/icons'
import React from 'react';
import { useParams, useHistory } from "react-router-dom"
import { CITY_COORDINATES } from '../../utils/Constants'

import Title from "../../components/Title"
import Paginator from "../../components/Paginator"
import './Event.css'
import { authContext } from "../../contexts/AuthContext";
import { dataContext } from "../../contexts/DataContext";

const EventCreate = () => {
    const { eventId: event_id } = useParams();
    const { user, accessLevel } = React.useContext(authContext)
    const [ sendEmail, setSendEmail ] = React.useState(true)
    const [ usersList, setUsersList ] = React.useState(null)
    const [ editable, setEditable ] = React.useState(false);

    const [ userSelectable, setUserSelectable ] = React.useState(false)
    const { getUsers, callApi } = React.useContext(dataContext)
  
    const [ selectedUsers, setSelectedUsers ] = React.useState([])

    const [ userFilterParameter, setUserFilterParameter ] = React.useState({city_id: user.city_id})
    
    const [ disable, setDisable ] = React.useState(false)
    const [ showPopover, setShowPopover] = React.useState(false)
    const [ eventData, setEventData ] = React.useState({})
    let history = useHistory()

    const openEdit = () => {
        setDisable(false)
    }

    const closeEdit = () => {
        setDisable(true)
    }        

    const getEventUsers = async (params) => {
        setUserFilterParameter({...userFilterParameter,...params})
        let users = await getUsers(params)
        setUsersList(users)
        setUserSelectable(true)
    }

    const filterUserList = async (params) => {         
        console.log(params)
        let filterParams = {...params}
        if(params.city_in && (filterParams.city_id || filterParams.city_id === 0)){
            delete filterParams.city_id
        } else if(params.city_in === ''){        
            delete filterParams.city_in
        } else if(!params.city_in && eventData.city_id !== 0){             
            filterParams.city_id = eventData.city_id
        }
        console.log(filterParams)

        setUserFilterParameter(filterParams)
        let users = await getUsers(filterParams)
        if(users) {
            setUsersList(users)
        }
    }

    let moveToPage = async (toPage) => {
        console.log(toPage)
        let filters = {...userFilterParameter,page: toPage}
        setUserFilterParameter(filters)
        let users = await getUsers(filters)
        setUsersList(users)
        setUserSelectable(true)
    }    

    let selectAllUsers = async () => {      
        let selectUserList = []
        let currentPage = 0
        let usersListTemp = usersList
        do{
            usersListTemp.data.forEach(user => {
                selectUserList.push(user.id)
            });
            currentPage = usersListTemp.current_page
            if(usersList.last_page!== 1) {
                usersListTemp = await getUsers({...userFilterParameter,page: currentPage+1})
            }
        } while(currentPage !== usersList.last_page);

        return selectUserList;
    }
  
    let submitForm = async () => {
        if(event_id) {
            console.log(selectedUsers)
            return true
        }
        let event = eventData
        let response = await callApi({url: 'events', params: event, method: 'post'})

        if(response) {
            let event_id = response.id
            let email = (sendEmail) ? 1 : 0
        
            let sendInvites = await callApi({
                url: `events/${event_id}/users`,
                method: `post`,
                params: {
                    invite_user_ids: selectedUsers.join(','),
                    send_invite_emails: email
                }
            })

            let recurring = false;
        
            if(event.frequency!=='none') {
                recurring = await callApi({
                    url: `events/${event_id}/recur`,
                    method: 'post',
                    params:{
                        frequency: event.frequency,
                        repeat_until: event.repeat_until
                    }
                })
            } else {
                recurring = true;
            }          

            if(sendInvites && recurring){
                setShowPopover(false);            
                history.push(`/events/${event_id}`);
            }
        }
    }

    React.useEffect(() => {      
        if(event_id !== undefined && !isNaN(event_id) && event_id !== "0"){      
            (async function getEventsData(){
                let users = await callApi({url: `events/${event_id}/users`});
                if(users){
                    setUsersList({data: users});
                    setUserSelectable(true);
                }
            })();
            setDisable(true);
        } else {
            setDisable(false);
        }
            
    }, [event_id])

    React.useEffect(() => {
        if(!accessLevel()){
            console.log('No access');
        } else {
            let access = accessLevel()
            if(access === 'director' || access === 'director'){
                setEditable(true);
            } else {
                setEditable(false);
            }
        }
    },[user])

    return (      
        <IonPage>        
            <Title name={event_id ? 'View/Edit Event' : 'Create Event'} back="/events" />

            <IonContent className="dark">
                <EventForm disable={disable} setSendEmail={setSendEmail} setEventData={setEventData} getEventUsers={getEventUsers} eventId={event_id} />
                <IonCard className={userSelectable ? 'dark': 'hidden dark'}>
                    <IonCardHeader>
                        <IonCardTitle>
                            {/* Component to Display the Filter View on the User Selection View */}
                            {!disable && !event_id ? (
                                <>
                                    <UserDataFilter filterUserList={filterUserList} eventData={eventData} />
                                    <p>Select Users to Invite to Event</p>
                                </> 
                            ) : (
                                <span>Mark Attendees for the {eventData.name}</span>
                            )}
                            {event_id? (
                                <IonRow>
                                    <IonCol className="ion-text-center" size="4">
                                        <IonItem>
                                            <IonLabel position="stacked">Invited Users</IonLabel>
                                            <IonText><h2>{usersList !== null ? usersList.data.length: ''}</h2></IonText>
                                        </IonItem>
                                    </IonCol>
                                    <IonCol className="ion-text-center" size="4">
                                        <IonItem>
                                            <IonLabel position="stacked">RSVPed Users</IonLabel>
                                            <IonText><h2>{usersList !== null ? usersList.data.filter(user => user.rvsp === 'going').length: ''}</h2></IonText>
                                        </IonItem>
                                    </IonCol>
                                    <IonCol className="ion-text-center" size="4">
                                        <IonItem>
                                            <IonLabel position="stacked">Present Users</IonLabel>
                                            <IonText><h2>{(usersList !== null ? usersList.data.filter(user => user.present === 1).length + selectedUsers.length: '')}</h2></IonText>
                                        </IonItem>
                                    </IonCol>
                                    <IonCol size="12">
                                        {!disable ? (
                                            <>
                                                <IonItem>
                                                    <IonLabel position="stacked">Invite User(s)</IonLabel>
                                                    <IonInput type="email" placeholder="Invite Users by Email"></IonInput>                      
                                                </IonItem>
                                                <IonButton>Invite</IonButton>
                                            </>
                                        ): null}
                                    </IonCol>
                                </IonRow>                  
                            ):null}
                        </IonCardTitle>
                    </IonCardHeader>                              
                    <IonCardContent>
                        {usersList !== null ? (
                            <>
                                <IonList>
                                    {usersList.total? (
                                        <Paginator data={usersList} pageHandler={moveToPage} />
                                    ): null}
                                    {/*<IonListHeader>                    
                                        <IonInput className="search" name="search_user_name" placeholder="Search User..." onIonChange={filterUser}></IonInput>
                                    </IonListHeader> */}

                                    <EventUserList usersList={usersList} eventId={event_id} disable={disable}
                                        editable={editable} setShowPopover = {setShowPopover} city_id={eventData.city_id}
                                        selectAllUsers = {selectAllUsers} setInvitees = {setSelectedUsers} />
                                </IonList>
                                {usersList.total? (
                                    <Paginator data={usersList} pageHandler={moveToPage} />
                                ): null}
                            </>
                        ) : (<IonLabel>No Users in the selected filter.</IonLabel>)}
                    </IonCardContent>
                </IonCard>
            </IonContent>
        
            {/* If Event ID exists, i.e for Viewing existing events, show an enable/disable edit Button  */}
            { event_id ? (
                <>
                    <IonFab vertical="bottom" horizontal="end" slot="fixed">
                        <IonFabButton disabled={!editable} onClick={openEdit}><IonIcon icon={pencil}/></IonFabButton>
                    </IonFab>
                    <IonFab vertical="bottom" horizontal="end" slot="fixed" className={ disable ? "hidden": "" }>
                        <IonFabButton disabled={!editable} onClick={closeEdit}> <IonIcon icon={close}/></IonFabButton>
                    </IonFab>   
                </>
            ) : null }

            <IonModal isOpen={showPopover} mode="md" onWillDismiss={() => setShowPopover(false)}>
                <IonHeader>
                    <IonToolbar>Confirm Event Details.</IonToolbar>            
                </IonHeader>
                <IonContent className="dark">
                    <IonItem>
                        <IonText>
                            <hr/>
                            <p>Name: <strong>{eventData.name}</strong></p>
                            <p>Event Type:<strong></strong></p>
                            <p>Starts On: <strong>{eventData.starts_on}</strong></p>
                            <p>Place/Zoom ID: <strong>{eventData.place}</strong></p>
                            <p>Users Invited: <strong>{selectedUsers.length}</strong></p>
                            {eventData.frequency !== 'none' ? (
                                <>
                                    <p>Event Frequency: <strong>{eventData.frequency}</strong></p>
                                    <p>Repeats Until: <strong>{eventData.repeat_until}</strong></p>
                                </>
                            ): null}
                            {/* Shows list of all selected/invited volunteers. <ul>
                            {usersList !== null && usersList.data.filter(user => selectedUsers.indexOf(user.id) >= 0).map(user => {
                                return (<li key={user.id}>{user.name}</li>)
                            })}
                            </ul> */}
                        </IonText>
                    </IonItem>
                    <IonButton color="primary" onClick={submitForm} size="default" expand="full">Confirm</IonButton>
                </IonContent>                    
            </IonModal>
        </IonPage>      
    );
};

// Component to Show Users List
const EventUserList = React.memo( function UserList(props) {
    // usersList = props.usersList;
    const [ checkAll, setCheckAll ] = React.useState(false);
    const [ selectedUsers, setSelectedUsers ] = React.useState([]);
    const { callApi } = React.useContext(dataContext);
    const [ searchText, setSearchText ] = React.useState('');
  
    const toggleCheckAll = async (e) => {
        if(e.target.checked) {
            setCheckAll(true)
            let inviteUsers = await props.selectAllUsers()
            setSelectedUsers(inviteUsers)
        } else {
            setCheckAll(false);
        }
    }

    let inviteUser = (e) => {
        let invitee_id = e.target.value;
        let invitees = selectedUsers;            
        if(e.target.checked) {
            if(invitees.indexOf(invitee_id) < 0) {
                invitees.push(invitee_id);
            }
        } else {
            if(invitees.indexOf(invitee_id) >= 0) {
                invitees.splice(invitees.indexOf(invitee_id),1);
            }
        }
        setSelectedUsers(invitees);
    }

    const markAttendance = async () => {
        console.log(selectedUsers);
        let response = await callApi({
            url: `events/${props.eventId}/attended`,
            method: 'post',
            params: {
                attendee_user_ids: selectedUsers.join(',')
            }
        })

        console.log(response);
        if(response){
            console.log('Attendance Marked');
            props.setInvitees(selectedUsers);
        }
    }

    const confirmEvent = async() => {
        props.setInvitees(selectedUsers);  
        props.setShowPopover(true);
    }

    return (
        <>
            {props.editable? (
                <>
                    <IonItem>          
                        <IonCheckbox name="check_all" onIonChange={toggleCheckAll} value={checkAll} />&nbsp;
                        <IonLabel>Select All Users [{props.usersList.total ? props.usersList.total : props.usersList.data.length}]</IonLabel>                      
                    </IonItem>
                    {props.disable? (
                        <IonButton disabled={!props.editable} color="primary" size="default" onClick={markAttendance}>Mark Attendance</IonButton>      
                    ): (
                        <>
                            <IonSearchbar animated="true" mode="md" inputmode="text" onIonChange={e => setSearchText(e.target.value)} placeholder="Search users in this page."></IonSearchbar>
                            <IonButton disabled={!props.editable} color="primary" size="default" onClick={confirmEvent}>Invite Users</IonButton>
                        </>
                    )}
                </>
            ):null}

            {props.usersList.data.filter(user => (searchText.length && user.name.indexOf(searchText) >= 0) || (!searchText.length)).map((user,index) => {
                return (
                    <IonItem key={index}>
                        {!props.disable && !props.eventId? (
                            <IonAvatar slot="start">                          
                                <IonCheckbox name="user_id" value={user.id} checked={(checkAll || (selectedUsers.indexOf(user.id.toString()) >= 0))? true: false} onIonChange={inviteUser}></IonCheckbox>                                                                         
                            </IonAvatar>
                        ): null}
                        <IonLabel>
                            <h2>{user.name}{props.city_id == 0? ', '+(CITY_COORDINATES[user.city_id].name): null}</h2>
                            <h3 className="no-padding">{user.mad_email ? user.mad_email : user.email} {user.phone ? '| ' + user.phone: ''}</h3>
                            <p>
                                {
                                    user.groups && user.groups.map((group,index) => {
                                        return (
                                            <span key={index}>{group.name}{(index < user.groups.length - 1) ? ', ': null}</span>
                                        )
                                    })
                                }
                            </p>
                        </IonLabel>
                        {props.eventId && props.disable && user.rsvp? (
                            <span>RSVP: <IonIcon icon={user.rsvp === 'going' || user.rsvp === 'maybe' ? checkmarkCircle: (user.rsvp === 'cant_go' ? closeCircle: ellipse)} 
                                className={user.rsvp}></IonIcon></span>
                        ):null}
                        {props.editable && props.eventId && props.disable? (
                            <IonCheckbox slot="end" mode="md" 
                                value={user.id} checked={( user.present || checkAll || (selectedUsers.indexOf(user.id.toString()) >= 0))? true: false} 
                                onIonChange={inviteUser}></IonCheckbox>
                        ): null}
                    </IonItem>
                )
            })}
        </>
    )
})

// Component to Capture Event Form Data 
const EventForm = React.memo((props) => {
    let disable = props.disable;
  
    const { user } = React.useContext(authContext);
    const [ cities, setCities ] = React.useState({})
    const [ eventTypes, setEventTypes ] = React.useState({})
    const [ verticals, setVerticals ] = React.useState({})
    const [ setIsRecurring ] = React.useState(false);
    const { callApi } = React.useContext(dataContext)

    const [ eventData, setEventData ] = React.useState({
        // name: '',
        // description: '',
        // starts_on: '',
        // place: '',
        // city_id: user.city_id,
        // event_type_id: 0,
        // vertical_id: 0,
        // audience: "",
        // role: "",
        // created_by_user_id: user.id,
        // latitude: 0,
        // longitude: 0,
        // frequency: 'none',
        // repeat_until: null

        name: 'ED Vol Meet Test Event',
        description: 'This is a test event',
        starts_on: '2020-09-30T15:00:00+05:30',
        place: 'Zoom',
        city_id: user.city_id,
        event_type_id: "11",
        vertical_id: 3,
        audience: "city",
        role: "volunteer",
        created_by_user_id: user.id,
        latitude: 0,
        longitude: 0,
        frequency: 'none',
        repeat_until: null
    });
    
    const [ userFilterParameter, setUserFilterParameter ] = React.useState({
        city_id: user.city_id
    })

    const [ errorMessage, setErrorMessage ] = React.useState('');

    const updateField = e => {    
        if(e.target.name === 'starts_on'){
            setEventData({
                ...eventData,
                starts_on: e.target.value.replace('T',' ').replace('+05:30','')
            }
            );
        }
        else if(e.target.name === 'repeat_unil'){
            setEventData({
                ...eventData,
                repeat_until: e.target.value.split('T')[0]
            });
        }
        else{
            setEventData({
                ...eventData,
                [e.target.name]: e.target.value
            });
        }

        if(e.target.name === 'city_id'){
            if(e.target.value != 0){
                setUserFilterParameter({...userFilterParameter, city_id: e.target.value});
            } else {
                // If City is National, remove City Filter from the User Filter Parameters 
                let tempFilter = userFilterParameter;
                delete tempFilter.city_id;
                setUserFilterParameter({...tempFilter});
            }
        }
        // else if(e.target.name === 'event_type_id'){
        //     let selectedType = eventTypes.filter(type => type.id == e.target.value);
        //     if(selectedType[0] && selectedType[0].vertical_id){
        //         // setSelectedVertical(selectedType[0].vertical_id);
        //         // setUserFilterParameter({...userFilterParameter, vertical_id: selectedType[0].vertical_id});
        //     }
        // }
        else if(e.target.name === 'frequency'){
            if(e.target.value !== 'none'){
                setIsRecurring(true);
            }
            else{
                setIsRecurring(false);
            }
        }
    }
  
    let createEvent = async (e) => {
        e.preventDefault();    
        if(!eventData.event_type_id){
            setErrorMessage('Select Event Type');        
        } else{
            setErrorMessage(null);
            props.setEventData(eventData);      
            props.getEventUsers(userFilterParameter);      
        }      
    }
  
    React.useEffect(() => {
        function getApiData() {
            callApi({graphql: "{event_types {id name audience role vertical_id}}", cache_key: "event_types", setter: setEventTypes})
            callApi({url: "verticals", cache_key: "verticals", setter: setVerticals})
            callApi({url: 'cities', cache_key: "cities", setter: setCities});
        }
        getApiData()
    }, [])

    React.useEffect(() => {
        let eventId = props.eventId;
        if(eventId !== undefined && !isNaN(eventId) && eventId !== "0"){
            (async function getEventsGraphQL(){
                let event = await callApi({url: `events/${eventId}`});          
                if(event){                  
                    setEventData({...event});
                    props.setEventData({...event});
                }          
            })();      
        }    
    }, [props.eventId])
    
    let setSendEmail = props.setSendEmail;

    return (
        <IonCard className="light eventForm">
            <IonCardHeader>
                <IonCardTitle>
                    <IonIcon icon={calendar}></IonIcon> { !disable ? 'Add/Edit Event Details' : eventData.name }
                </IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
                <IonGrid>
                    <IonRow>
                        <IonCol size-md="6" size-xs="12">
                            {/* Form to capture event details and/or show once the user opens an event  */}
                            <form onSubmit={createEvent}>
                                <IonItem>
                                    <IonLabel position="stacked">Target Audience</IonLabel>
                                    <IonSelect disabled={disable} mode="md" placeholder="Select Audience" required interface="popover" name="audience" 
                                        value={eventData.audience} onIonChange={updateField}>
                                        <IonSelectOption value="city">City</IonSelectOption>
                                        <IonSelectOption value="center">Shelter</IonSelectOption>
                                        <IonSelectOption value="vertical">Vertical</IonSelectOption>
                                        <IonSelectOption value="">All</IonSelectOption>
                                    </IonSelect>
                                </IonItem>

                                <IonItem>
                                    <IonLabel position="stacked">Target Roles</IonLabel>
                                    <IonSelect disabled={disable} mode="md" placeholder="Select Role" required interface="popover" name="role" 
                                        value={eventData.role} onIonChange={updateField}>
                                        <IonSelectOption value="national">Full Timers</IonSelectOption>
                                        <IonSelectOption value="strat">Strats or Above</IonSelectOption>
                                        <IonSelectOption value="fellow">Fellows or Above</IonSelectOption>
                                        <IonSelectOption value="volunteer">Volunteers Or Above</IonSelectOption>
                                        <IonSelectOption value="">Any</IonSelectOption>
                                    </IonSelect>
                                </IonItem>

                                <IonItem>
                                    <IonLabel position="stacked">Event Vertical</IonLabel>
                                    <IonSelect disabled={disable} mode="md" placeholder="Select Event Vertical" required interface="popover"
                                        name="vertical_id" value={eventData.vertical_id} onIonChange={updateField}>
                                        { verticals.length && verticals.map((vertical,index) => {
                                            return (<IonSelectOption key={index} value={vertical.id}>{vertical.name}</IonSelectOption>)
                                        })}
                                        <IonSelectOption value="0">All</IonSelectOption>
                                    </IonSelect>
                                </IonItem>

                                <IonItem>
                                    <IonLabel position="stacked">Event Type</IonLabel>
                                    <IonSelect disabled={disable} mode="md" placeholder="Select Event Type" required interface="popover" name="event_type_id" 
                                        value={eventData.event_type_id} onIonChange={updateField}>
                                        { eventTypes.length && eventTypes.map((eventType,index) => {
                                            // Filter the Event Type Drop down based on previous options.
                                            if(eventData.role !== "" && eventType.role != eventData.role) return null
                                            if(eventData.audience !== "" && eventType.audience != eventData.audience) return null
                                            if(eventData.vertical_id != 0 && eventType.vertical_id != eventData.vertical_id) return null

                                            return (<IonSelectOption key={index} value={eventType.id}>{eventType.name}</IonSelectOption>)
                                        })}
                                    </IonSelect>
                                </IonItem>
                                <IonItem>
                                    <IonLabel position="stacked">Event Name</IonLabel>
                                    <IonInput name="name" type="text" required onIonChange={updateField} placeholder="Enter Event Name" 
                                        value={eventData.name} disabled={disable}></IonInput>
                                </IonItem>
                                <IonItem>
                                    <IonLabel position="stacked">Description</IonLabel>
                                    <IonTextarea name="description" type="text" onIonChange={updateField} placeholder="What is the event for?" 
                                        value={eventData.description} disabled={disable}></IonTextarea>
                                </IonItem>
                                <IonItem>
                                    <IonLabel position="stacked">Date &amp; Time </IonLabel>
                                    <IonDatetime displayFormat="D MMM YYYY h:mm A" mode="md" min="2020" value={eventData.starts_on} name="starts_on" 
                                        required placeholder="Enter Event Date" onIonChange={updateField} disabled={disable} minuteValues="0,15,30,45"></IonDatetime>
                                </IonItem>                      
                                <IonItem>
                                    <IonLabel position="stacked">Event is happening at</IonLabel>
                                    <IonInput name="place" type="text" onIonChange={updateField} placeholder="Zoom Call ID/Location Name" 
                                        value={eventData.place} disabled={disable}></IonInput>
                                </IonItem>                
                                <IonItem className={disable? 'hidden': ''}>
                                    <IonCheckbox  mode="md" name="send_email" color="danger" onIonChange={e => setSendEmail(e.target.checked)}/> &nbsp;
                                    <IonLabel color="light">Send Invitation by Email</IonLabel>                      
                                </IonItem>                                         
                                <IonItem>
                                    <IonLabel position="stacked">Event City</IonLabel>                        
                                    <IonSelect disabled={disable} mode="md" placeholder="Select City" required interface="popover" name="city_id" 
                                        value={eventData.city_id ? eventData.city_id: user.city_id} onIonChange={updateField}>
                                        <IonSelectOption value='0'>National</IonSelectOption>
                                        {cities.length && cities.map((city,index) => {
                                            return (<IonSelectOption key={index} value={city.id}>{city.name}</IonSelectOption>)
                                        })}
                                    </IonSelect>                        
                                </IonItem>                      
                
                                <IonItem>
                                    <IonLabel position="stacked">Recurring Frequency</IonLabel>
                                </IonItem>
                                <div className="pl-20">
                                    <IonChip color="primary" className={eventData.frequency === 'none' ? 'selected': ''} value="none" name="frequency" onClick={updateField}>None</IonChip>
                                    <IonChip color="primary" className={eventData.frequency === 'weekly' ? 'selected': ''} value="weekly" name="frequency" onClick={updateField}>Weekly</IonChip>
                                    <IonChip color="primary" className={eventData.frequency === 'bi-weekly' ? 'selected': ''} value="bi-weekly" name="frequency" onClick={updateField}>Bi-Weekly</IonChip>
                                    <IonChip color="primary" className={eventData.frequency === 'monthly' ? 'selected': ''} value="monthly" name="frequency" onClick={updateField}>Monthly</IonChip>
                                </div>

                                {eventData.frequency != 'none' ? (
                                    <>
                                        <IonItem>
                                            <IonLabel position="stacked">Repeat Event Until</IonLabel>
                                            <IonDatetime displayFormat="MMM YYYY" mode="md"
                                                value={eventData.repeat_until} 
                                                name="repeat_until" 
                                                placeholder="Date Until white the event needs to be repeated"
                                                onIonChange={updateField}
                                                disabled={disable}>
                                            </IonDatetime>
                                        </IonItem>
                                        <IonNote className="eventNote">*Note: If left blank, even will be repeated until 30 April, or end of academic year.</IonNote>
                                    </>
                                ): null}

                                {errorMessage? (
                                    <IonLabel color="danger">{errorMessage}</IonLabel>
                                ):null}

                                {!disable ? (
                                    <IonItem>
                                        <IonButton type="submit" size="default">Create Event &amp; Invite Users</IonButton>
                                    </IonItem>   
                                ): null}                      
                            </form>
                        </IonCol>
                        {/* MAP Is currently disabled, uncomment the code to enable the MAP  */}
                        {/* <IonCol size-md="6" size-xs="12">
                            <MapContainer
                                googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_TOKEN}&v=3.exp&libraries=geometry,drawing,places`}
                                loadingElement={<div style={{ height: `100%` }} />}
                                containerElement={<div style={{ paddingTop: `40px`, height: `400px` }} />}
                                mapElement={<div style={{height: `100%` }} />}
                                coordinates={CITY_COORDINATES[user.city_id]}
                                locationUpdate={getUpdatedLocation}
                                isMarkerShown
                            />
                            </IonCol> */}
                    </IonRow>
                </IonGrid>                             
            </IonCardContent>
        </IonCard>
    )
})

const UserDataFilter = React.memo((props) => {
    const [ verticals, setVerticals ] = React.useState({})
    const [ groupTypes, setGroupTypes ] = React.useState({});

    const [ selectedGroups, setSelectedGroups ] = React.useState(0)
    const [ selectedCities, setSelectedCities ] = React.useState(0)
    const [ selectedGroupType, setSelectedGroupType ] = React.useState(0);
    const [ shelters, setShelters ] = React.useState({})
    const [ cities, setCities ] = React.useState({})
    const [ userGroups, setUserGroups ] = React.useState({})
    const [ city_id, setCityId ] = React.useState(props.city_id)
    const { callApi} = React.useContext(dataContext)
    const { user } = React.useContext(authContext)

    const [ filters, setFilters ] = React.useState({})
    const [ userGroupFilterParameter, setUserGroupFilterParameter ] = React.useState({})

    React.useEffect(() => {
        (function fetchData(){
            callApi({url: "verticals", cache_key: "verticals", setter: setVerticals})
            callApi({url: "groups", cache_key: "groups", setter: setUserGroups})
            callApi({url: "group_types", cache_key: "group_types", setter: setGroupTypes})
            callApi({url: 'cities', cache_key: "cities", setter: setCities});
        })();

        if(!city_id) {
            setCityId(user.city_id)
        }
    },[])

    const filterUser = async (e) => {
        let tempFilter = filters;
        if(e.target.name === 'group_id'){
            let selectedValues = e.target.value;
            if(selectedValues.length > 0){
                setSelectedGroups(e.target.value);
                tempFilter = {...tempFilter, groups_in: e.target.value.join(',')}
            }

        } else if(e.target.name === 'city_in'){
            let city_ids = e.target.value;
            if(city_ids.indexOf(0) >= 0){
                city_ids.splice(city_ids.indexOf(0),1);
            }
            setSelectedCities(e.target.value);
            tempFilter = {...tempFilter, city_in: e.target.value.join(',')}

        } else {
            tempFilter = {...filters, [e.target.name]: e.target.value};
        }    

        setFilters(tempFilter);
        props.filterUserList(tempFilter);
    }

    const filterUserGroups = async(e) => {
        let selectedValues = e.target.value;    
        if(selectedValues && selectedValues.length){
            setSelectedGroupType(e.target.value);      
            let filteredGroups = userGroups.filter(group => (e.target.value.indexOf(group.type) >= 0))
            let filteredGroupIds = [];
            filteredGroups.forEach(group => {
                filteredGroupIds.push(group.id);
            });
            setSelectedGroups(filteredGroupIds);            
        }
        else{      
            if(!selectedGroupType && !selectedGroups){
                setSelectedGroups(0);
                setSelectedGroupType(0);
            }
        }
    }

    const clearFilter = async () => {
        let filterParameters = filters;
        let groupFilterParameter = userGroupFilterParameter;

        if(filterParameters.vertical_id) delete filterParameters.vertical_id;
        if(filterParameters.group_in) delete filterParameters.group_in;
        if(filterParameters.center_id) delete filterParameters.center_id;

        if(groupFilterParameter.vertical_id) delete groupFilterParameter.vertical_id;
        if(groupFilterParameter.type_in) delete groupFilterParameter.type_in;

        setFilters(filterParameters);
        setUserGroupFilterParameter(groupFilterParameter);
        console.log(filterParameters);
        props.filterUserList(filterParameters);
    }

    React.useEffect(() => {
        if(!city_id) return;
        (function fetchShelters() {
            callApi({graphql: `{centers(city_id:${city_id}) {id name}}`, cache_key: `cities_${city_id}_centers`, setter: setShelters })
        })()
    } ,[city_id])

    return (
        <>
            <IonRow>
                <IonCol size="12">Select one or more of the filters to filter Volunteer&apos;s List.</IonCol>
                {cities.length ? (
                    <IonCol size-xs="12" size-md='3'>
                        <IonItem>
                            <IonSelect mode="md" placeholder="Shelter Cities" interface="alert" name="city_in" multiple value={selectedCities} onIonChange={filterUser}>
                                {cities.map((city, index) => {
                                    return (<IonSelectOption key={index} value={city.id}>{city.name}</IonSelectOption>)
                                })}
                            </IonSelect>
                        </IonItem>
                    </IonCol>
                ) : null }

                {!cities.length && shelters.length? (
                    <IonCol size-xs="12" size-md="3">        
                        <IonItem>          
                            <IonSelect mode="md" placeholder="Select Shelter" interface="popover" name="center_id" value={filters.center_id} onIonChange={filterUser}>
                                {shelters.map((shelter,index) => {
                                    return (<IonSelectOption key={index} value={shelter.id}>{shelter.name}</IonSelectOption>)
                                })}
                            </IonSelect>          
                        </IonItem>        
                    </IonCol>
                ) : null }

                {verticals.length? (
                    <IonCol size-xs="12" size-md="3">
                        <IonItem>          
                            <IonSelect mode="md" placeholder="Select Verical" interface="popover" name="vertical_id" value={filters.vertical_id} onIonChange={filterUser}>
                                { verticals.map((vertical,index) => {
                                    return (<IonSelectOption key={index} value={vertical.id}>{vertical.name}</IonSelectOption>)
                                })}
                            </IonSelect>          
                        </IonItem>
                    </IonCol>
                ) : null }

                {groupTypes.length? (
                    <IonCol size-xs="12" size-md="3">
                        <IonItem>                              
                            <IonSelect mode="md" placeholder="Select Role Type(s)" interface="alert" name="group_types" value={selectedGroupType}  onIonChange={filterUserGroups} multiple>
                                { groupTypes.filter(groupType => groupType.type !== 'executive').map((groupType,index) => {
                                    return (<IonSelectOption key={index} value={groupType.type}>{ groupType.type }</IonSelectOption>)
                                })}
                            </IonSelect>            
                        </IonItem>
                    </IonCol>
                ) : null }

                {userGroups.length? (
                    <IonCol size-xs="12" size-md="3">
                        <IonItem>          
                            <IonSelect mode="md" placeholder="Select Role(s)" interface="alert" name="group_id" value={selectedGroups} onIonChange={filterUser} multiple>
                                {userGroups.filter(group => (filters.vertical_id && (group.vertical_id === filters.vertical_id)) || (!filters.vertical_id))
                                    .filter(group => (selectedGroupType && selectedGroupType.indexOf(group.type)>=0) || (!selectedGroupType))
                                    .map((group,index) => {
                                        return (<IonSelectOption key={index} value={group.id}>{group.name}</IonSelectOption>)
                                    })}
                            </IonSelect>          
                        </IonItem>
                    </IonCol>
                ) : null }
            </IonRow>                  
            <IonItem>
                <IonButton size="small" color="danger" onClick={clearFilter}>Clear Filter(s)</IonButton>
            </IonItem>
        </>
    )

});

export default EventCreate;