import {
  IonPage,
  IonLabel,
  IonContent,
  IonInput,
  IonAvatar,
  IonFab,
  IonFabButton,
  IonIcon,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardContent,
  IonItem,
  IonTextarea,
  IonCardHeader,
  IonCardTitle,
  IonSelect,
  IonSelectOption,
  IonButton,
  IonList,
  IonCheckbox,
  IonHeader,
  IonDatetime,
  IonModal,
  IonText,
  IonNote,
  IonChip,
  IonToolbar,
  IonSearchbar
} from '@ionic/react'
import {
  calendar,
  pencil,
  close,
  checkmarkCircle,
  closeCircle,
  ellipse
} from 'ionicons/icons'
import React from 'react'
import { useParams, useHistory } from 'react-router-dom'
import moment from 'moment'

import Title from '../../components/Title'
import Paginator from '../../components/Paginator'
import './Event.css'
import { authContext } from '../../contexts/AuthContext'
import { dataContext } from '../../contexts/DataContext'
import { appContext } from '../../contexts/AppContext'

const EventCreate = () => {
  const { eventId: eventId } = useParams()
  const { user, accessLevel } = React.useContext(authContext)
  const [sendEmail, setSendEmail] = React.useState(true)
  const [usersList, setUsersList] = React.useState(null)
  const [editable, setEditable] = React.useState(false)

  const [userSelectable, setUserSelectable] = React.useState(false)
  const { getUsers, callApi } = React.useContext(dataContext)

  const [selectedUsers, setSelectedUsers] = React.useState([])
  const [userFilterParameter, setUserFilterParameter] = React.useState({
    city_id: user.city_id
  })
  const [disable, setDisable] = React.useState(false)
  const [showPopover, setShowPopover] = React.useState(false)
  const [eventData, setEventData] = React.useState({})

  const refUserList = React.useRef(null)

  let history = useHistory()

  const openEdit = () => {
    setDisable(false)
  }

  const closeEdit = () => {
    setDisable(true)
  }

  const getEventUsers = async (params) => {
    setUserFilterParameter({ ...userFilterParameter, ...params })
    let users = await getUsers(params)
    if (users) {
      setUsersList(users)
      setUserSelectable(true)

      // Scroll to the next area...
      window.setTimeout(() => {
        refUserList.current.scrollIntoView()
      }, 300)
    }
  }

  const filterUserList = (params) => {
    let api_params = { ...params } // We do this to make sure its a copy - and not a reference. By default JS makes an reference of an object
    if (params.city_in.length <= 1 && params.city_id) {
      delete api_params.city_in
    } else if (params.city_in.length > 1) {
      delete api_params.city_id
      api_params.city_in = params.city_in.join(',')
    }

    if (params.role) {
      // Role is an alias for group_type in the API
      api_params.group_type = params.role
      delete api_params.role
    }

    setUserFilterParameter(params)
    let query_parts = []
    for (let par in api_params) {
      let val = api_params[par]
      if (val.toString() === '0') continue

      if (Array.isArray(val)) val = val.join(',')
      query_parts.push(`${par}=${val}`)
    }
    callApi({
      url: `/users_paginated?${query_parts.join('&')}`,
      cache: true,
      setter: setUsersList
    })
  }

  let moveToPage = async (toPage) => {
    console.log(toPage)
    let filters = { ...userFilterParameter, page: toPage }
    setUserFilterParameter(filters)
    let users = await getUsers(filters)
    setUsersList(users)
    setUserSelectable(true)
  }

  let selectAllUsers = async () => {
    let selectUserList = []
    let currentPage = 0
    let usersListTemp = usersList
    do {
      usersListTemp.data.forEach((user) => {
        selectUserList.push(user.id)
      })
      currentPage = usersListTemp.current_page
      if (usersList.last_page !== 1) {
        usersListTemp = await getUsers({
          ...userFilterParameter,
          page: currentPage + 1
        })
      }
    } while (currentPage !== usersList.last_page)

    return selectUserList
  }

  let submitForm = async () => {
    if (eventId) {
      console.log(selectedUsers)
      return true
    }

    let event = eventData
    let response = await callApi({
      url: 'events',
      params: event,
      method: 'post'
    })

    if (response) {
      let eventId = response.id
      let email = sendEmail ? 1 : 0

      let sendInvites = await callApi({
        url: `events/${eventId}/users`,
        method: `post`,
        params: {
          invite_user_ids: selectedUsers.join(','),
          send_invite_emails: email
        }
      })

      let recurring = false

      if (event.frequency !== 'none') {
        recurring = await callApi({
          url: `events/${eventId}/recur`,
          method: 'post',
          params: {
            frequency: event.frequency,
            repeat_until: event.repeat_until
          }
        })
      } else {
        recurring = true
      }

      if (sendInvites && recurring) {
        setShowPopover(false)
        history.push(`/events/${eventId}`)
      }
    }
  }

  React.useEffect(() => {
    if (eventId !== undefined && !isNaN(eventId) && eventId !== '0') {
      ;(async function getEventsData() {
        let users = await callApi({
          url: `events/${eventId}/users`,
          cache_key: `events_${eventId}_users`
        })
        if (users) {
          setUsersList({ data: users })
          setUserSelectable(true)
        }
      })()
      setDisable(true)
    } else {
      setDisable(false)
    }
  }, [eventId])

  React.useEffect(() => {
    if (!accessLevel()) {
      console.log('No access')
    } else {
      let access = accessLevel()
      if (access === 'executive' || access === 'director') {
        setEditable(true)
      } else {
        setEditable(false)
      }
    }
  }, [user])

  return (
    <IonPage>
      <Title
        name={eventId ? 'View/Edit Event' : 'Create Event'}
        back="/events"
      />

      <IonContent className="dark">
        <EventForm
          disable={disable}
          setSendEmail={setSendEmail}
          setEventData={setEventData}
          getEventUsers={getEventUsers}
          eventId={eventId}
        />
        <IonCard
          className={userSelectable ? 'dark' : 'hidden dark'}
          ref={refUserList}
        >
          <IonCardHeader>
            <IonCardTitle>
              {/* Component to Display the Filter View on the User Selection View */}
              {!disable && !eventId ? (
                <>
                  <UserDataFilter
                    filterUserList={filterUserList}
                    eventData={eventData}
                    eventId={eventId}
                  />
                  <p>Select Users to Invite to Event</p>
                </>
              ) : (
                <span>Mark Attendees for the {eventData.name}</span>
              )}
              {eventId ? (
                <IonRow>
                  <IonCol className="ion-text-center" size="4">
                    <IonItem>
                      <IonLabel position="stacked">Invited Users</IonLabel>
                      <IonText>
                        <h2>
                          {usersList !== null ? usersList.data.length : ''}
                        </h2>
                      </IonText>
                    </IonItem>
                  </IonCol>
                  <IonCol className="ion-text-center" size="4">
                    <IonItem>
                      <IonLabel position="stacked">RSVPed Users</IonLabel>
                      <IonText>
                        <h2>
                          {usersList !== null
                            ? usersList.data.filter(
                                (user) => user.rvsp === 'going'
                              ).length
                            : ''}
                        </h2>
                      </IonText>
                    </IonItem>
                  </IonCol>
                  <IonCol className="ion-text-center" size="4">
                    <IonItem>
                      <IonLabel position="stacked">Present Users</IonLabel>
                      <IonText>
                        <h2>
                          {usersList !== null
                            ? usersList.data.filter(
                                (user) => user.present === 1
                              ).length + selectedUsers.length
                            : ''}
                        </h2>
                      </IonText>
                    </IonItem>
                  </IonCol>
                  <IonCol size="12">
                    {!disable ? (
                      <>
                        <IonItem>
                          <IonLabel position="stacked">Invite User(s)</IonLabel>
                          <IonInput
                            type="email"
                            placeholder="Invite Users by Email"
                          ></IonInput>
                        </IonItem>
                        <IonButton>Invite</IonButton>
                      </>
                    ) : null}
                  </IonCol>
                </IonRow>
              ) : null}
            </IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            {usersList !== null ? (
              <>
                <IonList>
                  {usersList.total ? (
                    <Paginator data={usersList} pageHandler={moveToPage} />
                  ) : null}
                  {/*<IonListHeader>                    
                                        <IonInput className="search" name="search_user_name" placeholder="Search User..." onIonChange={filterUser}></IonInput>
                                    </IonListHeader> */}

                  <EventUserList
                    usersList={usersList}
                    eventId={eventId}
                    disable={disable}
                    editable={editable}
                    setShowPopover={setShowPopover}
                    city_id={eventData.city_id}
                    selectAllUsers={selectAllUsers}
                    setInvitees={setSelectedUsers}
                  />
                </IonList>
                {usersList.total ? (
                  <Paginator data={usersList} pageHandler={moveToPage} />
                ) : null}
              </>
            ) : (
              <IonLabel>No Users in the selected filter.</IonLabel>
            )}
          </IonCardContent>
        </IonCard>
      </IonContent>

      {/* If Event ID exists, i.e for Viewing existing events, show an enable/disable edit Button  */}
      {eventId ? (
        <>
          <IonFab vertical="bottom" horizontal="start" slot="fixed">
            <IonFabButton disabled={!editable} onClick={openEdit}>
              <IonIcon icon={pencil} />
            </IonFabButton>
          </IonFab>
          <IonFab
            vertical="bottom"
            horizontal="start"
            slot="fixed"
            className={disable ? 'hidden' : ''}
          >
            <IonFabButton disabled={!editable} onClick={closeEdit}>
              {' '}
              <IonIcon icon={close} />
            </IonFabButton>
          </IonFab>
        </>
      ) : null}

      <IonModal
        isOpen={showPopover}
        mode="md"
        onWillDismiss={() => setShowPopover(false)}
      >
        <IonHeader>
          <IonToolbar>Confirm Event Details.</IonToolbar>
        </IonHeader>
        <IonContent className="dark">
          <IonItem>
            <IonText>
              <hr />
              <p>
                Name: <strong>{eventData.name}</strong>
              </p>
              <p>
                Starts On: <strong>{eventData.starts_on}</strong>
              </p>
              <p>
                Place/Zoom ID: <strong>{eventData.place}</strong>
              </p>
              <p>
                Users Invited: <strong>{selectedUsers.length}</strong>
              </p>
              {eventData.frequency !== 'none' ? (
                <>
                  <p>
                    Event Frequency: <strong>{eventData.frequency}</strong>
                  </p>
                  <p>
                    Repeats Until: <strong>{eventData.repeat_until}</strong>
                  </p>
                </>
              ) : null}
              {/* Shows list of all selected/invited volunteers. <ul>
                            {usersList !== null && usersList.data.filter(user => selectedUsers.indexOf(user.id) >= 0).map(user => {
                                return (<li key={user.id}>{user.name}</li>)
                            })}
                            </ul> */}
            </IonText>
          </IonItem>
          <IonButton
            color="primary"
            onClick={submitForm}
            size="default"
            expand="full"
          >
            Confirm
          </IonButton>
        </IonContent>
      </IonModal>
    </IonPage>
  )
}

