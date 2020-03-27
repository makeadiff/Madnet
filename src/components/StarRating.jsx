import React from 'react';
import { starOutline, star } from 'ionicons/icons';
import { IonIcon } from '@ionic/react';
import './StarRating.css'

const StarRating = ({ min,max,value,onChange,style }) => {
    if(value === undefined) value = 0
    const [ rating, setRating ] = React.useState(value)
    let stars = []
    for(let i=0; i<max; i++) stars.push(i+1)
    console.log(rating, value)

    return stars.map((number) => {
        let filled = false
        if(rating >= number) filled = true
        return <Star value={number} filled={filled} style={style} onClick={ e => { setRating(e.target.value); }} />
    })
};

const Star = ({value, filled, style, onClick}) => {
    let icon = starOutline
    if(filled) icon = star
    return <span onClick={onClick}><IonIcon value={value} slot="start" icon={icon} style={style} /></span>
}

export default StarRating;
