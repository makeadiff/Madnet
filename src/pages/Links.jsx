import { IonContent, IonPage } from '@ionic/react';
import React from 'react';

import { dataContext } from '../contexts/DataContext'
import { authContext } from '../contexts/AuthContext'

import Title from '../components/Title';
import "./Links.css"

const Links = () => {
    const { callApi } = React.useContext(dataContext)
    const { user } = React.useContext(authContext)
    const [ links, setLinks ] = React.useState({})

    React.useEffect(() => {
        const getLinks = () => {
            callApi({url: `/users/${user.id}/grouped_links`}).then((data) => {
                setLinks(data)
            })
        }
        getLinks()
    }, [user])

    return (
        <IonPage>
            <Title name="Support Links" />

            <IonContent>
                {Object.entries(links).map((section, key) => {
                    return (<LinkSection key={key} index={section[0]} section={section[1]} />)
                })}
            </IonContent>
        </IonPage>
    )
}

const LinkSection = ({ index, section }) => {
    let key_plural = index + "s" // Only coving groups || verticals || centers - so 'es' not needed.

    if((index === "general" || index === "city" || index === "links") && section.links.length) {
        return (
            <div className="section">
            { section.name ? <h3>{section.name}</h3> : null }
            { section.links ? section.links.map((link, index) => { 
                return (<OutLink key={index} link={link} />)
            }) : null }
            </div>
        )
    } else {
        if( section[key_plural] !== undefined && Object.keys(section[key_plural]).length ) { 
            return (
                <>
                {Object.entries(section[key_plural]).map((sect, k) => {
                    return (<LinkSection key={k} section={sect[1]} index="links" /> ) // Recursion.
                })}
                </>
            )
        }
    }
    return null
}

const OutLink = ({ link }) => {
    return (
        <div className="link">
            <a href={link.url}>{link.name}</a><br />
            <p>{link.text}</p>
        </div>
    )
}

export default Links