// Component to Show Users List
const EventUserList = React.memo(function UserList(props) {
  const [checkAll, setCheckAll] = React.useState(false)
  const [selectedUsers, setSelectedUsers] = React.useState([])
  const { callApi, unsetLocalCache } = React.useContext(dataContext)
  const [searchText, setSearchText] = React.useState('')

  // Make sure all the invited people are checked
  React.useEffect(() => {
    let invitees = []
    for (let i in props.usersList.data) {
      if (props.usersList.data[i].present) {
        invitees.push(props.usersList.data[i].id.toString())
      }
    }
    setSelectedUsers(invitees)
  }, [])

  const toggleCheckAll = async (e) => {
    if (e.target.checked) {
      setCheckAll(true)
      const inviteUsers = await props.selectAllUsers()
      setSelectedUsers(inviteUsers)
    } else {
      setCheckAll(false)
    }
  }

  const inviteUser = (e) => {
    const invitee_id = e.target.value
    let invitees = selectedUsers
    if (e.target.checked) {
      if (invitees.indexOf(invitee_id) < 0) {
        invitees.push(invitee_id)
      }
    } else {
      if (invitees.indexOf(invitee_id) >= 0) {
        invitees.splice(invitees.indexOf(invitee_id), 1)
      }
    }
    setSelectedUsers(invitees)
  }

  const markAttendance = async () => {
    let attendance = []

    for (let i in props.usersList.data) {
      const usr = props.usersList.data[i]
      attendance.push({
        user_id: usr.id,
        present: selectedUsers.indexOf(usr.id.toString()) >= 0 ? 1 : 0
      })
    }

    const response = await callApi({
      // The stringify().replace is because JSON has strings as keys - and graphql can't handle it.
      graphql: `mutation {
                markEventAttendance(event_id: ${
                  props.eventId
                }, attendance: ${JSON.stringify(attendance).replace(/"/g, '')})
            }`,
      cache: false
    })

    if (response) {
      unsetLocalCache(`events_${props.eventId}_users`)
      props.setInvitees(selectedUsers)
    }
  }

  const confirmEvent = async () => {
    props.setInvitees(selectedUsers)
    props.setShowPopover(true)
  }

  return (
    <>
      {props.editable ? (
        <>
          {!props.eventId /* Select All option is only for inivting people(event creating - eventId = 0). Attendance marking does not need it. */ ? (
            <IonItem>
              <IonCheckbox
                name="check_all"
                onIonChange={toggleCheckAll}
                value={checkAll}
              />
              &nbsp;
              <IonLabel>
                Select All Users [
                {props.usersList.total
                  ? props.usersList.total
                  : props.usersList.data.length}
                ]
              </IonLabel>
            </IonItem>
          ) : null}

          {props.disable ? (
            <IonButton
              routerLink={`/events`}
              disabled={!props.editable}
              color="primary"
              size="default"
              onClick={markAttendance}
            >
              Mark Attendance
            </IonButton>
          ) : (
            <>
              <IonSearchbar
                animated="true"
                mode="md"
                inputmode="text"
                onIonChange={(e) => setSearchText(e.target.value)}
                placeholder="Search users in this page."
              ></IonSearchbar>
              <IonButton
                disabled={!props.editable}
                color="primary"
                size="default"
                onClick={confirmEvent}
              >
                Invite Users
              </IonButton>
            </>
          )}
        </>
      ) : null}

      {props.usersList.data
        .filter(
          (user) =>
            (searchText.length && user.name.indexOf(searchText) >= 0) ||
            !searchText.length
        )
        .map((user, index) => {
          return (
            <IonItem key={index}>
              {!props.disable && !props.eventId ? (
                <IonAvatar slot="start">
                  <IonCheckbox
                    name="user_id"
                    value={user.id}
                    checked={
                      checkAll || selectedUsers.indexOf(user.id.toString()) >= 0
                        ? true
                        : false
                    }
                    onIonChange={inviteUser}
                  ></IonCheckbox>
                </IonAvatar>
              ) : null}
              <IonLabel>
                <h2>{user.name}</h2>
                <h3 className="no-padding">
                  {user.mad_email ? user.mad_email : user.email}{' '}
                  {user.phone ? '| ' + user.phone : ''}
                </h3>
                <p>
                  {user.groups &&
                    user.groups.map((group, index) => {
                      return (
                        <span key={index}>
                          {group.name}
                          {index < user.groups.length - 1 ? ', ' : null}
                        </span>
                      )
                    })}
                </p>
              </IonLabel>
              {props.eventId && props.disable && user.rsvp ? (
                <span>
                  RSVP:{' '}
                  <IonIcon
                    icon={
                      user.rsvp === 'going' || user.rsvp === 'maybe'
                        ? checkmarkCircle
                        : user.rsvp === 'cant_go'
                        ? closeCircle
                        : ellipse
                    }
                    className={user.rsvp}
                  ></IonIcon>
                </span>
              ) : null}
              {props.editable && props.eventId && props.disable ? (
                <IonCheckbox
                  slot="end"
                  mode="md"
                  value={user.id}
                  checked={
                    user.present ||
                    checkAll ||
                    selectedUsers.indexOf(user.id.toString()) >= 0
                      ? true
                      : false
                  }
                  onIonChange={inviteUser}
                ></IonCheckbox>
              ) : null}
            </IonItem>
          )
        })}
    </>
  )
})

