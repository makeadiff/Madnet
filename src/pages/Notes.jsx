import { IonContent,IonPage,IonCard,IonCardHeader,IonCardTitle,IonCardSubtitle,IonCardContent } from '@ionic/react'
import React from 'react'
import { useParams } from "react-router-dom"

import Autolinker from 'autolinker'
import renderHTML from 'react-render-html'

import { dataContext } from '../contexts/DataContext'
import Title from '../components/Title'
import moment from 'moment'

const Notes = ({ item_type }) => {
    const { item_id } = useParams()
    const { callApi } = React.useContext(dataContext)
    const [comments, setComments] = React.useState([])
    const [name, setName] = React.useState([])

    React.useEffect(() => {
        const fetchComments = async () => {
            const item = await callApi({graphql: `{ ${item_type}(id: ${item_id}) { 
                    id name comments { 
                        id comment added_on added_by_user {
                            id
                            name
                        }
                    }} }`})
            setName(item.name)
            setComments(item.comments)
        }
        fetchComments()
    }, [item_type, item_id])

    return (
        <IonPage>
            <Title name={ "Notes on " + name } />

            <IonContent>
                { comments.map((comment, index) => {
                    let comment_html = Autolinker.link(comment.comment.replace(/\n/, "<br />"))

                    return (
                        <IonCard class="light list" key={index} routerDirection="none" >
                            <IonCardHeader className="noPadding">
                                <IonCardTitle><p>Note from {comment.added_by_user.name}</p></IonCardTitle>
                                <IonCardSubtitle>{ moment(comment.added_on).format("MMM D, YYYY") }</IonCardSubtitle>
                            </IonCardHeader>
                            <IonCardContent>
                                { renderHTML(comment_html) }
                            </IonCardContent>
                        </IonCard>)
                })}

            </IonContent>
        </IonPage>
    );
};

export default Notes
