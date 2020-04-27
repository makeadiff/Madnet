import { apps, appsSharp, bookOutline, bookSharp, cashOutline, cashSharp, calendarOutline, calendarSharp, 
    personCircle, personSharp, people, peopleSharp, businessOutline, businessSharp } from 'ionicons/icons';

import { SITE_URL } from './Constants';

export const volunteer_pages = [
    {
        title: 'DASHBOARD',
        url: '/dashboard',
        iosIcon: apps,
        mdIcon: appsSharp
    },
    {
        title: 'MY CLASSES',
        url: '/classes',
        iosIcon: bookOutline,
        mdIcon: bookSharp
    },
    {
        title: 'DONATIONS',
        url: SITE_URL + 'donut',
        iosIcon: cashOutline,
        mdIcon: cashSharp
    },
    {
        title: 'EVENTS',
        url: '/events/invitations',
        iosIcon: calendarOutline,
        mdIcon: calendarSharp
    },
    // {
    //     title: 'PROFILE',
    //     url: '/profile',
    //     iosIcon: personCircle,
    //     mdIcon: personSharp
    // }
];

export const fellow_pages = [
    {
        title: 'Volunteers',
        url: '/users',
        iosIcon: people,        
        mdIcon: people
    },
    {
        title: 'Shelters',
        url: '/shelters',
        iosIcon: businessOutline,
        mdIcon: businessSharp
    }
];