// Component to Capture Event Form Data
const EventForm = React.memo((props) => {
  const { disable, eventId } = props

  const { user, accessLevel } = React.useContext(authContext)
  const { showMessage } = React.useContext(appContext)
  const [cities, setCities] = React.useState({})
  const [eventTypes, setEventTypes] = React.useState({})
  const [verticals, setVerticals] = React.useState({})
  const { callApi } = React.useContext(dataContext)

  const [eventData, setEventData] = React.useState({
    name: '',
    description: '',
    starts_on: '',
    place: '',
    city_id: user.city_id,
    event_type_id: 0,
    vertical_id: 0,
    audience: '',
    role: '',
    created_by_user_id: user.id,
    latitude: 0,
    longitude: 0,
    frequency: 'none',
    repeat_until: null

    // name: 'ED Vol Meet Test Event',
    // description: 'This is a test event',
    // starts_on: '2020-09-30T15:00:00+05:30',
    // place: 'Zoom',
    // city_id: "0",
    // event_type_id: 20,
    // vertical_id: "0",
    // audience: "vertical",
    // role: "fellow",
    // created_by_user_id: user.id,
    // latitude: 0,
    // longitude: 0,
    // frequency: 'none',
    // repeat_until: null
  })

  const [userFilterParameter, setUserFilterParameter] = React.useState({
    city_id: user.city_id
  })

  const updateField = (e) => {
    if (e.target.name === 'starts_on') {
      setEventData({
        ...eventData,
        starts_on: e.target.value.replace('T', ' ').replace('+05:30', '')
      })
    } else if (e.target.name === 'repeat_unil') {
      setEventData({ ...eventData, repeat_until: e.target.value.split('T')[0] })
    } else {
      setEventData({ ...eventData, [e.target.name]: e.target.value })
    }

    if (e.target.name === 'city_id') {
      if (e.target.value != 0) {
        setUserFilterParameter({
          ...userFilterParameter,
          city_id: e.target.value
        })
      } else {
        // If City is National, remove City Filter from the User Filter Parameters
        let tempFilter = { ...userFilterParameter }
        delete tempFilter.city_id
        setUserFilterParameter(tempFilter)
      }
    }
  }

  let createEvent = async (e) => {
    e.preventDefault()

    if (eventId) {
      // Edit event
      let response = await callApi({
        url: `events/${eventId}`,
        params: eventData,
        method: 'post'
      })
      if (response) {
        // All Good.
      }
    } else {
      // Create new event - so open up invite people option.
      // Validation. This is horrible. But time out. :TODO
      if (!eventData.event_type_id) {
        showMessage('Select Event Type')
      } else if (!eventData.starts_on) {
        showMessage('Set a date/time for the event')
      } else {
        props.setEventData(eventData)
        props.getEventUsers(userFilterParameter)
      }
    }
  }

  React.useEffect(() => {
    ;(function () {
      callApi({
        graphql: '{event_types {id name audience role vertical_id}}',
        cache_key: 'event_types',
        setter: setEventTypes
      })
      callApi({
        url: 'verticals',
        cache_key: 'verticals',
        setter: setVerticals
      })
      callApi({ url: 'cities', cache_key: 'cities', setter: setCities })
    })()
  }, [])

  React.useEffect(() => {
    let eventId = props.eventId
    if (eventId !== undefined && !isNaN(eventId) && eventId !== '0') {
      ;(async function () {
        let event = await callApi({ url: `events/${eventId}` })
        if (event) {
          setEventData({ ...eventData, ...event })
          props.setEventData({ ...eventData, ...event })
        }
      })()
    }
  }, [props.eventId])

  let setSendEmail = props.setSendEmail

  return (
    <IonCard className="light eventForm">
      <IonCardHeader>
        <IonCardTitle>
          <IonIcon icon={calendar}></IonIcon>{' '}
          {!disable ? 'Add/Edit Event Details' : eventData.name}
        </IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        <IonGrid>
          <IonRow>
            <IonCol size-md="6" size-xs="12">
              {/* Form to capture event details and/or show once the user opens an event  */}
              <form onSubmit={createEvent}>
                {eventId ? null : (
                  <>
                    <IonItem>
                      <IonLabel position="stacked">Target Audience</IonLabel>
                      <IonSelect
                        disabled={disable}
                        mode="md"
                        placeholder="Select Audience"
                        interface="popover"
                        name="audience"
                        value={eventData.audience}
                        onIonChange={updateField}
                      >
                        <IonSelectOption value="city">City</IonSelectOption>
                        <IonSelectOption value="center">
                          Shelter
                        </IonSelectOption>
                        <IonSelectOption value="vertical">
                          Vertical
                        </IonSelectOption>
                        <IonSelectOption value="">All</IonSelectOption>
                      </IonSelect>
                    </IonItem>

                    <IonItem>
                      <IonLabel position="stacked">Target Roles</IonLabel>
                      <IonSelect
                        disabled={disable}
                        mode="md"
                        placeholder="Select Role"
                        interface="popover"
                        name="role"
                        value={eventData.role}
                        onIonChange={updateField}
                      >
                        {accessLevel() === 'director' ? (
                          <IonSelectOption value="national">
                            Full Timers
                          </IonSelectOption>
                        ) : null}
                        {accessLevel() === 'director' ||
                        accessLevel() === 'strat' ? (
                          <IonSelectOption value="strat">
                            Strats or Above
                          </IonSelectOption>
                        ) : null}
                        <IonSelectOption value="fellow">
                          Fellows or Above
                        </IonSelectOption>
                        <IonSelectOption value="volunteer">
                          Volunteers Or Above
                        </IonSelectOption>
                        <IonSelectOption value="">Any</IonSelectOption>
                      </IonSelect>
                    </IonItem>

                    <IonItem>
                      <IonLabel position="stacked">Event Vertical</IonLabel>
                      <IonSelect
                        disabled={disable}
                        mode="md"
                        placeholder="Select Event Vertical"
                        interface="popover"
                        name="vertical_id"
                        value={eventData.vertical_id}
                        onIonChange={updateField}
                      >
                        {verticals.length &&
                          verticals.map((vertical, index) => {
                            return (
                              <IonSelectOption key={index} value={vertical.id}>
                                {vertical.name}
                              </IonSelectOption>
                            )
                          })}
                        <IonSelectOption value="0">All</IonSelectOption>
                      </IonSelect>
                    </IonItem>
                  </>
                )}

                <IonItem>
                  <IonLabel position="stacked">Event Type</IonLabel>
                  <IonSelect
                    disabled={disable}
                    mode="md"
                    placeholder="Select Event Type"
                    required
                    interface="popover"
                    name="event_type_id"
                    value={eventData.event_type_id.toString()}
                    onIonChange={updateField}
                  >
                    {eventTypes.length &&
                      eventTypes.map((eventType, index) => {
                        // Filter the Event Type Drop down based on previous options.
                        if (
                          eventData.role !== '' &&
                          eventType.role != eventData.role
                        )
                          return null
                        if (
                          eventData.audience !== '' &&
                          eventType.audience != eventData.audience
                        )
                          return null
                        if (
                          eventData.vertical_id != 0 &&
                          eventType.vertical_id != eventData.vertical_id
                        )
                          return null

                        return (
                          <IonSelectOption
                            key={index}
                            value={eventType.id.toString()}
                          >
                            {eventType.name}
                          </IonSelectOption>
                        )
                      })}
                  </IonSelect>
                </IonItem>
                <IonItem>
                  <IonLabel position="stacked">Event Name</IonLabel>
                  <IonInput
                    name="name"
                    type="text"
                    required
                    onIonChange={updateField}
                    placeholder="Enter Event Name"
                    value={eventData.name}
                    disabled={disable}
                  ></IonInput>
                </IonItem>
                <IonItem>
                  <IonLabel position="stacked">Description</IonLabel>
                  <IonTextarea
                    name="description"
                    type="text"
                    onIonChange={updateField}
                    placeholder="What is the event for?"
                    value={eventData.description}
                    disabled={disable}
                  ></IonTextarea>
                </IonItem>
                <IonItem>
                  <IonLabel position="stacked">Date &amp; Time </IonLabel>
                  <IonDatetime
                    displayFormat="D MMM YYYY h:mm A"
                    mode="md"
                    min="2020"
                    value={eventData.starts_on}
                    name="starts_on"
                    required
                    placeholder="Enter Event Date"
                    onIonChange={updateField}
                    disabled={disable}
                    minuteValues="0,15,30,45"
                  ></IonDatetime>
                </IonItem>
                <IonItem>
                  <IonLabel position="stacked">Event is happening at</IonLabel>
                  <IonInput
                    name="place"
                    type="text"
                    onIonChange={updateField}
                    placeholder="Zoom Call ID/Location Name"
                    value={eventData.place}
                    disabled={disable}
                  ></IonInput>
                </IonItem>
                <IonItem className={disable ? 'hidden' : ''}>
                  <IonCheckbox
                    mode="md"
                    name="send_email"
                    color="danger"
                    onIonChange={(e) => setSendEmail(e.target.checked)}
                  />{' '}
                  &nbsp;
                  <IonLabel color="light">Send Invitation by Email</IonLabel>
                </IonItem>
                <IonItem>
                  <IonLabel position="stacked">Event City</IonLabel>
                  <IonSelect
                    disabled={disable}
                    mode="md"
                    placeholder="Select City"
                    required
                    interface="popover"
                    name="city_id"
                    value={eventData.city_id ? eventData.city_id : user.city_id}
                    onIonChange={updateField}
                  >
                    <IonSelectOption value="0">National</IonSelectOption>
                    {cities.length &&
                      cities.map((city, index) => {
                        return (
                          <IonSelectOption key={index} value={city.id}>
                            {city.name}
                          </IonSelectOption>
                        )
                      })}
                  </IonSelect>
                </IonItem>

                <IonItem>
                  <IonLabel position="stacked">Recurring Frequency</IonLabel>
                </IonItem>
                <div className="pl-20">
                  <IonChip
                    color="primary"
                    className={eventData.frequency === 'none' ? 'selected' : ''}
                    value="none"
                    name="frequency"
                    onClick={updateField}
                  >
                    None
                  </IonChip>
                  <IonChip
                    color="primary"
                    className={
                      eventData.frequency === 'weekly' ? 'selected' : ''
                    }
                    value="weekly"
                    name="frequency"
                    onClick={updateField}
                  >
                    Weekly
                  </IonChip>
                  <IonChip
                    color="primary"
                    className={
                      eventData.frequency === 'bi-weekly' ? 'selected' : ''
                    }
                    value="bi-weekly"
                    name="frequency"
                    onClick={updateField}
                  >
                    Bi-Weekly
                  </IonChip>
                  <IonChip
                    color="primary"
                    className={
                      eventData.frequency === 'monthly' ? 'selected' : ''
                    }
                    value="monthly"
                    name="frequency"
                    onClick={updateField}
                  >
                    Monthly
                  </IonChip>
                </div>

                {eventData.frequency != 'none' ? (
                  <>
                    <IonItem>
                      <IonLabel position="stacked">Repeat Event Until</IonLabel>
                      <IonDatetime
                        displayFormat="DD MMM YYYY"
                        mode="md"
                        value={eventData.repeat_until}
                        name="repeat_until"
                        placeholder="Date until when the event needs to be repeated"
                        onIonChange={updateField}
                        min={moment().format('YYYY-MM-DD')}
                        max={moment(moment().format('YYYY') + ' April 30')
                          .add(1, 'year')
                          .format('YYYY-MM-DD')}
                        disabled={disable}
                      ></IonDatetime>
                    </IonItem>
                    <IonNote className="eventNote">
                      If left blank, even will be repeated until 30 April, or
                      end of academic year.
                    </IonNote>
                  </>
                ) : null}

                {!disable ? (
                  <IonItem>
                    <IonButton type="submit" size="default">
                      {eventId ? 'Edit Event' : 'Create Event & Invite Users'}
                    </IonButton>
                  </IonItem>
                ) : null}
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
  const { eventId, eventData } = props
  const [verticals, setVerticals] = React.useState({})
  const [groupTypes, setGroupTypes] = React.useState({})

  const [shelters, setShelters] = React.useState({})
  const [cities, setCities] = React.useState({})
  const [userGroups, setUserGroups] = React.useState({})
  const [city_id, setCityId] = React.useState(props.city_id)
  const { callApi } = React.useContext(dataContext)
  const { user, accessLevel } = React.useContext(authContext)

  const [filters, setFilters] = React.useState({
    city_in: [eventData.city_id],
    vertical_id: eventData.vertical_id,
    role: [eventData.role],
    group_in: []
  })

  const [selectedRoles, setSelectedRoles] = React.useState([])

  React.useEffect(() => {
    ;(function fetchData() {
      callApi({
        url: 'verticals',
        cache_key: 'verticals',
        setter: setVerticals
      })
      callApi({ url: 'groups', cache_key: 'groups', setter: setUserGroups })
      callApi({
        url: 'group_types',
        cache_key: 'group_types',
        setter: setGroupTypes
      })
      callApi({ url: 'cities', cache_key: 'cities', setter: setCities })
    })()

    if (!city_id) {
      setCityId(user.city_id)
    }

    if (city_id) {
      setFilters({ ...filters, city_in: [city_id] })
    }
  }, [])

  React.useEffect(() => {
    let newFilter = {}
    if (props.eventData.city_id) {
      newFilter.city_in = [props.eventData.city_id]
    }
    if (props.eventData.vertical_id) {
      newFilter.vertical_id = props.eventData.vertical_id
    }
    if (props.eventData.role) {
      newFilter.role = props.eventData.role
      setSelectedRoles(props.eventData.role)
    }

    setFilters(newFilter)
  }, [props.eventData])

  React.useEffect(() => {
    if (!city_id) return
    ;(function () {
      callApi({
        graphql: `{centers(city_id:${city_id}) {id name}}`,
        cache_key: `cities_${city_id}_centers`,
        setter: setShelters
      })
    })()
  }, [city_id])

  // :DEBUG:
  // React.useEffect(() => {
  //     console.log(filters)
  // }, [filters])

  const filterUser = (e) => {
    let tempFilter = filters

    if (e.target.name === 'city_in') {
      let city_ids = e.target.value

      if (city_ids.length > 1 && city_ids.indexOf(0) >= 0) {
        // This will remove the 'National' City selection.
        city_ids.splice(city_ids.indexOf(0), 1)
      }
      tempFilter.city_in = city_ids
    } else {
      tempFilter[e.target.name] = e.target.value
    }

    setFilters(tempFilter)
  }

  const applyFilter = () => {
    props.filterUserList(filters)
  }

  // This function will populate the role dropdown based on what you have entered for the role type(eg. IF you choose 'fellow' role type, it will put all fellow user groups into the role dropdown.)
  const filterUserGroups = async (e) => {
    let selectedValues = e.target.value
    if (selectedValues && selectedValues.length) {
      let filteredGroups = userGroups.filter(
        (group) => e.target.value.indexOf(group.type) >= 0
      )
      let filteredGroupIds = []
      filteredGroups.forEach((group) => {
        filteredGroupIds.push(group.id)
      })
      setFilters({
        ...filters,
        [e.target.name]: selectedValues,
        group_in: filteredGroupIds
      })
    } else {
      // User un-eselcted all roles - nothing selected.
      setFilters({ ...filters, [e.target.name]: selectedValues })
    }

    setSelectedRoles(selectedValues)
  }

  const clearFilter = async () => {
    let filterParameters = filters

    if (filterParameters.vertical_id) delete filterParameters.vertical_id
    if (filterParameters.group_in) delete filterParameters.group_in
    if (filterParameters.center_id) delete filterParameters.center_id

    setSelectedRoles([])

    setFilters(filterParameters)
    // props.filterUserList(filterParameters) // If we apply filter at this point, all users will be selected.
  }

  return (
    <>
      <IonRow>
        <IonCol size="12">Filter Volunteers</IonCol>
        {cities.length &&
        (accessLevel() === 'director' || accessLevel() === 'strat') ? (
          <IonCol size-xs="12" size-md="3">
            <IonItem>
              <IonSelect
                mode="md"
                placeholder="Select Cities"
                interface="alert"
                name="city_in"
                multiple
                value={filters.city_in}
                onIonChange={filterUser}
              >
                {cities.map((city, index) => {
                  return (
                    <IonSelectOption key={index} value={city.id}>
                      {city.name}
                    </IonSelectOption>
                  )
                })}
              </IonSelect>
            </IonItem>
          </IonCol>
        ) : null}

        {props.eventData.audience === 'center' && shelters.length ? (
          <IonCol size-xs="12" size-md="3">
            <IonItem>
              <IonSelect
                mode="md"
                placeholder="Select Shelter"
                interface="popover"
                name="center_id"
                value={filters.center_id}
                onIonChange={filterUser}
              >
                {shelters.map((shelter, index) => {
                  return (
                    <IonSelectOption key={index} value={shelter.id}>
                      {shelter.name}
                    </IonSelectOption>
                  )
                })}
              </IonSelect>
            </IonItem>
          </IonCol>
        ) : null}

        {verticals.length ? (
          <IonCol size-xs="12" size-md="3">
            <IonItem>
              <IonSelect
                mode="md"
                placeholder="Select Verical"
                interface="popover"
                name="vertical_id"
                value={filters.vertical_id}
                onIonChange={filterUser}
              >
                {verticals.map((vertical, index) => {
                  return (
                    <IonSelectOption key={index} value={vertical.id}>
                      {vertical.name}
                    </IonSelectOption>
                  )
                })}
              </IonSelect>
            </IonItem>
          </IonCol>
        ) : null}

        {groupTypes.length ? (
          <IonCol size-xs="12" size-md="3">
            <IonItem>
              <IonSelect
                mode="md"
                placeholder="Select Role Type(s)"
                interface="alert"
                name="role"
                value={selectedRoles}
                onIonChange={filterUserGroups}
                multiple
              >
                {groupTypes
                  .filter((groupType) => groupType.type !== 'executive')
                  .map((groupType, index) => {
                    let type_name =
                      groupType.type.charAt(0).toUpperCase() +
                      groupType.type.slice(1)
                    return (
                      <IonSelectOption key={index} value={groupType.type}>
                        {type_name}
                      </IonSelectOption>
                    )
                  })}
              </IonSelect>
            </IonItem>
          </IonCol>
        ) : null}

        {userGroups.length ? (
          <IonCol size-xs="12" size-md="3">
            <IonItem>
              <IonSelect
                mode="md"
                placeholder="Select Role(s)"
                interface="alert"
                name="group_in"
                value={filters.group_in}
                onIonChange={filterUser}
                multiple
              >
                {userGroups.map((group, index) => {
                  return (
                    <IonSelectOption key={index} value={group.id}>
                      {group.name}
                    </IonSelectOption>
                  )
                })}
              </IonSelect>
            </IonItem>
          </IonCol>
        ) : null}
      </IonRow>
      <IonItem>
        <IonButton size="default" color="primary" onClick={applyFilter}>
          Apply Filters
        </IonButton>
        <IonButton size="small" color="danger" onClick={clearFilter}>
          Clear Filters
        </IonButton>
      </IonItem>
    </>
  )
})

export default EventCreate
