import {
  IonContent,
  IonPage,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonTextarea,
  IonButton
} from '@ionic/react'
import React from 'react'
import { useParams } from 'react-router-dom'

import Autolinker from 'autolinker'
import renderHTML from 'react-render-html'

import { dataContext } from '../contexts/DataContext'
import { authContext } from '../contexts/AuthContext'
import { appContext } from '../contexts/AppContext'
import Title from '../components/Title'
import moment from 'moment'

const Notes = ({ item_type }) => {
  const { item_id } = useParams()
  const { callApi, unsetLocalCache } = React.useContext(dataContext)
  const { user } = React.useContext(authContext)
  const { showMessage } = React.useContext(appContext)
  const [comments, setComments] = React.useState([])
  const [name, setName] = React.useState([])
  const [note, setNote] = React.useState('')

  React.useEffect(() => {
    fetchComments()
  }, [item_type, item_id])

  const fetchComments = async () => {
    const item = await callApi({
      graphql: `{ ${item_type}(id: ${item_id}) { 
                id name comments { 
                    id comment added_on added_by_user {
                        id
                        name
                    }
                }} }`,
      cache_key: `${item_type}s/${item_id}/notes`
    })
    setName(item.name)
    setComments(item.comments)
  }
  const updateNote = (e) => {
    setNote(e.target.value)
  }

  const addNewNote = () => {
    if (!note) {
      showMessage('Please enter a note', 'error')
      return
    }
    const item_type_plural = item_type + 's' // For now, just Center and Student. So no 'es' confusion.
    callApi({
      url: `/${item_type_plural}/${item_id}/comments`,
      method: 'post',
      params: {
        comment: note,
        added_by_user_id: user.id
      }
    }).then((data) => {
      if (data) {
        setNote('')
        unsetLocalCache(`${item_type}s/${item_id}/notes`)
        showMessage('Comment added successfully', 'info')
        setComments(
          comments.concat({
            id: data.id,
            added_by_user: { id: user.id, name: user.name },
            added_on: moment().format('YYYY-MM-DD HH:mm:ss'),
            comment: note
          })
        )
      }
    })
  }

  return (
    <IonPage>
      <Title name={'Notes on ' + name} />

      <IonContent>
        {comments.map((comment, index) => {
          let comment_html = Autolinker.link(
            comment.comment.replace(/\n/, '<br />')
          )

          return (
            <IonCard class="light list" key={index} routerDirection="none">
              <IonCardHeader className="noPadding">
                <IonCardTitle>
                  <p>Note from {comment.added_by_user.name}</p>
                </IonCardTitle>
                <IonCardSubtitle>
                  {moment(comment.added_on).format('MMM D, YYYY')}
                </IonCardSubtitle>
              </IonCardHeader>
              <IonCardContent>{renderHTML(comment_html)}</IonCardContent>
            </IonCard>
          )
        })}

        <IonCard class="light list" routerDirection="none">
          <IonCardHeader className="noPadding">
            <IonCardTitle>
              <p>New Note</p>
            </IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonTextarea
              value={note}
              onIonChange={updateNote}
              required={true}
              placeholder="Add any comments here"
            ></IonTextarea>
            <IonButton type="submit" onClick={addNewNote}>
              Add Note
            </IonButton>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  )
}

export default Notes
