import { IonPage, IonLabel,IonContent, IonInput,IonAvatar,IonFabButton,IonIcon, IonGrid, IonRow, IonCol, IonCard, IonCardContent, IonItem, IonTextarea, IonCardHeader, IonCardTitle, IonSelect, IonSelectOption, IonButton, useIonViewDidEnter, IonList, IonCheckbox, IonSelectPopover, IonListHeader} from '@ionic/react';
import { add, calendar } from 'ionicons/icons'
import React from 'react';
import { GOOGLE_MAPS_API_TOKEN, CITY_COORDINATES } from '../../utils/Constants'

import Title from "../../components/Title"
import './Event.css'
import MapContainer from '../../components/Map'
import { authContext } from "../../contexts/AuthContext";
import { dataContext } from "../../contexts/DataContext";
import UserDetail from '../../components/User';

const EventCreate = () => {

    const { hasPermission } = React.useContext(authContext);
    const { user } = React.useContext(authContext);
    const [ inviteUsers, setInviteUsers ] = React.useState(false)
    const [ usersList, setUsersList ] = React.useState({}) 
    const { getEventTypes, getUsers, callApi } = React.useContext(dataContext)
    const [ eventTypes, setEventTypes ] = React.useState({})
    const [ selectedShelter, setSelectedShelter ] = React.useState(0)
    const [ selectedGroups, setSelectedGroups ] = React.useState(0)
    const [ checkAll, setCheckAll ] = React.useState(false);
    const [ userFilterParameter, setUserFilterParameter ] = React.useState({});
    
    const [ location, setLocation ] = React.useState({})
    const [ shelters, setShelters ] = React.useState({})
    const [ userGroups, setUserGroups ] = React.useState({})
    const [ eventData, setEventData ] = React.useState({
      name: '',
      description: '',
      starts_on: '',
      place: '',
      city_id: user.city_id,
      event_type_id: 0,      
      created_by_user_id: user.id,
      latitude: 0,
      longitude: 0,   
    });


    const getUpdatedLocation = (data) => {
      let locationData = {
        lat: data.lat(),
        lng: data.lng()
      }
      setLocation(locationData);
      setEventData({...eventData, latitude: locationData.lat, longitude: locationData.lng})
    }

    const filterUser = async (e) => {
      let filter_name = e.target.name;
      let filterParameters = userFilterParameter;
      if(filter_name === 'shelter_id'){
        let value = e.target.value;
        filterParameters.center_id = value;     
        setSelectedShelter(value);   
      }

      if(filter_name === 'group_id'){
        let value = e.target.value;
        setSelectedGroups(value);
        filterParameters.group_in = '';
        value.map((group_id, index) => {
          filterParameters.group_in += group_id;
          if(index < (value.length - 1)){
            filterParameters.group_in += ',';
          }
        });
      }

      console.log(filterParameters);
      setUserFilterParameter(filterParameters);

      let users = await getUsers(userFilterParameter);
      setUsersList(users);
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

    let createEvent = async () => {
      let users = await getUsers({
        city_id: user.city_id
      });
      setUsersList(users);
      setInviteUsers(true);
      
      console.log(eventData);
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

    }, [user])

    return (      
      <IonPage>
        <Title name="Create Event"/>

        <IonContent className="dark">                        
          <IonCard className="light eventForm">
            <IonCardHeader>
              <IonCardTitle>
                <IonIcon icon={calendar}></IonIcon>Enter Event Details
              </IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonGrid>
                <IonRow>
                  <IonCol size-md="6" size-xs="12">
                    <IonItem>
                      <IonLabel position="stacked">Event Name</IonLabel>
                      <IonInput name="name" type="text" onIonChange={updateField} placeholder="Enter Event Name"></IonInput>
                    </IonItem>
                    <IonItem>
                      <IonLabel position="stacked">Event Description</IonLabel>
                      <IonTextarea name="description" type="text" onIonChange={updateField} placeholder="What is the event for?"></IonTextarea>
                    </IonItem>
                    <IonItem>
                      <IonLabel position="stacked">Event Date</IonLabel>
                      <IonInput name="starts_on" type="date" onIonChange={updateField} placeholder="Enter Event Name"></IonInput>
                    </IonItem>
                    <IonItem>
                      <IonLabel position="stacked">Event Time</IonLabel>
                      <IonInput name="starts_on" type="time" onIonChange={updateField} placeholder="Enter Event Name"></IonInput>
                    </IonItem>
                    <IonItem>
                      <IonLabel position="stacked">Event Location</IonLabel>
                      <IonInput name="place" type="text" onIonChange={updateField} placeholder="Enter Event Location Name"></IonInput>
                    </IonItem>
                    <IonItem>
                      <IonCheckbox name="send_email" color="danger"/> &nbsp;
                      <IonLabel>Send Invitation by Email</IonLabel>                      
                    </IonItem>
                    <IonItem>
                      <IonLabel position="stacked">Event Type</IonLabel>
                      { eventTypes.length ? (
                      <IonSelect  placeholder="Select Event Type" interface="alert" name="event_type_id" value={eventData.event_type_id} onIonChange={updateField}>
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
                    <IonItem>
                        <IonButton type="submit" size="default" onClick={createEvent}>Save</IonButton>
                    </IonItem>   
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
          { inviteUsers ? (            
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
                </IonItem>
                </IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                {usersList.length? (                               
                  <IonList>
                    <IonListHeader>
                      <IonItem>
                      <IonCheckbox name="check_all" onIonChange={toggleCheckAll} />&nbsp;
                      <IonLabel>Select All Users</IonLabel>
                      </IonItem>                                         
                      <IonInput className="search" placeholder="Search User..."></IonInput>
                    </IonListHeader>
                  {usersList.map((user,index) => {
                    return(
                      <IonItem key={index}>
                        <IonAvatar slot="start">  
                          <IonCheckbox name="user_id" value={user.id} checked={checkAll}></IonCheckbox>                        
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
                ):null}                                
              </IonCardContent>
            </IonCard>              
          ):null}
        </IonContent>
      </IonPage>      
    );
};

export default EventCreate;
