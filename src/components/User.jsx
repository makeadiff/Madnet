import {
  IonItem,
  IonCard,
  IonGrid,
  IonRow,
  IonCol,
  IonChip,
  IonCardHeader,
  IonCardTitle,
  IonPopover,
  IonIcon,
  IonCardContent,
  IonAlert
} from '@ionic/react'
import React from 'react'
import { Link, useHistory } from 'react-router-dom'

import {
  ellipsisVertical,
  trash,
  personRemove,
  person,
  pencilOutline
} from 'ionicons/icons'
import { authContext } from '../contexts/AuthContext'
import { dataContext } from '../contexts/DataContext'

import './Users.css'

const UserDetail = ({ user, index }) => {
  const [showOptions, setShowOptions] = React.useState(false)
  const { hasPermission } = React.useContext(authContext)
  const { deleteUser, updateUser } = React.useContext(dataContext)
  const [confirmDelete, setConfirmDelete] = React.useState(false)
  const [confirmAlumni, setConfirmAlumni] = React.useState(false)
  const history = useHistory()

  let markAlumni = async () => {
    setShowOptions(false)
    let response = await updateUser(user.id, { user_type: 'alumni' })
    if (response) {
      setConfirmDelete(false)
      history.push(`/users`)
      // console.log(response)
    }
    //TODO: Remove Caching of Data upon update.
  }

  let deleteVolunteer = async () => {
    setShowOptions(false)
    let response = await deleteUser(user.id)
    if (response) {
      setConfirmDelete(false)
      history.push(`/users`)
      // console.log(response)
    }
    //TODO: Remove Caching of Data upon update.
  }

  return (
    <>
      <IonPopover
        isOpen={showOptions}
        onDidDismiss={() => setShowOptions(false)}
      >
        <IonItem
          button
          routerLink={`/users/${user.id}/`}
          routerDirection="none"
          onClick={() => setShowOptions(false)}
        >
          <IonIcon className="userOptions" icon={person}></IonIcon> View{' '}
          {user.name}
        </IonItem>
        {hasPermission('user_edit') ? (
          <>
            <IonItem
              button
              routerLink={`/users/${user.id}/edit`}
              routerDirection="none"
              onClick={() => setShowOptions(false)}
            >
              <IonIcon className="userOptions" icon={pencilOutline}></IonIcon>{' '}
              Edit {user.name}
            </IonItem>
            <IonItem button onClick={() => setConfirmAlumni(true)}>
              <IonIcon className="userOptions" icon={personRemove}></IonIcon>{' '}
              Mark Alumni
            </IonItem>
            <IonItem button onClick={() => setConfirmDelete(true)}>
              <IonIcon className="userOptions" icon={trash}></IonIcon> Delete
            </IonItem>
          </>
        ) : null}
      </IonPopover>

      <IonCard class="light list user" key={index}>
        <IonCardHeader>
          <IonGrid>
            <IonRow>
              <IonCol size="11">
                <IonCardTitle>
                  <Link to={`/users/${user.id}/`}>
                    #{index + 1}. {user.name}
                  </Link>
                </IonCardTitle>
              </IonCol>
              <IonCol size="1">
                <IonItem
                  size="small"
                  slots="end"
                  className="userEditButton"
                  onClick={() => setShowOptions(true)}
                >
                  <IonIcon icon={ellipsisVertical} color="light"></IonIcon>
                </IonItem>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonCardHeader>

        <IonCardContent>
          <IonGrid>
            <IonRow>
              <IonCol size-md="4" size-xs="11">
                <p>
                  Email: <strong>{user.email}</strong>
                </p>
                {user.mad_email ? <p>MAD Email: {user.mad_email}</p> : null}
                <p>{user.phone}</p>
                <p>
                  Credit: <strong>{user.credit}</strong>
                </p>
              </IonCol>
              <IonCol size-md="7" size-xs="12">
                {user.groups
                  ? user.groups.map((role, count) => {
                      return (
                        <IonChip className="roles" key={count}>
                          {role.name}
                        </IonChip>
                      )
                    })
                  : null}
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonCardContent>
      </IonCard>

      <IonAlert
        isOpen={confirmDelete}
        onDidDismiss={() => {
          setConfirmDelete(false)
          setShowOptions(false)
        }}
        header="Delete"
        message={`Are you sure you wish to delete ${user.name}?`}
        buttons={[
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => {}
          },
          {
            text: 'Delete',
            handler: () => deleteVolunteer(user.id)
          }
        ]}
      />

      <IonAlert
        isOpen={confirmAlumni}
        onDidDismiss={() => {
          setConfirmAlumni(false)
          setShowOptions(false)
        }}
        header={'Mark as Alumni'}
        message={
          'Are you sure you wish to mark ' + user.name + ' as an alumni?'
        }
        buttons={[
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'secondary',
            handler: (e) => {}
          },
          {
            text: 'Mark as Alumni',
            handler: (e) => markAlumni(user.id)
          }
        ]}
      />
    </>
  )
}

export default UserDetail
