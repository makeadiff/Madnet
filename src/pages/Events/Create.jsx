import { IonPage, IonLabel,IonContent, IonInput,IonAvatar,IonFabButton,IonIcon, IonGrid, IonRow, IonCol, IonCard, IonCardContent, IonItem, IonTextarea, IonCardHeader, IonCardTitle, IonSelect, IonSelectOption, IonButton, useIonViewDidEnter, IonList, IonCheckbox, IonListHeader, IonNote} from '@ionic/react';
import { add, calendar, filter } from 'ionicons/icons'
import React from 'react';
import { GOOGLE_MAPS_API_TOKEN, CITY_COORDINATES } from '../../utils/Constants'

import Title from "../../components/Title"
import './Event.css'
import MapContainer from '../../components/Map'
import { authContext } from "../../contexts/AuthContext";
import { dataContext } from "../../contexts/DataContext";

const EventCreate = () => {
    const { user } = React.useContext(authContext);
    const [ sendEmail, setSendEmail ] = React.useState(false)
    const [ usersList, setUsersList ] = React.useState({}) 
    const { getEventTypes, getUsers, callApi, getVerticals, getGroupTypes} = React.useContext(dataContext)
    
    const [ eventTypes, setEventTypes ] = React.useState({})
    const [ verticals, setVerticals ] = React.useState({})
    const [ groupTypes, setGroupTypes ] = React.useState({});

    const [ selectedShelter, setSelectedShelter ] = React.useState(0)
    const [ selectedGroups, setSelectedGroups ] = React.useState(0)    
    const [ selectedVertical, setSelectedVertical ] = React.useState(0)
    const [ selectedGroupType, setSelectedGroupType ] = React.useState();
    const [ selectedUsers, setSelectedUsers ] = React.useState([]);
    
    const [ checkAll, setCheckAll ] = React.useState(false);
    const [ userFilterParameter, setUserFilterParameter ] = React.useState({
      city_id: user.city_id
    });
    const [ userGroupFilterParameter, setUserGroupFilterParameter ] = React.useState({});
    
    const [ location, setLocation ] = React.useState({})
    const [ shelters, setShelters ] = React.useState({})
    const [ userGroups, setUserGroups ] = React.useState({})
    const [ eventData, setEventData ] = React.useState({
      name: '',
      description: '',
      starts_on: '',
      time: '',
      place: '',
      city_id: user.city_id,
      event_type_id: 0,      
      created_by_user_id: user.id,
      latitude: 0,
      longitude: 0,   
    });
    const [ errorMessage, setErrorMessage ] = React.useState('');


    const getUpdatedLocation = (location, address) => {
      let locationData = {
        lat: location.lat(),
        lng: location.lng()
      }
      
      if(eventData.place !== ''){
        setEventData({
          ...eventData,
          place: address
        })
      }

      setLocation(locationData);
      setEventData({...eventData, latitude: locationData.lat, longitude: locationData.lng})
    }

    const filterUser = async (e) => {
      let filter_name = e.target.name;
      let filterParameters = userFilterParameter;
      let groupFilterParameter = userGroupFilterParameter;
      let value = e.target.value

      if(e.target.value){      
        if(filter_name === 'shelter_id'){          
          filterParameters.center_id = value;     
          setSelectedShelter(value);   
        }

        if(filter_name === 'group_id'){          
          setSelectedGroups(value);
          filterParameters.group_in = value.join(",");        
          
          // Unset Vertical Selection Upon Groups Selection 
          if(filterParameters.vertical_id) delete filterParameters.vertical_id;
          
        }

        if(filter_name === 'vertical_id'){          
          filterParameters.vertical_id = value
          groupFilterParameter['vertical_id'] = value;

          setSelectedVertical(value)
          setUserGroupFilterParameter(groupFilterParameter)                   
        }

        if(filter_name === 'group_types'){
          groupFilterParameter.type_in = value.join(',');
          setSelectedGroupType(value)
          setUserGroupFilterParameter(groupFilterParameter)
        }

        if(filter_name=== 'group_types' || filter_name === 'vertical_id'){
          let userGroupData = [];
          let apiUrl = `groups/?`;
          console.log(userGroupFilterParameter);
          Object.keys(userGroupFilterParameter).map((key,index)=> {
            apiUrl += key+'='+userGroupFilterParameter[key]+'&'
          });

          console.log(apiUrl);
          userGroupData = await callApi({url: apiUrl})          

          if(userGroupData){
            setUserGroups(userGroupData) 
          }
          // Unset UserGroup Selection Upon Groups Selection 
          if(filterParameters.group_in){
            delete filterParameters.group_in;
            setSelectedGroups([]);
          }
        }

        console.log(filterParameters);
        setUserFilterParameter(filterParameters);

        let users = await getUsers(userFilterParameter);
        setUsersList(users);
      }
    }

    const clearFilter = async (e) => {
      
      setSelectedShelter();
      setSelectedGroups();
      setSelectedVertical();
      setSelectedGroupType();

      let filterParameters = userFilterParameter;
      let groupFilterParameter = userGroupFilterParameter;

      if(filterParameters.vertical_id) delete filterParameters.vertical_id;
      if(filterParameters.group_in) delete filterParameters.group_in;
      if(filterParameters.center_id) delete filterParameters.center_id;

      if(groupFilterParameter.vertical_id) delete groupFilterParameter.vertical_id;
      if(groupFilterParameter.type_in) delete groupFilterParameter.type_in;

      setUserFilterParameter(filterParameters);
      setUserGroupFilterParameter(groupFilterParameter);
      
      let users = await getUsers(userFilterParameter);
      setUsersList(users);

      let groups = await callApi({url: 'groups'});
      setUserGroups(groups);
    }

    const toggleCheckAll = e => {
      if(e.target.checked){
        setCheckAll(true);
      }
      else{
        setCheckAll(false);
      }
    }

    const updateField = e => {      
      setEventData({
        ...eventData,
        [e.target.name]: e.target.value
      })      
    }

    let inviteUser = e => {      
      let invitee_id = e.target.value;
      let invitees = selectedUsers;
      if(e.target.checked) {
        if(invitees.indexOf(invitee_id) < 0) {
          invitees.push(invitee_id);
        }
      }   
      else {
        if(invitees.indexOf(invitee_id) >= 0) {
          invitees.splice(invitees.indexOf(invitee_id),1);
        }
      }      
      setSelectedUsers(invitees);
    }

    let createEvent = async (e) => {
      e.preventDefault();
      console.log(eventData);

      if(!eventData.event_type_id){
        setErrorMessage('Select Event Type');        
      }
      else{
        setErrorMessage('');
        let users = await getUsers(userFilterParameter);      
        setUsersList(users);
      }      
    }

    let submitForm = async () => {
      let event = eventData;
      event.starts_on +=  ' '+event.time;
      delete event.time;

      let response = await callApi({url: 'events', params: event, method: 'post'});
      // console.log(response);

      if(response){
        let event_id = response.id;
        let email = 0
        if(sendEmail){
          email = 1;
        }

        let sendInvites = await callApi({
          url: `events/${event_id}/users`,
          method: `post`,
          params: {
            invite_user_ids: selectedUsers.join(','),
            send_invite_emails: email
          }
        });

        // console.log(sendInvites);
      }
    }

    React.useEffect(() => {

      async function fetchEventTypes() {
        let eventTypesData = [];

        eventTypesData = await getEventTypes();        
        if(eventTypesData){
          setEventTypes(eventTypesData);
        }                
      }
      fetchEventTypes();

      async function fetchGroupTypes() {
        let groupTypesData = [];

        groupTypesData = await getGroupTypes();        
        if(groupTypesData){
          setGroupTypes(groupTypesData);
        }
      }
      fetchGroupTypes();

      async function fetchShelters() {
        let shelterData = [];
        shelterData = await callApi({url: "cities/" + user.city_id + "/centers" })
        if(shelterData){
          setShelters(shelterData)
        }
      }
      fetchShelters();

      async function fetchUserGroups() {
        let userGroupData = [];
        userGroupData = await callApi({url: "groups"})
        if(userGroupData){
          setUserGroups(userGroupData) 
        }        
      }
      fetchUserGroups();

      async function fetchVerticals(){
        let verticalData = [];
        verticalData = await getVerticals();
        if(verticalData){
          setVerticals(verticalData)
        }
      }      
      fetchVerticals();

    }, [user])

    return (      
      <IonPage>
        <Title name="Create Event"/>

        <IonContent className="dark">                        
          <IonCard className="dark eventForm">{/* This line was <IonCard className="light eventForm"> */}
            <IonCardHeader>
              <IonCardTitle>
                <IonIcon icon={calendar}></IonIcon>Enter Event Details
              </IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonGrid>
                <IonRow>
                  <IonCol size-md="6" size-xs="12">
                    <form onSubmit={createEvent}>
                      <IonItem>
                        <IonLabel position="stacked">Event Name</IonLabel>
                        <IonInput name="name" type="text" required onIonChange={updateField} placeholder="Enter Event Name"></IonInput>
                      </IonItem>
                      <IonItem>
                        <IonLabel position="stacked">Event Description</IonLabel>
                        <IonTextarea name="description" type="text" onIonChange={updateField} placeholder="What is the event for?"></IonTextarea>
                      </IonItem>
                      <IonItem>
                        <IonLabel position="stacked">Event Date</IonLabel>
                        <IonInput name="starts_on" type="date" required onIonChange={updateField} placeholder="Enter Event Date"></IonInput>
                      </IonItem>
                      <IonItem>
                        <IonLabel position="stacked">Event Time</IonLabel>
                        <IonInput name="time" type="time" required onIonChange={updateField} placeholder="Enter Event Name"></IonInput>
                      </IonItem>
                      <IonItem>
                        <IonLabel position="stacked">Event Location</IonLabel>
                        <IonInput name="place" type="text" onIonChange={updateField} placeholder="Enter Event Location Name"></IonInput>
                      </IonItem>
                      <IonItem>
                        <IonCheckbox name="send_email" color="danger" onIonChange={e => setSendEmail(e.target.checked)}/> &nbsp;
                        <IonLabel>Send Invitation by Email</IonLabel>                      
                      </IonItem>                      
                      <IonItem>
                        <IonLabel position="stacked">Event Type</IonLabel>
                        { eventTypes.length ? (
                        <IonSelect  placeholder="Select Event Type" required interface="alert" name="event_type_id" value={eventData.event_type_id} onIonChange={updateField}>
                          {                                                                                                       
                            eventTypes.map((eventType,index) => {
                              return (
                                <IonSelectOption key={index} value={eventType.id}>{eventType.name}</IonSelectOption>
                              )
                            })
                          }
                        </IonSelect>
                        ): null }
                      </IonItem>
                      {errorMessage? (
                        <IonLabel color="danger">{errorMessage}</IonLabel>
                      ):null}
                      <IonItem>
                          <IonButton type="submit" size="default">Save</IonButton>
                      </IonItem>   
                    </form>
                  </IonCol>
                  <IonCol size-md="6" size-xs="12">
                    <MapContainer
                      googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_TOKEN}&v=3.exp&libraries=geometry,drawing,places`}
                      loadingElement={<div style={{ height: `100%` }} />}
                      containerElement={<div style={{ paddingTop: `40px`, height: `400px` }} />}
                      mapElement={<div style={{height: `100%` }} />}
                      coordinates={CITY_COORDINATES[user.city_id]}
                      locationUpdate={getUpdatedLocation}
                      isMarkerShown
                    />
                  </IonCol>
                </IonRow>
              </IonGrid>                             
            </IonCardContent>
          </IonCard>              
          { usersList ? (            
            <IonCard className="dark">
              <IonCardHeader>
                <IonCardTitle>
                  Select Users to Invite to Event.
                  <IonItem>
                  {shelters.length? (
                    <IonSelect placeholder="Select Shelter" interface="alert" name="shelter_id" value={selectedShelter} onIonChange={filterUser}>
                      {
                        shelters.map((shelter,index) => {
                          return (
                            <IonSelectOption key={index} value={shelter.id}>{shelter.name}</IonSelectOption>
                          )
                        })
                      }
                    </IonSelect>
                  ):null}

                  {verticals.length? (
                    <IonSelect placeholder="Select Verical" interface="alert" name="vertical_id" value={selectedVertical} onIonChange={filterUser}>
                      {
                        verticals.map((vertical,index) => {
                          return (
                            <IonSelectOption key={index} value={vertical.id}>{vertical.name}</IonSelectOption>
                          )
                        })
                      }
                    </IonSelect>
                  ):null}

                  {groupTypes.length? (
                    <IonSelect placeholder="Select Role Type(s)" interface="alert" name="group_types" value={selectedGroupType}  onIonChange={filterUser} multiple>
                      {
                        groupTypes.map((groupType,index) => {
                          return (
                            <IonSelectOption key={index} value={groupType.type}>{groupType.type}</IonSelectOption>
                          )
                        })
                      }
                    </IonSelect>
                  ):null}

                  {userGroups.length? (
                    <IonSelect placeholder="Select Role(s)" interface="alert" name="group_id" value={selectedGroups} onIonChange={filterUser} multiple>
                      {
                        userGroups.map((group,index) => {
                          return (
                            <IonSelectOption key={index} value={group.id}>{group.name}</IonSelectOption>
                          )
                        })
                      }
                    </IonSelect>
                  ):null}
                  <IonButton size="small" color="danger" onClick={clearFilter}>Clear Filter(s)</IonButton>
                </IonItem>
                </IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                {usersList.length? (                               
                  <>
                  <IonList>
                    <IonListHeader>
                      <IonItem>
                      <IonCheckbox name="check_all" onIonChange={toggleCheckAll} />&nbsp;
                      <IonLabel>Select All Users [{usersList.length}]</IonLabel>
                      </IonItem>                                         
                      {/* <IonInput className="search" name="search_user_name" placeholder="Search User..." onIonChange={filterUser}></IonInput> */}                                            
                    </IonListHeader>
                    <IonButton size="default" onClick={submitForm}>Invite Users</IonButton>
                  {usersList.map((user,index) => {
                    return(                      
                      <IonItem key={index}>
                        <IonAvatar slot="start">  
                          <IonCheckbox name="user_id" value={user.id} checked={checkAll} onIonChange={inviteUser}></IonCheckbox>                        
                        </IonAvatar>
                        <IonLabel>
                          <h2>{user.name}</h2>
                          <h3 className="no-padding">{user.email} | {user.phone}</h3>
                          <p>
                            {
                              user.groups.map((group,index) => {
                                return (
                                  <span key={index}>{group.name}{(index < user.groups.length - 1) ? ', ': null}</span>
                                )
                              })
                            }
                          </p>
                        </IonLabel>
                      </IonItem>                                            
                    );
                  })}
                  </IonList>
                  <IonButton color="primary" size="default" onClick={submitForm}>Invite Users</IonButton>   
                  </>                   
                ):(
                  <IonLabel>No Users in the selected filter.</IonLabel>
                )}                
              </IonCardContent>
            </IonCard>              
          ):null}
        </IonContent>
      </IonPage>      
    );
};

export default EventCreate;
